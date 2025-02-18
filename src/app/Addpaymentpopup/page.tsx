'use client';

import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView
} from 'react-native';
import { RadioGroup, Radio } from 'react-radio-group';
import Select from 'react-select';
import axios from 'axios';

const AddPaymentPopup = () => {
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomerNames();
    }, []);

    const fetchCustomerNames = async () => {
        try {
            const response = await axios.get('http://15.207.48.53:3000/customers');
            const customers = response.data.map(customer => ({
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
        <div className="flex justify-center items-center h-screen">
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Add Payment</h2>

                    <Select
                        options={customerList}
                        value={selectedCustomer}
                        onChange={setSelectedCustomer}
                        placeholder="Select Customer"
                        className="mb-4"
                    />

                    <TextInput
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        placeholder="Payment Amount"
                        keyboardType="numeric"
                        value={paymentAmount}
                        onChangeText={setPaymentAmount}
                    />

                    <RadioGroup name="paymentMethod" selectedValue={paymentMethod} onChange={setPaymentMethod}>
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="flex items-center gap-2">
                                <Radio value="cash" /> Cash
                            </label>
                            <label className="flex items-center gap-2">
                                <Radio value="bankTransfer" /> Bank Transfer
                            </label>
                            <label className="flex items-center gap-2">
                                <Radio value="upi" /> UPI
                            </label>
                        </div>
                    </RadioGroup>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="flex justify-between">
                        <TouchableOpacity className="bg-purple-600 text-white p-2 rounded w-1/2 mr-2" onPress={handleSave}>
                            <Text className="text-center">Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-purple-600 text-white p-2 rounded w-1/2" onPress={clearForm}>
                            <Text className="text-center">Clear</Text>
                        </TouchableOpacity>
                    </div>
                </div>
            </ScrollView>
        </div>
    );
};

export default AddPaymentPopup;
