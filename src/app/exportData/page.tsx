'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import moment from 'moment';
import { globalState } from '../../globalState'; // Adjust the path as needed
import Image from "next/image";

const ExportData = () => {
  const [data, setData] = useState<any[]>([]); // List of cars for the selected month
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState('');
  const [selectedCarRecords, setSelectedCarRecords] = useState<any[]>([]);
  const [totalAgreedAmount, setTotalAgreedAmount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [carDetails, setCarDetails] = useState<any>({});
  const UserName = globalState.UserName;

  const router = useRouter();

  // Set the app element on the client side (in useEffect)
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  // Fetch the list of cars for the selected month
  const exportLastMonthData = async () => {
    if (!month) {
      alert('Please select a month');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://15.207.48.53:3000/export-month?month=${month}`);
      const result = await response.json();

      if (response.ok) {
        setData(result.results); // All car entries for the month
        setTotalAgreedAmount(result.totalAgreedAmount);
        setTotalExpenses(result.totalExpenses);
        setProfit(result.profit);
      } else {
        alert(result.message || 'An error occurred');
      }
    } catch (error: any) {
      console.error("Error fetching export data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle the selection of a car
  const handleCarSelection = (vehicle_number: string) => {
    const selectedCar = data.filter(item => item.vehicle_number === vehicle_number);
    setSelectedCarRecords(selectedCar);

    // Calculate the totals for the selected car
    let carAgreedAmount = 0;
    let carExpenses = 0;
    selectedCar.forEach(item => {
      carAgreedAmount += parseFloat(item.agreed_amount);
      carExpenses += parseFloat(item.total_expenses);
    });
    const carProfit = carAgreedAmount - carExpenses;

    setCarDetails({
      vehicle_number: vehicle_number,
      totalAgreedAmount: carAgreedAmount,
      totalExpenses: carExpenses,
      profit: carProfit,
    });

    setModalVisible(true);
  };

  // Filter the list of cars to show unique vehicle numbers
  const uniqueCarList = Array.from(new Set(data.map(item => item.vehicle_number)))
    .map(vehicle_number => {
      return data.find(item => item.vehicle_number === vehicle_number);
    });

  return (
    <div className="safeArea">
      {/* Header */}
      <div className="header">
        <Image
            src="/images/usericon.png"
            alt="User Icon"
            width={55}
            height={55}
            className="rounded-full margin-right-10"
        />
        <div className="user-text">
          <p className="helloname">Hello,</p>
          <p className="username">{UserName}</p>
        </div>
        <button className="logout-button" onClick={() => router.push('/logout')}>
          <Image
              src="/images/Logout.png"
              alt="User Icon"
              width={25}
              height={25}
              className="rounded-full"
          />
          </button>
        </div>
      <div className="separator"></div>

      <button className="buttonledger" onClick={() => router.push('/customer_ledger')}>
        Pending Ledger
      </button>

      <div className="container">
        {loading && <p className="loadingText">Loading...</p>}

        {/* Month Picker */}
        <h2 className="exportTitle">Export Last Month Data</h2>
        <div className="monthPickerContainer">
          <select
            className="picker"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <button className="button" onClick={exportLastMonthData}>
            Export
          </button>
        </div>

        {/* Display Totals */}
        <div className="totalContainer">
          <p className="totalText">Net Amount: Rs.{totalAgreedAmount.toFixed(2)}</p>
          <p className="totalText">Total Expenses: Rs.{totalExpenses.toFixed(2)}</p>
          <p className="totalText">Profit: Rs.{profit.toFixed(2)}</p>
        </div>

        {/* List of Unique Cars */}
        {uniqueCarList.length > 0 && !loading && (
          <div>
            {uniqueCarList.map((item: any) => (
              <button
                key={item.vehicle_number}
                className="carCard"
                onClick={() => handleCarSelection(item.vehicle_number)}
              >
                Car: {item.vehicle_number}
              </button>
            ))}
          </div>
        )}

        {/* Modal to Show Car Records */}
        <Modal
          isOpen={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          contentLabel="Car Records Modal"
          className="modalContent"
          overlayClassName="modalOverlay"
        >
          <h3 className="modalTitle">
            Monthly Record for {carDetails.vehicle_number}
          </h3>
          <div className="totalsContainer">
            <p className="totalsText">
              Total Agreed Amount: Rs. {carDetails.totalAgreedAmount}
            </p>
            <p className="totalsText">
              Total Expenses: Rs. {carDetails.totalExpenses}
            </p>
            <p className="totalsText">
              Total Profit: Rs. {carDetails.profit}
            </p>
          </div>
          <div>
            {selectedCarRecords.map((item, index) => (
              <div key={index} className="carRecord">
                <p className="detailsText">ID: {item.id}</p>
                <p className="detailsText">Vehicle Number: {item.vehicle_number}</p>
                <p className="detailsText">Agreed Amount: Rs.{item.agreed_amount}</p>
                <p className="detailsText">Customer: {item.issued_to}</p>
                <p className="detailsText">Expenses: Rs.{item.total_expenses}</p>
                <p className="detailsText">
                  Date: {moment(item.cleared_at).format('YYYY-MM-DD')}
                </p>
                <p className="detailsText">
                  Profit: Rs.{(item.agreed_amount - item.total_expenses).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <button className="closeModalButton" onClick={() => setModalVisible(false)}>
            Close
          </button>
        </Modal>
      </div>

      <style jsx>{`
        .safeArea {
          min-height: 100vh;
          background-color: #f8f8f8;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 20px;
        }
        .usernameContainer {
          margin-left: 20px;
          text-align: left;
        }
        .usrimg {
          margin-left: 20px;
          margin-top: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-text {
          margin-right: 1350px;
          padding-left: 10px;
        }
        .helloname {
          margin: 0;
          font-size: 14px;
          margin-bottom: 0px;
          margin-top: 0px;
        }
        .username {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
          color: darkslategrey;
          margin-top: 0px;
        }
        .logout-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .logoutimg {
          width: 25px;
          height: 25px;
        }
        .separator {
          margin: 25px 20px;
          border-bottom: 1px solid #000;
        }
        .buttonledger {
          background-color: #841584;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 15px;
          width: 150px;
          height: 42px;
          margin: 10px 15px;
          cursor: pointer;
        }
        .container {
          padding: 10px;
          text-align: center;
        }
        .loadingText {
          font-size: 18px;
          font-weight: bold;
          color: #4caf50;
          margin-top: 20px;
        }
        .exportTitle {
          font-size: 16px;
          font-weight: bold;
          margin: 10px 0 30px;
        }
        .monthPickerContainer {
          margin: 0 auto 20px;
          width: 90%;
          padding: 5px;
          border: 2px solid black;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .picker {
          height: 56px;
          width: 95%;
          border: 1px solid #ccc;
          border-radius: 25px;
          padding: 5px;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .button {
          background-color: #841584;
          padding: 12px;
          border: none;
          border-radius: 15px;
          width: 200px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .totalContainer {
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 100%;
          margin: 55px auto 20px;
          margin-top: 10px;
          text-align: center;
        }
        .totalText {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .carCard {
          margin: 5px auto;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 10px;
          width: 300px;
          background-color: #fff;
          cursor: pointer;
          display: block;
        }
        .carRecord {
          margin: 5px auto;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 275px;
          background-color: #fff;
          text-align: left;
        }
        .detailsText {
          font-size: 15px;
          color: #333;
          margin-bottom: 5px;
        }
        /* Modal styles */
        .modalContent {
          background-color: #fff;
          padding: 15px;
          border-radius: 10px;
          width: 325px;
          margin: auto;
          max-height: 80vh;
          overflow-y: auto;
        }
        .modalOverlay {
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modalTitle {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
        }
        .totalsContainer {
          margin-bottom: 10px;
          text-align: center;
        }
        .totalsText {
          font-size: 15px;
          margin-bottom: 5px;
        }
        .closeModalButton {
          background-color: #841584;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ExportData;
