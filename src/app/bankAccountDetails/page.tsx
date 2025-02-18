'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { globalState } from '../../globalState';

const BankAccountDetails = () => {
  const router = useRouter();
  // Retrieve bankName from query string (e.g. /bank-account-details?bankName=ABC)
  const searchParams = useSearchParams();
  const bankName = searchParams.get('bankName');
  const UserName = globalState.UserName;

  // State to hold account details (fetched from API)
  const [account, setAccount] = useState(null);

  // States for transaction form
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState<string | null>(null); // 'credit' or 'debit'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for view transactions
  const options = [
    { title: 'View Transactions', key: 'transactions' },
  ];

  // Function to fetch all accounts and then filter for the current account by bankName
  const fetchAccountData = async () => {
    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts');
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching accounts:', errorData.message);
        return;
      }
      const data = await response.json();
      // Find the account that matches the bankName
      const found = data.accounts.find((acc: { name: string }) => acc.name === bankName);
      if (found) {
        setAccount(found);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  // Fetch account data when component mounts or when bankName changes
  useEffect(() => {
    if (bankName) {
      fetchAccountData();
    }
  }, [bankName]);

  // Handler for view transactions option
  const handleOptionPress = (optionKey: string) => {
    if (optionKey === 'transactions') {
      router.push(`/TransactionsScreen?bankName=${bankName}`);
    }
  };

  // When Credit or Debit is pressed, open the modal with the correct transaction type
  const handleTransactionPress = (type: string) => {
    setTransactionType(type);
    setShowTransactionForm(true);
  };

  const handleCancelTransaction = () => {
    setShowTransactionForm(false);
    setAmount('');
    setDescription('');
    setTransactionType(null);
  };

  // Submit a transaction and refresh account data afterward
  const handleSubmitTransaction = async () => {
    if (!amount || isNaN(amount)) {
      window.alert('Validation Error: Please enter a valid amount');
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
      const response = await fetch('http://15.207.48.53:3000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(errorData.message || 'Something went wrong');
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      console.log('Transaction successful:', data);
      window.alert('Success: Transaction processed successfully');

      // Reset form and close modal
      setShowTransactionForm(false);
      setAmount('');
      setDescription('');
      setTransactionType(null);
      // Refresh account details to display updated current balance
      fetchAccountData();
    } catch (error) {
      console.error('API Error:', error);
      window.alert('Error: Unable to process transaction at this time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerContainer}>
        <img
          style={styles.usrimg}
          src="images/usericon.png"
          alt="User Icon"
        />
        <div style={styles.userInfo}>
          <p style={styles.helloname}>Hello,</p>
          <p style={styles.username}>{UserName}</p>
        </div>
        <button style={styles.logoutButton} onClick={() => console.log('Logout pressed')}>
          <img style={styles.logoutimg} src="/assets/images/Logout.png" alt="Logout" />
        </button>
      </div>
      <div style={styles.separator} />

      {/* Selected Bank/Cash Title and Balance */}
      <div style={styles.selectedBankContainer}>
        <p style={styles.selectedBankText}>{bankName} Account Details</p>
        {account && (
          <p style={styles.balanceText}>Current Balance: Rs. {account.current_balance}</p>
        )}
      </div>

      {/* Options List */}
      <div style={styles.optionsContainer}>
        {options.map((option) => (
          <button
            key={option.key}
            style={styles.optionButton}
            onClick={() => handleOptionPress(option.key)}
          >
            {option.title}
          </button>
        ))}
      </div>

      {/* Credit and Debit Buttons */}
      <div style={styles.transactionRow}>
        <button style={styles.transactionButton} onClick={() => handleTransactionPress('credit')}>
          Credit
        </button>
        <button style={styles.transactionButton} onClick={() => handleTransactionPress('debit')}>
          Debit
        </button>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <h2 style={styles.modalTitle}>
              {transactionType === 'credit' ? 'Credit Transaction' : 'Debit Transaction'}
            </h2>
            <input
              style={styles.input}
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              style={styles.input}
              type="text"
              placeholder={
                transactionType === 'credit'
                  ? 'Description of credit:'
                  : 'Reason for debit?'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={styles.modalButtonRow}>
              <button style={styles.modalButton} onClick={handleCancelTransaction} disabled={isSubmitting}>
                Cancel
              </button>
              <button style={styles.modalButton} onClick={handleSubmitTransaction} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountDetails;

const styles = {
  container: { backgroundColor: '#fff', fontFamily: 'Arial, sans-serif', minHeight: '100vh' },
  headerContainer: { display: 'flex', alignItems: 'center', padding: 20 },
  usrimg: { width: 50, height: 50, borderRadius: '50%' },
  userInfo: { marginLeft: 10, flex: 1 },
  helloname: { fontSize: 14, color: '#333', margin: 0 },
  username: { fontSize: 16, fontWeight: 'bold', color: 'darkslategrey', margin: 0 },
  logoutButton: { background: 'none', border: 'none', cursor: 'pointer' },
  logoutimg: { width: 25, height: 25 },
  separator: { borderBottom: '1px solid rgb(0,0,0)', margin: '10px 20px' },
  selectedBankContainer: {
    margin: '10px 20px',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },
  selectedBankText: { fontSize: 18, fontWeight: 'bold', color: '#333', margin: 0 },
  balanceText: { fontSize: 16, marginTop: 5, color: 'green' },
  optionsContainer: { margin: '20px 20px' },
  optionButton: {
    backgroundColor: '#841584',
    padding: '15px 20px',
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
  transactionRow: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '20px 20px',
  },
  transactionButton: {
    backgroundColor: '#841584',
    padding: '15px 20px',
    borderRadius: 5,
    flex: '0 0 45%',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    boxSizing: 'border-box',
  },
  modalButtonRow: { display: 'flex', justifyContent: 'space-around' },
  modalButton: {
    backgroundColor: '#841584',
    padding: '10px 20px',
    borderRadius: 5,
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    minWidth: 100,
  },
};
