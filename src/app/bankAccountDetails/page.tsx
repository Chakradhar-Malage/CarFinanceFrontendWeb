"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const BankAccountDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bankName = searchParams.get("bankName");
  const [account, setAccount] = useState(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAccountData();
  }, [bankName]);

  const fetchAccountData = async () => {
    try {
      const response = await axios.get("http://15.207.48.53:3000/api/accounts");
      const found = response.data.accounts.find(acc => acc.name === bankName);
      if (found) setAccount(found);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const handleTransactionPress = (type) => {
    setTransactionType(type);
    setShowTransactionForm(true);
  };

  const handleCancelTransaction = () => {
    setShowTransactionForm(false);
    setAmount("");
    setDescription("");
    setTransactionType(null);
  };

  const handleSubmitTransaction = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      bankName,
      transactionType,
      amount: parseFloat(amount),
      description,
    };

    try {
      await axios.post("http://15.207.48.53:3000/api/transactions", payload);
      alert("Transaction processed successfully");
      handleCancelTransaction();
      fetchAccountData();
    } catch (error) {
      console.error("API Error:", error);
      alert("Unable to process transaction at this time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Image src="/images/usericon.png" alt="User Icon" width={50} height={50} className="rounded-full" />
        <div>
          <p className="text-gray-500 text-sm">Hello,</p>
          <p className="text-lg font-bold text-gray-700">OmSai</p>
        </div>
      </div>

      <div className="p-4 border rounded bg-gray-100 text-center">
        <h2 className="text-xl font-semibold">{bankName} Account Details</h2>
        {account && <p className="text-lg text-green-600">Current Balance: Rs. {account.current_balance}</p>}
      </div>

      <div className="mt-6 flex space-x-4">
        <button onClick={() => handleTransactionPress("credit")} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">
          Credit
        </button>
        <button onClick={() => handleTransactionPress("debit")} className="bg-red-600 text-white px-4 py-2 rounded-lg w-full">
          Debit
        </button>
      </div>

      {showTransactionForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{transactionType === "credit" ? "Credit Transaction" : "Debit Transaction"}</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="text"
              placeholder={transactionType === "credit" ? "Description of credit" : "Reason for debit"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex space-x-4">
              <button onClick={handleCancelTransaction} className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full">
                Cancel
              </button>
              <button onClick={handleSubmitTransaction} disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountDetails;
