'use client'; // Ensure this file is treated as a client-side component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import router for navigation
import React from 'react';

const CompanyCard: React.FC = () => {
  const router = useRouter(); // Initialize router for navigation

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/SignIn'); // Redirect to SignIn page if not logged in
    }
  }, [router]);

  return (
    <div style={styles.container}>
      {/* Card */}
      <div onClick={() => router.push('/personalBankAccountTracking')} style={styles.personalAccountCard}>
        <div style={styles.header}>
          <h3 style={styles.title}>Personal Account Monitoring</h3>
        </div>
      </div>

      <div onClick={() => router.push('/HomeUIafterSignin')} style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.title}>Welcome To !!</h3>
          <p style={styles.subtitle}>Om Sai Enterprises</p>
        </div>
      </div>

      <div onClick={() => router.push('/BillingTypes')} style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.title}>Welcome To !!</h3>
          <p style={styles.subtitle}>Billing Section</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    width: '350px',
    height: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  personalAccountCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '1px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    width: '350px',
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  header: {
    marginBottom: '16px',
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'rgb(4, 101, 54)',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginTop: '10px',
  },
};

export default CompanyCard;
