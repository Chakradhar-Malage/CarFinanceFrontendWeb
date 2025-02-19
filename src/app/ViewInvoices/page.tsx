/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";

interface Invoice {
  customer_name: string;
  created_at: string;
}

const ViewInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchName, setSearchName] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://15.207.48.53:3000/allinvoices");
      setInvoices(response.data as Invoice[]);
      setFilteredInvoices(response.data as Invoice[]);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const searchByCustomer = async () => {
    if (!searchName) {
      alert("Please enter a customer name.");
      return;
    }
    try {
      const response = await axios.get(
        `http://15.207.48.53:3000/invoices/customer/${searchName}`
      );
      setFilteredInvoices(response.data as Invoice[]);
    } catch (error) {
      console.error("Error searching invoices:", error);
      alert("No invoices found for this customer.");
    }
  };

  const formatDateForUrl = (dateString: string) => {
    return new Date(dateString).toISOString().replace("T", " ").slice(0, 19);
  };

  const openInBrowser = (customerName: string, createdAt: string) => {
    const formattedDate = encodeURIComponent(formatDateForUrl(createdAt));
    window.open(
      `http://15.207.48.53:3000/invoices/${customerName}/${formattedDate}/download`,
      "_blank"
    );
  };

  const deleteInvoice = async (customerName: string, createdAt: string) => {
    const formattedDate = encodeURIComponent(formatDateForUrl(createdAt));
    try {
      await axios.delete(
        `http://15.207.48.53:3000/deleteinvoices/${customerName}/${formattedDate}`
      );
      setFilteredInvoices((prev) =>
        prev.filter(
          (invoice) =>
            !(invoice.customer_name === customerName && invoice.created_at === createdAt)
        )
      );
      alert("Invoice deleted successfully");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src="/images/usericon.png"
          alt="User Icon"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p className="text-gray-500 text-sm">Hello,</p>
          <p className="text-lg font-bold text-gray-700">OmSai</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => router.push("/GenerateInvoice")} className="bg-purple-700 text-white px-4 py-2 rounded-lg">
          New Invoice
        </button>
        <button onClick={() => router.push("/GstBilling_ledger")} className="bg-purple-700 text-white px-4 py-2 rounded-lg">
          Billing Ledger
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={searchByCustomer} className="bg-purple-700 text-white px-4 py-2 rounded-lg">
          Search
        </button>
      </div>

      <div>
        {filteredInvoices.map((invoice, index) => (
          <div key={index} className="relative p-4 border rounded-lg bg-gray-100 mb-4">
            <button
              className="absolute top-2 right-2 text-red-600"
              onClick={() => deleteInvoice(invoice.customer_name, invoice.created_at)}
            >
              <FaTrash size={20} />
            </button>
            <p className="text-lg font-semibold">Customer: {invoice.customer_name}</p>
            <p className="text-gray-600">{new Date(invoice.created_at).toLocaleString()}</p>
            <button
              onClick={() => openInBrowser(invoice.customer_name, invoice.created_at)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg mt-3"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewInvoices;
