'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import moment from 'moment';
import { globalState } from '../../globalState';
import Image from "next/image";

const ViewCarDetails = () => {
  const [vehicleDetails, setVehicleDetails] = useState(null); // Store vehicle details
  const [loading, setLoading] = useState(true);
  const UserName = globalState.UserName;
  const router = useRouter();
  const vehicleId = globalState.TempforViewing;

  const [received_amount, setReceivedAmount] = useState('');
  const [agreed_amount, setAgreedAmount] = useState('');
  const [issued_to, setIssuedTo] = useState('');
  const [fuel_expense, setFuelExpense] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [driver_expense, setDriverExpense] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const vehicleId = globalState.TempforViewing;
    if (!vehicleId) {
      window.alert('No vehicle ID found');
      setLoading(false);
      return;
    }
    const fetchVehicleDetails = async () => {
      try {
        const response = await fetch(
          `http://15.207.48.53:3000/searchById?id=${encodeURIComponent(
            vehicleId
          )}`
        );
        const data = await response.json();
        if (data.length === 0) {
          window.alert('No details found for this vehicle');
        } else {
          setVehicleDetails(data[0]);
          setAgreedAmount(data[0].agreed_amount);
          setIssuedTo(data[0].issued_to);
          setReceivedAmount(data[0].received_amount);
          setDate(data[0].date);
          setDriverExpense(data[0].driver_expense);
          setFuelExpense(data[0].fuel_expense);
          setMaintenance(data[0].maintenance);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        window.alert('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, []);

  const saveCarDetails = async () => {
    try {
      const updatedCarDetails = {};

      if (agreed_amount !== undefined) {
        updatedCarDetails.agreed_amount = parseInt(agreed_amount);
      }
      if (received_amount !== undefined) {
        updatedCarDetails.received_amount = parseInt(received_amount);
      }
      if (fuel_expense !== undefined) {
        updatedCarDetails.fuel_expense = parseInt(fuel_expense);
      }
      if (maintenance !== undefined) {
        updatedCarDetails.maintenance = parseInt(maintenance);
      }
      if (driver_expense !== undefined) {
        updatedCarDetails.driver_expense = parseInt(driver_expense);
      }
      if (issued_to !== undefined) {
        updatedCarDetails.issued_to = issued_to;
      }
      if (date !== undefined) {
        updatedCarDetails.date = date;
      }

      const response = await axios.put(
        `http://15.207.48.53:3000/updateCarDetails/${vehicleId}`,
        updatedCarDetails
      );

      if (response.status === 200) {
        window.alert('Car details updated successfully.');
        router.back();
      } else {
        window.alert('Failed to update car details.');
      }
    } catch (error) {
      console.error('Error updating car details:', error.response?.data || error.message);
      window.alert('An error occurred while updating car details.');
    }
  };

  const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

  const clearAndSaveDetails = async () => {
    try {
      // Calculate the total expenses
      const totalExpenses =
        (fuel_expense ? parseInt(fuel_expense) : 0) +
        (driver_expense ? parseInt(driver_expense) : 0) +
        (maintenance ? parseInt(maintenance) : 0);

      // Prepare the data to save, including the date from the input
      const dataToSave = {
        vehicle_number: vehicleId,
        agreed_amount: parseInt(agreed_amount) || 0,
        issued_to: issued_to || 'N/A',
        total_expenses: totalExpenses,
        cleared_date: formattedDate, // NEW: send the user-provided date
      };

      // API call to save data to the database
      const response = await axios.post(
        'http://15.207.48.53:3000/saveClearedDetails',
        dataToSave
      );

      if (response.status === 200) {
        window.alert('Details saved successfully.');
        // Reset the fields
        setIssuedTo('N/A');
        setAgreedAmount(0);
        setReceivedAmount(0);
        setFuelExpense(0);
        setMaintenance(0);
        setDriverExpense(0);
      } else {
        window.alert('Failed to save details.');
      }
    } catch (error) {
      console.error('Error saving cleared details:', error.response?.data || error.message);
      window.alert('Vehicle is already cleared.');
    }
  };

  const calculatePendingAmount = () => {
    const agreed = agreed_amount || (vehicleDetails ? vehicleDetails.agreed_amount : 0);
    const received = received_amount || (vehicleDetails ? vehicleDetails.received_amount : 0);
    return agreed - received;
  };

  const handlePendingAmount = async () => {
    const pendingAmount = calculatePendingAmount();

    if (pendingAmount > 0) {
      try {
        // Make the second API call with pending amount
        const response = await axios.post('http://15.207.48.53:3000/processPendingAmount', {
          vehicleId: vehicleId,
          pending_amount: pendingAmount,
          customer_name: issued_to,
        });

        if (response.status === 200 || response.status === 201) {
          window.alert('Pending amount processed successfully.');
          await clearAndSaveDetails();
          // Resetting state values
          setIssuedTo('N/A');
          setAgreedAmount(0);
          setReceivedAmount(0);
          setFuelExpense(0);
          setMaintenance(0);
          setDriverExpense(0);
        } else {
          window.alert('Failed to process pending amount: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error processing pending amount:', error.response?.data || error.message);
        window.alert(
          'An error occurred while processing pending amount: ' +
            (error.response?.data.message || error.message)
        );
      }
    } else {
      window.alert('Pending amount must be greater than zero.');
    }
  };

  const handleClearButtonPress = async () => {
    // Using window.confirm to decide between full payment or pending amount
    const fullPayment = window.confirm(
      'Did customer pay the full amount? (OK for Yes, Cancel for No)'
    );
    if (fullPayment) {
      await clearAndSaveDetails();
    } else {
      await handlePendingAmount();
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!vehicleDetails) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>No details available for this vehicle.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div>
        <Image
            src="/images/usericon.png"
            alt="User Icon"
            width={50}
            height={50}
            className="rounded-full"
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: -15, marginTop: 10 }}>
          <p style={styles.helloname}>Hello,</p><br></br>
          <p style={styles.username}>{UserName}</p>
        </div>
        {/* <button onClick={() => router.push('/logout')} style={{ background: 'none', border: 'none' }}> */}
          {/* <Image
                src="/images/Logout.png"
                alt="User Icon"
                width={25}
                height={25}
                className="rounded-full align-right margin-left-10"
            /> */}
            <img src="/images/Logout.png" style={styles.logoutimg} alt="logout" />
        {/* </button> */}
      </div>

      <div style={{ margin: '25px', borderBottom: '1px solid black' }}></div>

      {/* Vehicle Details Header */}
      <div>
        <img src="/images/Car.png" style={styles.carlogo} alt="Car" />
        <p style={styles.headingOfHomePage}>Vehicle Details</p>
      </div>

      {/* Vehicle Detail Fields */}
      <div>
        <p style={styles.innertextbelowHeadings}>Name of Vehicle :<br /></p>
        <input
          style={styles.input}
          value={vehicleDetails.name_of_vehicle}
          placeholder={vehicleDetails.name_of_vehicle}
          readOnly
        />

        <p style={styles.innertextbelowHeadings}>Vehicle Number :<br /></p>
        <input
          style={styles.input}
          value={vehicleId}
          placeholder={vehicleId}
          readOnly
        />

        <p style={styles.innertextbelowHeadings}>Issued To :<br /></p>
        <input
          style={styles.input}
          value={issued_to}
          placeholder="Event/Person Name"
          onChange={(e) => setIssuedTo(e.target.value)}
        />

        <p style={styles.innertextbelowHeadings}>Agreed Amount :<br /></p>
        <input
          style={styles.billinginput}
          value={agreed_amount}
          placeholder={vehicleDetails.agreed_amount ? vehicleDetails.agreed_amount.toString() : ''}
          onChange={(e) => setAgreedAmount(e.target.value)}
          type="number"
        />

        <p style={styles.innertextbelowHeadings}>Received Amount :<br /></p>
        <input
          style={styles.billinginput}
          value={received_amount}
          placeholder={vehicleDetails.received_amount ? vehicleDetails.received_amount.toString() : ''}
          onChange={(e) => setReceivedAmount(e.target.value)}
          type="number"
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 15, marginLeft: 950 }}>Date :</p>
          <input
            style={{
              width: '30%',
              height: 40,
              border: '1px solid gray',
              borderRadius: 20,
              padding: '0 15px',
              backgroundColor: '#d3d3d3',
            }}
            value={date}
            placeholder={vehicleDetails.date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Expense Fields */}
      <div style={{ marginTop: '20px' }}>
        <p style={{ marginLeft: 40, fontSize: 15, marginBottom: -15 }}>Driver Expense :</p>
        <input
          style={{
            width: '30%',
            height: 30,
            border: '1px solid gray',
            borderRadius: 10,
            padding: '0 15px',
            backgroundColor: '#d3d3d3',
            marginLeft: 180,
            marginTop: -30,
            fontSize: 13,
          }}
          value={driver_expense}
          placeholder={vehicleDetails.driver_expense ? vehicleDetails.driver_expense.toString() : ''}
          onChange={(e) => setDriverExpense(e.target.value)}
          type="number"
        />

        <p style={styles.otherexpensetext}>Fuel Expense :</p>
        <input
          style={{
            width: '40%',
            height: 30,
            border: '1px solid gray',
            borderRadius: 10,
            padding: '0 15px',
            backgroundColor: '#d3d3d3',
            marginLeft: 180,
            marginTop: -10,
            fontSize: 13,
          }}
          value={fuel_expense}
          placeholder={vehicleDetails.fuel_expense ? vehicleDetails.fuel_expense.toString() : ''}
          onChange={(e) => setFuelExpense(e.target.value)}
          type="number"
        />

        <p style={styles.otherexpensetext}>Maintenance :</p>
        <input
          style={{
            width: '40%',
            height: 30,
            border: '1px solid gray',
            borderRadius: 10,
            padding: '0 15px',
            backgroundColor: '#d3d3d3',
            marginLeft: 180,
            marginTop: 2,
            fontSize: 13,
          }}
          value={maintenance}
          placeholder={vehicleDetails.maintenance ? vehicleDetails.maintenance.toString() : ''}
          onChange={(e) => setMaintenance(e.target.value)}
          type="number"
        />
      </div>

      <p style={{ fontSize: 18, marginLeft: 20, marginTop: 20 }}>
        Pending Amount : Rs.{calculatePendingAmount()}
      </p>

      {/* Save and Clear Buttons */}
      <div style={styles.savebutton}>
        <button
          onClick={() => {
            if (window.confirm('Do you want to save the details?')) saveCarDetails();
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#841584',
            color: 'white',
            border: 'none',
            borderRadius: 5,
          }}
        >
          Save
        </button>
      </div>

      <div style={{ marginLeft: 215, marginTop: -45, width: '40%' }}>
        <button
          onClick={handleClearButtonPress}
          style={{
            padding: '10px 20px',
            backgroundColor: '#841584',
            color: 'white',
            border: 'none',
            borderRadius: 5,
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ViewCarDetails;

const styles = {
  username: {
    marginTop: -30,
    marginLeft: 90,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'darkslategrey',
  },
  helloname: {
    marginTop: -50,
    marginLeft: 90,
    fontSize: 14,
  },
  usrimg: {
    marginLeft: 20,
    marginTop: 20,
    width: '40px',
    height: '40px',
  },
  logoutimg: {
    marginTop: -30,
    marginLeft: 1400,
    width: 25,
    height: 25,
  },
  carlogo: {
    marginTop: 10,
    marginLeft: 20,
  },
  headingOfHomePage: {
    marginLeft: 60,
    marginTop: -28,
    fontSize: 20,
    fontWeight: '500',
  },
  innertextbelowHeadings: {
    marginLeft: 40,
    marginTop: 9,
    fontSize: 15,
  },
  input: {
    width: '80%',
    height: 40,
    border: '1px solid gray',
    borderRadius: 20,
    padding: '0 20px',
    marginBottom: 7,
    marginLeft: 40,
    backgroundColor: '#d3d3d3',
  },
  billinginput: {
    width: '40%',
    height: 35,
    border: '1px solid gray',
    borderRadius: 20,
    padding: '0 20px',
    paddingBottom: 6,
    marginBottom: 7,
    marginLeft: 40,
    backgroundColor: '#d3d3d3',
  },
  otherexpensetext: {
    marginTop: 10,
    marginLeft: 40,
    fontSize: 15,
  },
  savebutton: {
    width: '40%',
    marginLeft: 30,
    marginTop: 40,
    marginBottom: 10,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: 150,
    marginTop: 5,
    margin: '0 auto',
  },
  error: {
    color: 'red',
  },
};
