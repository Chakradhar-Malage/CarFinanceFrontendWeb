"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Home = () => {
  const [id, setId] = useState("");
  const [name_of_vehicle, setNameOfVehicle] = useState("");
  const [issued_to, setIssuedTo] = useState("N/A");
  const [agreed_amount, setAgreedAmount] = useState("0");
  const [received_amount, setReceivedAmount] = useState("0");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-GB"));
  const [driver_expense, setDriverExpense] = useState("");
  const [fuel_expense, setFuelExpense] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const router = useRouter();

  const saveData = async () => {
    if (!id.trim() || !name_of_vehicle.trim() || !issued_to.trim()) {
      alert("Validation Error: ID, Name of Vehicle, and Issued To are required.");
      return;
    }

    const payload = {
      id,
      name_of_vehicle,
      issued_to,
      agreed_amount: agreed_amount ? parseInt(agreed_amount, 10) : 0,
      received_amount: parseInt(received_amount, 10),
      date,
      driver_expense: parseInt(driver_expense, 10),
      fuel_expense: parseInt(fuel_expense, 10),
      maintenance: parseInt(maintenance, 10),
    };

    try {
      const response = await axios.post("http://15.207.48.53:3000/addVehicle", payload);
      alert("Success: " + response.data.message);
      setId("");
      setNameOfVehicle("");
      setIssuedTo("N/A");
      setAgreedAmount("0");
      setReceivedAmount("");
      setDate(new Date().toLocaleDateString("en-GB"));
      setDriverExpense("0");
      setFuelExpense("0");
      setMaintenance("0");
    } catch (error) {
      console.error("Error saving vehicle details:", error);
      alert("Failed to save vehicle details.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Image src="/images/usericon.png" alt="User Icon" width={50} height={50} className="rounded-full" />
        <div>
          <p className="text-gray-500 text-sm">Hello,</p>
          <p className="text-lg font-bold text-gray-700">OmSai</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Enter Vehicle Details</h2>
      <input type="text" placeholder="Vehicle Name" value={name_of_vehicle} onChange={(e) => setNameOfVehicle(e.target.value)} className="border p-2 rounded w-full mb-4" />
      <input type="text" placeholder="Vehicle Number" value={id} onChange={(e) => setId(e.target.value.toUpperCase())} className="border p-2 rounded w-full mb-4" />
      <input type="text" placeholder="Issued To" value={issued_to} onChange={(e) => setIssuedTo(e.target.value)} className="border p-2 rounded w-full mb-4" />

      <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
      <input type="number" placeholder="Agreed Amount" value={agreed_amount} onChange={(e) => setAgreedAmount(e.target.value)} className="border p-2 rounded w-full mb-4" />
      <input type="number" placeholder="Received Amount" value={received_amount} onChange={(e) => setReceivedAmount(e.target.value)} className="border p-2 rounded w-full mb-4" />
      <input type="text" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded w-full mb-4" />

      <h2 className="text-xl font-semibold mb-4">Other Expenses</h2>
      <input type="number" placeholder="Driver Expense" value={driver_expense} onChange={(e) => setDriverExpense(e.target.value)} className="border p-2 rounded w-full mb-4" />
      <input type="number" placeholder="Fuel Expense" value={fuel_expense} onChange={(e) => setFuelExpense(e.target.value)} className="border p-2 rounded w-full mb-4" />
      <input type="number" placeholder="Maintenance" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} className="border p-2 rounded w-full mb-4" />

      <button onClick={saveData} className="bg-purple-700 text-white px-4 py-2 rounded-lg w-full">Save</button>
    </div>
  );
};

export default Home;
