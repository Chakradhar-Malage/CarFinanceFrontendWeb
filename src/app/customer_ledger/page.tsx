'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const CustomerLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionType, setTransactionType] = useState('credit');
  const [modifyAmounts, setModifyAmounts] = useState([]);
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(null);

  useEffect(() => {
    const fetchLedgerData = async () => {
      try {
        const response = await fetch('http://15.207.48.53:3000/getLedgerData');
        const result = await response.json();

        if (response.ok) {
          setLedgerData(result);
          setModifyAmounts(new Array(result.length).fill(''));
        } else {
          setError(result.message || 'Failed to fetch ledger data');
        }
      } catch (error) {
        console.error('Error fetching ledger data:', error);
        setError('An error occurred while fetching ledger data');
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerData();
  }, []);

  const handleModifyPayment = async () => {
    if (selectedCustomerIndex === null) return;

    const modifyAmount = parseFloat(modifyAmounts[selectedCustomerIndex]);
    if (isNaN(modifyAmount)) {
      alert('Please enter a valid numeric value for the amount.');
      return;
    }

    const updatedData = [...ledgerData];
    const currentBalance = updatedData[selectedCustomerIndex].balance;

    if (transactionType === 'credit') {
      updatedData[selectedCustomerIndex].balance = currentBalance + modifyAmount;
    } else {
      updatedData[selectedCustomerIndex].balance = currentBalance - modifyAmount;
    }

    const requestBody = {
      customer_name: updatedData[selectedCustomerIndex].customer_name,
      modifyAmount: modifyAmount,
      transactionType: transactionType,
    };

    try {
      const response = await fetch('http://15.207.48.53:3000/saveCustomerLedger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (data.message) {
        alert('Success: ' + data.message);
        setLedgerData(updatedData);
        setModifyAmounts(prev => {
          const newAmounts = [...prev];
          newAmounts[selectedCustomerIndex] = '';
          return newAmounts;
        });
        setSelectedCustomerIndex(null);
      } else {
        alert('Error: ' + (data.error || 'Failed to update ledger'));
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the ledger');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="headerWrapper">
        <div className="headerLeft">
          <Image src="/usericon.png" width={40} height={40} alt="User Icon" />
          <div>
            <p>Hello,</p>
            <h2>OmSai</h2>
          </div>
        </div>
        <Image src="/Logout.png" width={25} height={25} alt="Logout" />
      </div>
      <hr />
      <div className="ledgerList">
        {ledgerData.map((item, index) => (
          <div key={index} className="ledgerItem">
            <p>Customer Name: {item.customer_name}</p>
            <p>Balance: Rs. {Number(item.balance).toFixed(2)}</p>
            <p>Last Transaction Date: {new Date(item.transaction_date).toLocaleString()}</p>
            <input
              type="number"
              placeholder="Modify Payment"
              value={modifyAmounts[index]}
              onChange={(e) => {
                const updatedAmounts = [...modifyAmounts];
                updatedAmounts[index] = e.target.value;
                setModifyAmounts(updatedAmounts);
              }}
            />
            <button onClick={() => { setTransactionType('credit'); setSelectedCustomerIndex(index); }}>Credit</button>
            <button onClick={() => { setTransactionType('debit'); setSelectedCustomerIndex(index); }}>Debit</button>
            <button onClick={handleModifyPayment} disabled={selectedCustomerIndex !== index}>Save</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerLedger;
