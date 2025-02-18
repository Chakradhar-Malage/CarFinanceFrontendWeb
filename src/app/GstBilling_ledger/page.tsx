'use client';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Select from 'react-select';

const GSTBillingLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(null);

  const router = useRouter();

  useEffect(() => {
    axios.get('http://15.207.48.53:3000/customers').then(response => {
      setCustomerList(response.data.map(customer => ({
        label: customer.name,
        value: customer.name,
      })));
    });
  }, []);

  const fetchLedgerData = () => {
    let query = `http://15.207.48.53:3000/gstbillingledger?`;
    if (customerName) query += `customer_name=${customerName}&`;
    if (startDate) query += `start_date=${startDate.toISOString().split('T')[0]}&`;
    if (endDate) query += `end_date=${endDate.toISOString().split('T')[0]}&`;
    if (paymentStatusFilter) query += `payment_status=${paymentStatusFilter}&`;

    axios.get(query).then(response => setLedgerData(response.data));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Date', 'Invoice No', 'Customer Name', 'Contact No', 'Company', 'Payment Status', 'Payment Method', 'Total Amount', 'Total Paid', 'Due']],
      body: ledgerData.map(item => [
        item.Date || '-',
        item.InvoiceNo || '-',
        item.CustomerName || '-',
        item.ContactNumber || '-',
        item.Company || 'Om Sai Enterprises',
        item.PaymentStatus || 'Due',
        item.PaymentMethod || 'None',
        item.TotalAmount || 0,
        item.TotalPaid || 0,
        item.Due || 0,
      ]),
    });
    doc.save('ledger.pdf');
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <img style={styles.usrimg} src="/usericon.png" alt="User Icon" />
        <div style={styles.userInfo}>
          <p style={styles.helloname}>Hello,</p>
          <p style={styles.username}>OmSai</p>
        </div>
      </div>
      <div style={styles.separator} />

      <div style={styles.buttonContainer}>
        <button className="btn" onClick={() => router.push('/add-payment')}>Add Payment</button>
        <button className="btn" onClick={exportToPDF}>Export to PDF</button>
      </div>

      <div style={styles.filterContainer}>
        <Select options={customerList} onChange={option => setCustomerName(option.value)} placeholder="Select Customer" />
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} placeholderText="Start Date" />
        <DatePicker selected={endDate} onChange={date => setEndDate(date)} placeholderText="End Date" />
        <button className="btn" onClick={fetchLedgerData}>Search</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              {['Date', 'Invoice No', 'Customer Name', 'Contact No', 'Company', 'Payment Status', 'Payment Method', 'Total Amount', 'Total Paid', 'Due'].map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((item, index) => (
              <tr key={index}>
                <td>{item.Date || '-'}</td>
                <td>{item.InvoiceNo || '-'}</td>
                <td>{item.CustomerName || '-'}</td>
                <td>{item.ContactNumber || '-'}</td>
                <td>{item.Company || 'Om Sai Enterprises'}</td>
                <td>{item.PaymentStatus || 'Due'}</td>
                <td>{item.PaymentMethod || 'None'}</td>
                <td>{item.TotalAmount || 0}</td>
                <td>{item.TotalPaid || 0}</td>
                <td>{item.Due || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GSTBillingLedger;

const styles = {
  container: { flex: 1, padding: 15 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  usrimg: { width: 50, height: 50, borderRadius: 20 },
  userInfo: { marginLeft: 10 },
  helloname: { fontSize: 14, color: 'gray' },
  username: { fontSize: 18, fontWeight: 'bold', color: 'darkslategrey' },
  separator: { margin: 5, borderBottomWidth: 1, borderBottomColor: 'black' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  filterContainer: { display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: 10 },
  table: { borderCollapse: 'collapse', width: '100%' },
  th: { borderBottom: '2px solid black', padding: '10px' },
  td: { borderBottom: '1px solid #ccc', padding: '10px' },
};