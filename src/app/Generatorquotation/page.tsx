"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ViewGeneratorQuotationInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://15.207.48.53:3000/allgeneratorquotations");
      setInvoices(response.data);
      setFilteredInvoices(response.data);
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
        `http://15.207.48.53:3000/generator-quotations/customer/${searchName}`
      );
      setFilteredInvoices(response.data);
    } catch (error) {
      console.error("Error searching invoices:", error);
      alert("No invoices found for this customer.");
    }
  };

  const formatDateForUrl = (dateString) => {
    return new Date(dateString).toISOString().replace("T", " ").slice(0, 19);
  };

  const openInBrowser = (customerName, createdAt) => {
    const formattedDate = encodeURIComponent(formatDateForUrl(createdAt));
    window.open(
      `http://15.207.48.53:3000/generator-quotations/${customerName}/${formattedDate}/download`,
      "_blank"
    );
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

      <p className="font-bold mb-4">Generator Quotations</p>

      <button onClick={() => router.push("/generateGeneratorQuotation")} className="bg-purple-700 text-white px-4 py-2 rounded-lg mb-6">
        New Quotation
      </button>

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
          <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
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

export default ViewGeneratorQuotationInvoices;
