'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Dynamically import react-select without SSR.
const ReactSelect = dynamic(() => import('react-select'), { ssr: false });

const AddPaymentPopup = () => {
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomerNames();
  }, []);

  const fetchCustomerNames = async () => {
    try {
      const response = await axios.get('http://15.207.48.53:3000/customers');
      const customers = (response.data as any[]).map((customer: any) => ({
        label: customer.name,
        value: customer.name,
      }));
      setCustomerList(customers);
    } catch (error) {
      console.error('Error fetching customer names:', error);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!selectedCustomer || !paymentAmount) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const response = await axios.post('http://15.207.48.53:3000/addPayment', {
        customer: selectedCustomer.value,
        method: paymentMethod,
        amount: parseFloat(paymentAmount),
      });
      console.log('Payment added successfully:', response.data);
      clearForm();
    } catch (error) {
      console.error('Error adding payment:', error);
      setError('Failed to add payment. Please try again.');
    }
  };

  const clearForm = () => {
    setSelectedCustomer(null);
    setPaymentAmount('');
    setPaymentMethod('cash');
    setError('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Payment</h2>

        <ReactSelect
          options={customerList}
          value={selectedCustomer}
          onChange={setSelectedCustomer}
          placeholder="Select Customer"
          className="mb-4"
        />

        <input
          type="number"
          placeholder="Payment Amount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <div className="mb-4">
          <p className="mb-2 font-medium">Payment Method:</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="bankTransfer"
                checked={paymentMethod === 'bankTransfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Bank Transfer
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded w-1/2 mr-2"
          >
            Save
          </button>
          <button
            onClick={clearForm}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded w-1/2"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentPopup;
