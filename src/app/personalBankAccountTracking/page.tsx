'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router
import Image from 'next/image';

const PersonalBankAccountTracking = () => {
  const router = useRouter();
  const UserName = 'OmSai'; // Update this if using context or state for the UserName

  // State to hold the list of bank accounts from the API
  const [accounts, setAccounts] = useState<any[]>([]);

  // State for modals: Add New Bank and Remove Bank
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  const [showRemoveBankModal, setShowRemoveBankModal] = useState(false);
  const [removeBankName, setRemoveBankName] = useState('');

  // Fetch the list of accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts');
      if (!response.ok) {
        console.error('Error fetching accounts');
        return;
      }
      const data = await response.json();
      setAccounts(data.accounts);
    } catch (error) {
      console.error('Fetch accounts error:', error);
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handler for "Add New Bank" button – opens the Add Bank modal
  const handleAddNewBank = () => {
    setShowAddBankModal(true);
  };

  // Handler for submitting a new bank account
  const handleSubmitAddBank = async () => {
    if (!newBankName || !openingBalance || isNaN(Number(openingBalance))) {
      alert('Please enter a valid bank name and opening balance');
      return;
    }
    const payload = {
      name: newBankName,
      opening_balance: parseFloat(openingBalance),
    };

    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Something went wrong');
        return;
      }
      alert('Bank account added successfully');
      setShowAddBankModal(false);
      setNewBankName('');
      setOpeningBalance('');
      fetchAccounts(); // Refresh accounts list
    } catch (error) {
      console.error('API Error:', error);
      alert('Unable to add bank account at this time');
    }
  };

  // Handler for "Remove Bank" button – opens the Remove Bank modal
  const handleRemoveBank = () => {
    setShowRemoveBankModal(true);
  };

  // Handler for submitting bank removal
  const handleSubmitRemoveBank = async () => {
    if (!removeBankName) {
      alert('Please enter a valid bank name');
      return;
    }
    try {
      const response = await fetch('http://15.207.48.53:3000/api/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName: removeBankName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Something went wrong');
        return;
      }
      alert('Bank account removed successfully');
      setShowRemoveBankModal(false);
      setRemoveBankName('');
      fetchAccounts(); // Refresh accounts list
    } catch (error) {
      console.error('API Error:', error);
      alert('Unable to remove bank account at this time');
    }
  };

  // Handler for tapping on an account item
  const handleBankPress = (bankName: string) => {
    router.push(`/bankAccountDetails?bankName=${bankName}`);
  };

  return (
    <div className=' m-2 p-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center p-4 '>
            <Image className='border border-3 rounded-lg' src="/images/usericon.png" alt="User Icon" width={50} height={50} />
            <div style={styles.userInfo}>
            <p style={styles.helloname}>Hello,</p>
            <p className='font-semibold'>{UserName}</p>
            </div>

        </div>
        
        <button onClick={() => console.log('Logout pressed')}>
          <Image style={styles.logoutimg} src="/images/Logout.png" alt="Logout" width={25} height={25} />
        </button>

      </div>

      <hr className='border border-black m-2' />
      

      <div className='mt-5 flex justify-between px-5'>
        <button style={styles.topButton} onClick={handleAddNewBank}>
          <p style={styles.topButtonText}>Add New Bank</p>
        </button>
        <button style={styles.topButton} onClick={handleRemoveBank}>
          <p style={styles.topButtonText}>Remove Bank</p>
        </button>
      </div>

      <div className=' my-5 flex flex-col items-start '>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <button
              key={account.id}
              className='flex text-left w-full  border text-lg p-1 py-2 my-2 rounded-md bg-slate-100 hover:bg-slate-200'
              onClick={() => handleBankPress(account.name)}
            >
              <p className='w-full '>{account.name}</p>
            </button>
          ))
        ) : (
          <p style={styles.noAccountsText}>No accounts available</p>
        )}
      </div>

      <div className='flex flex-col  items-center justify-center border-2 rounded-lg shadow-lg p-2'>
        <p className='font-bold text-lg my-1'>Current Account Balances</p>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id} className='flex justify-between w-full p-2 border bg-slate-50 my-2'>
              <p style={styles.bankName}>{account.name}</p>
              <p style={styles.bankBalance}>Rs. {account.current_balance}</p>
            </div>
          ))
        ) : (
          <p style={styles.noAccountsText}>No account balances available</p>
        )}
      </div>

      {/* Add Bank Modal */}
      {showAddBankModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <p style={styles.modalTitle}>Add New Bank</p>
            <input
              style={styles.input}
              placeholder="Bank Name"
              value={newBankName}
              onChange={(e) => setNewBankName(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Opening Balance"
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
            />
            <div style={styles.modalButtonRow}>
              <button style={styles.modalButton} onClick={() => setShowAddBankModal(false)}>
                <p style={styles.modalButtonText}>Cancel</p>
              </button>
              <button style={styles.modalButton} onClick={handleSubmitAddBank}>
                <p style={styles.modalButtonText}>Submit</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Bank Modal */}
      {showRemoveBankModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <p style={styles.modalTitle}>Remove Bank</p>
            <input
              style={styles.input}
              placeholder="Bank Name to Remove"
              value={removeBankName}
              onChange={(e) => setRemoveBankName(e.target.value)}
            />
            <div style={styles.modalButtonRow}>
              <button style={styles.modalButton} onClick={() => setShowRemoveBankModal(false)}>
                <p style={styles.modalButtonText}>Cancel</p>
              </button>
              <button style={styles.modalButton} onClick={handleSubmitRemoveBank}>
                <p style={styles.modalButtonText}>Submit</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalBankAccountTracking;

const styles = {
  container: {
        display: 'flex',
        flexDirection: 'column' as 'column',  // Corrected type
        padding: 20,
        backgroundColor: '#fff',
      },
  headerContainer: { display: 'flex', alignItems: 'center', marginBottom: 20 },
  usrimg: { borderRadius: '50%' },
  userInfo: { marginLeft: 10 },
  helloname: { fontSize: 16, fontWeight: 'bold' },
  username: { fontSize: 14 },
  logoutimg: { marginLeft: 'auto' },
  separator: { borderBottom: '1px solid #ccc', marginVertical: 10 },
  topButtonsContainer: { display: 'flex', flexDirection: 'row' as 'row', justifyContent: 'space-between' as 'space-between' },
  topButton: { padding: 10, backgroundColor: '#007BFF', borderRadius: 5 },
  topButtonText: { color: '#fff' },
  bankListContainer: { maxHeight: 200, marginTop: 10 },
  bankItem: { padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5, marginBottom: 10 },
  bankText: { fontSize: 16 },
  noAccountsText: { TextAlign: 'center' as 'center', fontSize: 16, marginTop: 20 },
  cardContainer: { marginTop: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  balanceItem: { flexDirection: 'row' as 'row', justifyContent: 'space-between' as 'space-between', paddingVertical: 8 },
  bankName: { fontSize: 16 },
  bankBalance: { fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { Position: 'absolute' as 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  modalButtonRow: { display: 'flex', flexDirection: 'row' as 'row', justifyContent: 'space-between' as 'space-between' },
  modalButton: { padding: 10, backgroundColor: '#007BFF', borderRadius: 5 },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
};
