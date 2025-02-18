'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
// import XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

const NonGSTBillingLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [actionValue, setActionValue] = useState('');

  const router = useRouter();

  // Excel export using browser Blob API
  const exportToExcel = (ledgerData) => {
    const ws = XLSX.utils.json_to_sheet(ledgerData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LedgerData');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ledgerData.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.alert('Excel File Created');
  };

  // PDF export using a new window and window.print()
  const exportToPDF = (ledgerData) => {
    const htmlContent = `
      <html>
        <head>
          <title>GST Billing Ledger</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 8px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>GST Billing Ledger</h1>
          <table>
            <tr>
              <th>Date</th>
              <th>Invoice No</th>
              <th>Customer Name</th>
              <th>Contact No</th>
              <th>Company</th>
              <th>Payment Status</th>
              <th>Payment Method</th>
              <th>Total Amount</th>
              <th>Total Paid</th>
              <th>Due</th>
            </tr>
            ${ledgerData
              .map(
                (item) => `
              <tr>
                <td>${item.Date || '-'}</td>
                <td>${item.InvoiceNo || '-'}</td>
                <td>${item.CustomerName || '-'}</td>
                <td>${item.ContactNumber || '-'}</td>
                <td>${item.Company || 'Om Sai Enterprises'}</td>
                <td>${item.PaymentStatus || 'Due'}</td>
                <td>${item.PaymentMethod || 'None'}</td>
                <td>${item.TotalAmount || 0}</td>
                <td>${item.TotalPaid || 0}</td>
                <td>${item.Due || 0}</td>
              </tr>
            `
              )
              .join('')}
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      window.alert('PDF Exported');
    } else {
      window.alert('Popup blocked. Please allow popups for this website.');
    }
  };

  // Fetch customer names on mount
  const fetchCustomerNames = () => {
    axios
      .get('http://15.207.48.53:3000/nongstcustomer')
      .then((response) => {
        const customers = response.data.map((customer) => ({
          label: customer.name,
          value: customer.name,
        }));
        setCustomerList(customers);
      })
      .catch((error) =>
        console.error('Error fetching customer names:', error)
      );
  };

  // Fetch ledger data with filters
  const fetchLedgerData = () => {
    let query = `http://15.207.48.53:3000/nongstbillingledger?`;

    if (customerName) query += `customer_name=${customerName}&`;
    if (startDate) query += `start_date=${startDate}&`;
    if (endDate) query += `end_date=${endDate}&`;
    if (paymentStatusFilter) query += `payment_status=${paymentStatusFilter}&`;

    axios
      .get(query)
      .then((response) => {
        // Only update if data changed
        if (JSON.stringify(response.data) !== JSON.stringify(ledgerData)) {
          setLedgerData(response.data);
        }
      })
      .catch((error) =>
        console.error('Error fetching ledger data:', error)
      );
  };

  // Handle action (payment status) selection from dropdown
  const handleActionSelect = (action) => {
    let newFilter = '';
    if (action === 'Due payments') {
      newFilter = 'Due';
    } else if (action === 'Partial payments') {
      newFilter = 'Partial';
    } else if (action === 'Paid') {
      newFilter = 'Paid';
    }
    if (paymentStatusFilter !== newFilter) {
      setPaymentStatusFilter(newFilter);
    }
  };

  useEffect(() => {
    fetchCustomerNames();
    // Optionally, you could fetch ledger data on mount here if needed.
    // fetchLedgerData();
  }, []);

  // Render a ledger row as a table row
  const renderRow = (item, index) => (
    <tr key={index}>
      <td style={styles.cell}>{item.Date || '-'}</td>
      <td style={{ ...styles.cell, minWidth: 70, maxWidth: 70 }}>
        {item.InvoiceNo || '-'}
      </td>
      <td style={{ ...styles.cell, minWidth: 180, maxWidth: 180 }}>
        {item.CustomerName || '-'}
      </td>
      <td style={{ ...styles.cell, minWidth: 101, maxWidth: 120 }}>
        {item.ContactNumber || '-'}
      </td>
      <td style={{ ...styles.cell, minWidth: 120, maxWidth: 151 }}>
        {item.Company || 'Om Sai Enterprises'}
      </td>
      <td style={{ ...styles.cell, width: 120 }}>
        {item.PaymentStatus || 'Due'}
      </td>
      <td style={{ ...styles.cell, width: 120 }}>
        {item.PaymentMethod || 'None'}
      </td>
      <td style={{ ...styles.cell, minWidth: 120 }}>
        {item.TotalAmount || 0}
      </td>
      <td style={{ ...styles.cell, minWidth: 120 }}>
        {item.TotalPaid || 0}
      </td>
      <td style={{ ...styles.cell, minWidth: 120 }}>
        {item.Due || 0}
      </td>
    </tr>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerContainer}>
        <img
          style={styles.usrimg}
          src="/images/usericon.png"
          alt="User Icon"
        />
        <div style={styles.userInfo}>
          <p style={styles.helloname}>Hello,</p>
          <p style={styles.username}>OmSai</p>
        </div>
      </div>

      <div style={styles.separator}></div>
      <div style={{ marginLeft: 10, marginBottom: 10 }}>
        <p>OmSai Generators</p>
      </div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button
          style={styles.payment_exportButton}
          onClick={() => router.push('/nonAddpaymentpopup')}
        >
          Add Payment
        </button>
        <button
          style={styles.payment_exportButton}
          onClick={() => {
            const choice = window.prompt(
              'Enter export format: "excel" or "pdf" (or cancel)'
            );
            if (choice?.toLowerCase() === 'excel') {
              exportToExcel(ledgerData);
            } else if (choice?.toLowerCase() === 'pdf') {
              exportToPDF(ledgerData);
            }
          }}
        >
          Export
        </button>
      </div>

      {/* Actions Dropdown */}
      <div style={styles.actionsContainer}>
        <select
          value={actionValue}
          onChange={(e) => {
            setActionValue(e.target.value);
            handleActionSelect(e.target.value);
          }}
          style={styles.dropdown}
        >
          <option value="">Payment Status</option>
          <option value="Due payments">Due Payments</option>
          <option value="Partial payments">Partial Payments</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {/* Filter Inputs */}
      <div style={styles.filterContainer}>
        <div style={{ marginBottom: 10 }}>
          <select
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={styles.dropdown}
          >
            <option value="">Select Customer</option>
            {customerList
              .filter((item) =>
                item.label
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>
          <input
            type="text"
            placeholder="Search Customer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...styles.input, marginTop: 5 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
        <button style={styles.button} onClick={fetchLedgerData}>
          Search
        </button>
      </div>

      {/* Ledger Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ ...styles.row, ...styles.headerRow }}>
              <th style={{ ...styles.headerCell, width: 143 }}>Date</th>
              <th style={{ ...styles.headerCell, width: 70 }}>Invoice No</th>
              <th style={{ ...styles.headerCell, width: 180 }}>
                Customer Name
              </th>
              <th style={{ ...styles.headerCell, width: 120 }}>
                Contact No
              </th>
              <th style={{ ...styles.headerCell, width: 151 }}>Company</th>
              <th style={{ ...styles.headerCell, width: 151 }}>
                Payment Status
              </th>
              <th style={{ ...styles.headerCell, width: 151 }}>
                Payment Method
              </th>
              <th style={{ ...styles.headerCell, width: 151 }}>
                Total Amount
              </th>
              <th style={{ ...styles.headerCell, width: 151 }}>
                Total Paid
              </th>
              <th style={{ ...styles.headerCell, width: 151 }}>Due</th>
            </tr>
          </thead>
          <tbody>{ledgerData.map((item, index) => renderRow(item, index))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default NonGSTBillingLedger;

const styles = {
  container: {
    padding: '15px',
    fontFamily: 'Arial, sans-serif',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  usrimg: {
    width: '50px',
    height: '50px',
    borderRadius: '20px',
  },
  userInfo: {
    marginLeft: '10px',
  },
  helloname: {
    fontSize: '14px',
    color: 'gray',
    margin: 0,
  },
  username: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'darkslategrey',
    margin: 0,
  },
  separator: {
    margin: '5px 0',
    borderBottom: '1px solid black',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  payment_exportButton: {
    backgroundColor: '#841584',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '10px',
    flex: 1,
    margin: '0 5px',
    cursor: 'pointer',
  },
  actionsContainer: {
    marginBottom: '10px',
  },
  dropdown: {
    height: '40px',
    borderColor: '#ccc',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '5px',
    paddingLeft: '10px',
    width: '100%',
    marginBottom: '10px',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: '5px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  input: {
    fontSize: '14px',
    padding: '5px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    backgroundColor: '#841584',
    color: 'white',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  row: {
    borderBottom: '1px solid #ccc',
  },
  headerRow: {
    backgroundColor: '#d3d3d3',
  },
  cell: {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ccc',
    wordWrap: 'break-word',
  },
  headerCell: {
    fontWeight: 'bold',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ccc',
    color: '#000',
  },
};
