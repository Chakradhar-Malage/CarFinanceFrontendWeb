"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import moment from "moment";

const ExportData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [selectedCarRecords, setSelectedCarRecords] = useState([]);
  const [totalAgreedAmount, setTotalAgreedAmount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  const [carDetails, setCarDetails] = useState({});

  const exportLastMonthData = async () => {
    if (!month) {
      alert("Please select a month");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://15.207.48.53:3000/export-month?month=${month}`);
      setData(response.data.results);
      setTotalAgreedAmount(response.data.totalAgreedAmount);
      setTotalExpenses(response.data.totalExpenses);
      setProfit(response.data.profit);
    } catch (error) {
      console.error("Error fetching export data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCarSelection = (vehicle_number) => {
    const selectedCar = data.filter(item => item.vehicle_number === vehicle_number);
    setSelectedCarRecords(selectedCar);
    let carAgreedAmount = 0;
    let carExpenses = 0;
    selectedCar.forEach(item => {
      carAgreedAmount += parseFloat(item.agreed_amount);
      carExpenses += parseFloat(item.total_expenses);
    });
    setCarDetails({
      vehicle_number,
      totalAgreedAmount: carAgreedAmount,
      totalExpenses: carExpenses,
      profit: carAgreedAmount - carExpenses,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Export Last Month Data</h2>
      <select value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded w-full mb-4">
        <option value="">Select Month</option>
        {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
          <option key={m} value={m}>{moment().month(m - 1).format("MMMM")}</option>
        ))}
      </select>
      <button onClick={exportLastMonthData} className="bg-purple-700 text-white px-4 py-2 rounded-lg w-full">
        Export
      </button>
      {loading && <p className="mt-4">Loading...</p>}
      <div className="mt-6">
        <h3 className="text-lg font-bold">Net Amount: Rs.{totalAgreedAmount.toFixed(2)}</h3>
        <h3 className="text-lg font-bold">Total Expenses: Rs.{totalExpenses.toFixed(2)}</h3>
        <h3 className="text-lg font-bold">Profit: Rs.{profit.toFixed(2)}</h3>
      </div>
      <div className="mt-6">
        {data.length > 0 && data.map((item) => (
          <button key={item.vehicle_number} onClick={() => handleCarSelection(item.vehicle_number)} className="border p-2 rounded w-full mb-2">
            Car: {item.vehicle_number}
          </button>
        ))}
      </div>
      {carDetails.vehicle_number && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">Monthly Record for {carDetails.vehicle_number}</h3>
          <p>Total Agreed Amount: Rs. {carDetails.totalAgreedAmount}</p>
          <p>Total Expenses: Rs. {carDetails.totalExpenses}</p>
          <p>Profit: Rs. {carDetails.profit}</p>
          <div className="mt-4">
            {selectedCarRecords.map((record, index) => (
              <div key={index} className="p-2 border rounded mb-2 bg-white">
                <p>ID: {record.id}</p>
                <p>Vehicle Number: {record.vehicle_number}</p>
                <p>Agreed Amount: Rs.{record.agreed_amount}</p>
                <p>Customer: {record.issued_to}</p>
                <p>Expenses: Rs.{record.total_expenses}</p>
                <p>Date: {moment(record.cleared_at).format('YYYY-MM-DD')}</p>
                <p>Profit: Rs.{(record.agreed_amount - record.total_expenses).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData;
