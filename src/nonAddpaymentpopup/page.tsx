'use client';

import React, { useState, useEffect } from 'react';
import DropDown from 'react-dropdown-select';
import axios from 'axios';

const NonAddPaymentPopup = () => {
    const [customerList, setCustomerList] = useState<{ label: string, value: string }[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomerNames();
    }, []);

    const fetchCustomerNames = async () => {
        try {
            const response = await axios.get('http://15.207.48.53:3000/nongstcustomer');
            const customers = (response.data as { name: string }[]).map(customer => ({
                label: customer.name,
                value: customer.name
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
            const response = await axios.post('http://15.207.48.53:3000/nonaddPayment', { 
                customer_id: selectedCustomer,
                amount: parseFloat(paymentAmount),
                method: paymentMethod,
            });
            console.log('Payment added successfully:', response.data);
            clearForm();
        } catch (error) {
            console.error('Error adding payment:', error);
            setError('Failed to add payment. Please try again.');
        }
    };

    const clearForm = () => {
        setSelectedCustomer('');
        setPaymentAmount('');
        setPaymentMethod('cash');
        setError('');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Payment</h2>

                <DropDown
                    options={customerList}
                    values={customerList.filter(customer => customer.value === selectedCustomer)}
                    onChange={(values: { label: string, value: string }[]) => setSelectedCustomer(values[0]?.value)}
                    placeholder="Select Customer"
                    className="w-full border p-2 rounded mb-3"
                />

                <input
                    type="number"
                    className="w-full border p-2 rounded mb-3"
                    placeholder="Payment Amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                />

                <div className="mb-3">
                    <label className="block font-medium">Payment Method:</label>
                    <div className="flex gap-4 mt-2">
                        {['cash', 'bankTransfer', 'upi'].map((method) => (
                            <label key={method} className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                    className="mr-2"
                                />
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <div className="flex justify-between">
                    <button onClick={handleSave} className="bg-purple-600 text-white py-2 px-4 rounded">Save</button>
                    <button onClick={clearForm} className="bg-gray-400 text-white py-2 px-4 rounded">Clear</button>
                </div>
            </div>
        </div>
    );
};

export default NonAddPaymentPopup;
