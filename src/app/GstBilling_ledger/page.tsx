'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

const GSTBillingLedger = () => {
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerList, setCustomerList] = useState<{ label: string; value: string }[]>([]);
  const [actionValue, setActionValue] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  // Export data to Excel using XLSX and trigger a file download
  const exportToExcel = (data: any[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LedgerData');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledgerData.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    window.alert("Excel File Created. The Excel file has been successfully created.");
  };

  // Export data to PDF by opening a new window with HTML and triggering print
  const exportToPDF = (data: any[]) => {
    const htmlContent = `
      <html>
        <head>
          <title>GST Billing Ledger</title>
          <style>
            table, th, td { border: 1px solid black; border-collapse: collapse; }
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
            ${data
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
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      window.alert("PDF Exported. Your PDF file has been exported successfully.");
    } else {
      console.error("Failed to open print window");
    }
  };

  // Fetch customer names (runs only once on mount)
  const fetchCustomerNames = () => {
    axios
      .get('http://15.207.48.53:3000/customers')
      .then((response) => {
        const customers = response.data.map((customer: any) => ({
          label: customer.name,
          value: customer.name,
        }));
        setCustomerList(customers);
      })
      .catch((error) => console.error('Error fetching customer names:', error));
  };

  // Fetch ledger data using the provided filters
  const fetchLedgerData = () => {
    let query = `http://15.207.48.53:3000/gstbillingledger?`;
    if (customerName) query += `customer_name=${customerName}&`;
    if (startDate) query += `start_date=${startDate}&`;
    if (endDate) query += `end_date=${endDate}&`;
    if (paymentStatusFilter) query += `payment_status=${paymentStatusFilter}&`;
    axios
      .get(query)
      .then((response) => {
        // Update state only if data has changed
        if (JSON.stringify(response.data) !== JSON.stringify(ledgerData)) {
          setLedgerData(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching ledger data:', error);
      });
  };

  // Handle the payment status selection
  const handleActionSelect = (action: string) => {
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
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <div className="header-container">
        <img className="usrimg" src="/images/usericon.png" alt="User Icon" />
        <div className="user-info">
          <p className="helloname">Hello,</p>
          <p className="username">OmSai</p>
        </div>
      </div>
      <hr />

      {/* Button Section */}
      <div className="button-container">
        <button
          className="payment-export-button"
          onClick={() => router.push('/Addpaymentpopup')}
        >
          Add Payment
        </button>
        <button
          className="payment-export-button"
          onClick={() => {
            // You can choose which export to perform.
            // Here, we show a prompt that gives a choice.
            const exportChoice = window.prompt(
              'Type "pdf" to export to PDF or "excel" to export to Excel'
            );
            if (exportChoice?.toLowerCase() === 'pdf') {
              exportToPDF(ledgerData);
            } else if (exportChoice?.toLowerCase() === 'excel') {
              exportToExcel(ledgerData);
            }
          }}
        >
          Export
        </button>
      </div>

      {/* Actions Dropdown */}
      <div className="actions-container">
        <select
          value={actionValue}
          onChange={(e) => {
            setActionValue(e.target.value);
            handleActionSelect(e.target.value);
          }}
        >
          <option value="">Payment Status</option>
          <option value="Due payments">Due Payments</option>
          <option value="Partial payments">Partial Payments</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {/* Filter Inputs */}
      <div className="filter-container">
        {/* Customer Dropdown with Search */}
        <div className="dropdown-container">
          <select
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customerList
              .filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item, idx) => (
                <option key={idx} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>
          <input
            type="text"
            placeholder="Search Customer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Pickers */}
        <div className="date-picker-container">
          <div>
            <label>Start Date: </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label>End Date: </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button onClick={fetchLedgerData}>Search</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <div className="table-header">
          <div className="cell" style={{ width: '143px' }}>Date</div>
          <div className="cell" style={{ width: '70px' }}>Invoice No</div>
          <div className="cell" style={{ width: '180px' }}>Customer Name</div>
          <div className="cell" style={{ width: '120px' }}>Contact No</div>
          <div className="cell" style={{ width: '151px' }}>Company</div>
          <div className="cell" style={{ width: '151px' }}>Payment Status</div>
          <div className="cell" style={{ width: '151px' }}>Payment Method</div>
          <div className="cell" style={{ width: '151px' }}>Total Amount</div>
          <div className="cell" style={{ width: '151px' }}>Total Paid</div>
          <div className="cell" style={{ width: '151px' }}>Due</div>
        </div>
        <div className="table-body">
          {ledgerData.map((item, index) => (
            <div key={index} className="row">
              <div className="cell" style={{ width: '143px' }}>{item.Date || '-'}</div>
              <div className="cell" style={{ width: '70px' }}>{item.InvoiceNo || '-'}</div>
              <div className="cell" style={{ width: '180px' }}>{item.CustomerName || '-'}</div>
              <div className="cell" style={{ width: '120px' }}>{item.ContactNumber || '-'}</div>
              <div className="cell" style={{ width: '151px' }}>{item.Company || 'Om Sai Enterprises'}</div>
              <div className="cell" style={{ width: '151px' }}>{item.PaymentStatus || 'Due'}</div>
              <div className="cell" style={{ width: '151px' }}>{item.PaymentMethod || 'None'}</div>
              <div className="cell" style={{ width: '151px' }}>{item.TotalAmount || 0}</div>
              <div className="cell" style={{ width: '151px' }}>{item.TotalPaid || 0}</div>
              <div className="cell" style={{ width: '151px' }}>{item.Due || 0}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Styled JSX */}
      <style jsx>{`
        .container {
          padding: 15px;
        }
        .header-container {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .usrimg {
          width: 50px;
          height: 50px;
          border-radius: 20px;
          object-fit: cover;
        }
        .user-info {
          margin-left: 10px;
        }
        .helloname {
          font-size: 14px;
          color: gray;
          margin: 0;
        }
        .username {
          font-size: 18px;
          font-weight: bold;
          color: darkslategrey;
          margin: 0;
        }
        .button-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        .payment-export-button {
          background-color: #841584;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          flex: 1;
        }
        .actions-container {
          margin-bottom: 20px;
        }
        .filter-container {
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .dropdown-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        .date-picker-container {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
        }
        .table-container {
          overflow-x: auto;
        }
        .table-header,
        .row {
          display: flex;
        }
        .cell {
          padding: 10px;
          text-align: center;
          border: 1px solid #ccc;
          flex-shrink: 0;
        }
        .table-header {
          background-color: #d3d3d3;
        }
      `}</style>
    </div>
  );
};

export default GSTBillingLedger;
