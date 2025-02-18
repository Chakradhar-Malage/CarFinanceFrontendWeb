"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';

const ViewNonGSTInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const router = useRouter();

  // Component to format a date string for display (MM/DD/YYYY at HH:mm:ss)
  const FormattedDate = ({ dateString }: { dateString: string }) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return (
      <span>
        {month}/{day}/{year} at {hours}:{minutes}:{seconds}
      </span>
    );
  };

  // Function to format a date string for use in URLs (YYYY-MM-DD HH:mm:ss)
  const formatDateForUrl = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://15.207.48.53:3000/allnongstinvoices');
      setInvoices(response.data as any[]);
      setFilteredInvoices(response.data as any[]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const searchByCustomer = async () => {
    if (!searchName) {
      window.alert('Please enter a customer name.');
      return;
    }
    try {
      const response = await axios.get(
        `http://15.207.48.53:3000/nongstinvoices/customer/${searchName}`
      );
      setFilteredInvoices(response.data as any[]);
    } catch (error) {
      console.error('Error searching invoices:', error);
      window.alert('No invoices found for this customer.');
    }
  };

  // Function to open the download URL in a new browser tab
  const openInBrowser = (customerName: string, createdAt: string) => {
    const formattedDate = formatDateForUrl(createdAt);
    const encodedCreatedAt = encodeURIComponent(formattedDate);
    const url = `http://15.207.48.53:3000/nongstinvoices/${customerName}/${encodedCreatedAt}/download`;
    window.open(url, '_blank');
  };

  // Delete function for non-GST invoices
  const deleteNonGstInvoice = async (customerName: string, createdAt: string) => {
    const formattedDate = formatDateForUrl(createdAt);
    const encodedCreatedAt = encodeURIComponent(formattedDate);
    const url = `http://15.207.48.53:3000/deleteNonGstinvoices/${customerName}/${encodedCreatedAt}`;
    try {
      await axios.delete(url);
      window.alert('Invoice deleted successfully');
      setInvoices((prev) =>
        prev.filter(
          (invoice) =>
            invoice.customer_name !== customerName || invoice.created_at !== createdAt
        )
      );
      setFilteredInvoices((prev) =>
        prev.filter(
          (invoice) =>
            invoice.customer_name !== customerName || invoice.created_at !== createdAt
        )
      );
    } catch (error) {
      console.error('Error deleting invoice:', error);
      window.alert('Failed to delete invoice');
    }
  };

  return (
    <div className="container">
      {/* Header with User Info */}
      <div className="header-container">
        <div className="user-img">
          <Image
            src="/images/usericon.png"
            alt="User Icon"
            width={50}
            height={50}
            className="usrimg"
          />
        </div>
        <div className="user-info">
          <p className="helloname">Hello,</p>
          <p className="username">OmSai</p>
        </div>
      </div>

      <h2>This is Non GST section</h2>

      {/* Navigation Buttons */}
      <div className="buttons-container">
        <button
          className="view-invoices-button"
          onClick={() => router.push('/GenerateNonGSTInvoice')}
        >
          New Invoice
        </button>
        <button
          className="view-invoices-button"
          onClick={() => router.push('/NonGstBilling_ledger')}
        >
          Billing Ledger
        </button>
      </div>

      {/* Search Section */}
      <input
        type="text"
        className="search-input"
        placeholder="Search by customer name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button className="search-button" onClick={searchByCustomer}>
        Search
      </button>

      {/* Invoice List */}
      <div className="invoices-list">
        {filteredInvoices.map((item, index) => (
          <div key={index} className="invoice-item">
            <div
              className="delete-icon"
              onClick={() => deleteNonGstInvoice(item.customer_name, item.created_at)}
            >
              <FaTrash size={24} color="red" />
            </div>
            <p className="invoice-text">Customer: {item.customer_name}</p>
            <p>
              <FormattedDate dateString={item.created_at} />
            </p>
            <button
              className="download-button"
              onClick={() => openInBrowser(item.customer_name, item.created_at)}
            >
              Download
            </button>
          </div>
        ))}
      </div>

      {/* Styled JSX for component styling */}
      <style jsx>{`
        .container {
          padding: 20px;
        }
        .header-container {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .user-img {
          width: 50px;
          height: 50px;
          border-radius: 20px;
          overflow: hidden;
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
        .buttons-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .view-invoices-button {
          padding: 10px;
          width: 48%;
          background-color: #841584;
          border: none;
          border-radius: 18px;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }
        .search-input {
          height: 40px;
          width: 100%;
          border: 1px solid gray;
          margin-bottom: 12px;
          padding: 8px;
          border-radius: 5px;
          box-sizing: border-box;
        }
        .search-button {
          background-color: #841584;
          padding: 10px 0;
          border: none;
          border-radius: 5px;
          margin-bottom: 20px;
          width: 100%;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }
        .invoice-item {
          position: relative;
          padding: 16px;
          border-bottom: 1px solid gray;
          background-color: #f9f9f9;
          margin: 8px 0;
          border-radius: 5px;
        }
        .invoice-text {
          font-size: 16px;
          margin-bottom: 8px;
        }
        .delete-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 1;
          cursor: pointer;
        }
        .download-button {
          background-color: darkslategrey;
          padding: 10px;
          border: none;
          border-radius: 5px;
          margin-top: 10px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default ViewNonGSTInvoices;
