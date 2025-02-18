"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const ViewCarDetails = () => {
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const vehicleId = localStorage.getItem("TempforViewing");
    const [receivedAmount, setReceivedAmount] = useState();
    const [agreedAmount, setAgreedAmount] = useState();
    const [issuedTo, setIssuedTo] = useState();
    const [fuelExpense, setFuelExpense] = useState();
    const [maintenance, setMaintenance] = useState();
    const [driverExpense, setDriverExpense] = useState();
    const [date, setDate] = useState();

    useEffect(() => {
        if (!vehicleId) {
            alert("No vehicle ID found");
            setLoading(false);
            return;
        }

        const fetchVehicleDetails = async () => {
            try {
                const response = await axios.get(`http://15.207.48.53:3000/searchById?id=${encodeURIComponent(vehicleId)}`);
                if (response.data.length === 0) {
                    alert("No details found for this vehicle");
                } else {
                    const data = response.data[0];
                    setVehicleDetails(data);
                    setAgreedAmount(data.agreed_amount);
                    setIssuedTo(data.issued_to);
                    setReceivedAmount(data.received_amount);
                    setDate(data.date);
                    setDriverExpense(data.driver_expense);
                    setFuelExpense(data.fuel_expense);
                    setMaintenance(data.maintenance);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleDetails();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!vehicleDetails) return <p>No details available for this vehicle.</p>;

    const saveCarDetails = async () => {
        try {
            const updatedCarDetails = {
                agreed_amount: agreedAmount,
                received_amount: receivedAmount,
                fuel_expense: fuelExpense,
                maintenance: maintenance,
                driver_expense: driverExpense,
                issued_to: issuedTo,
                date: date
            };
            
            const response = await axios.put(`http://15.207.48.53:3000/updateCarDetails/${vehicleId}`, updatedCarDetails);
            if (response.status === 200) {
                alert("Car details updated successfully.");
            } else {
                alert("Failed to update car details.");
            }
        } catch (error) {
            console.error("Error updating car details:", error);
            alert("An error occurred while updating car details.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Vehicle Details</h2>
            <label>Name of Vehicle:</label>
            <input type="text" value={vehicleDetails.name_of_vehicle} readOnly />

            <label>Vehicle Number:</label>
            <input type="text" value={vehicleId} readOnly />

            <label>Issued To:</label>
            <input type="text" value={issuedTo} onChange={(e) => setIssuedTo(e.target.value)} />

            <label>Agreed Amount:</label>
            <input type="number" value={agreedAmount} onChange={(e) => setAgreedAmount(e.target.value)} />

            <label>Received Amount:</label>
            <input type="number" value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} />

            <label>Fuel Expense:</label>
            <input type="number" value={fuelExpense} onChange={(e) => setFuelExpense(e.target.value)} />

            <label>Maintenance:</label>
            <input type="number" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} />

            <label>Driver Expense:</label>
            <input type="number" value={driverExpense} onChange={(e) => setDriverExpense(e.target.value)} />

            <label>Date:</label>
            <input type="date" value={moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")} onChange={(e) => setDate(e.target.value)} />

            <button onClick={saveCarDetails} style={{ marginTop: "10px", backgroundColor: "#841584", color: "white", padding: "10px", border: "none" }}>Save</button>
        </div>
    );
};

export default ViewCarDetails;
