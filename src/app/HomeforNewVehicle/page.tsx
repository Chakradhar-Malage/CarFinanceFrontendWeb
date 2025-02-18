// 'use client';

// import { useState } from 'react';
// import { globalState } from '../../globalState';

// const Home = () => {
//   const UserName = globalState.UserName;

//   const [id, setId] = useState('');
//   const [nameOfVehicle, setNameOfVehicle] = useState('');
//   const [issuedTo, setIssuedTo] = useState('N/A');
//   const [agreedAmount, setAgreedAmount] = useState('0');
//   const [receivedAmount, setReceivedAmount] = useState('0');
//   const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
//   const [driverExpense, setDriverExpense] = useState('');
//   const [fuelExpense, setFuelExpense] = useState('');
//   const [maintenance, setMaintenance] = useState('');

//   // Convert input to uppercase before saving it as id.
//   const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedText = e.target.value.toUpperCase();
//     setId(formattedText);
//   };

//   const saveData = async () => {
//     if (!id.trim() || !nameOfVehicle.trim() || !issuedTo.trim()) {
//       window.alert('Validation Error: ID, Name of Vehicle, and Issued To are required.');
//       return;
//     }

//     const payload = {
//       id,
//       name_of_vehicle: nameOfVehicle,
//       issued_to: issuedTo,
//       Agreed_amount: agreedAmount ? parseInt(agreedAmount, 10) : 0,
//       Received_amount: parseInt(receivedAmount, 10),
//       date,
//       driver_expense: parseInt(driverExpense, 10),
//       Fuel_expense: parseInt(fuelExpense, 10),
//       Maintenance: parseInt(maintenance, 10),
//     };

//     try {
//       const response = await fetch('http://15.207.48.53:3000/addVehicle', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         window.alert('Success: ' + result.message);
//         setId('');
//         setNameOfVehicle('');
//         setIssuedTo('N/A');
//         setAgreedAmount('0');
//         setReceivedAmount('');
//         setDate(new Date().toLocaleDateString('en-GB'));
//         setDriverExpense('0');
//         setFuelExpense('0');
//         setMaintenance('0');
//       } else {
//         console.error('Error:', result);
//         window.alert('Error: ' + (result.error || 'Failed to save vehicle details.'));
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error('Network Error:', error.message);
//       } else {
//         console.error('Network Error:', error);
//       }
//       window.alert('Network Error: Unable to connect to the server.');
//     }
//   };

//   return (
//     <div style={styles.safeArea}>
//       <div style={styles.scrollView}>
//         {/* Header Section */}
//         <img
//           style={styles.usrimg}
//           src="/images/usericon.png"
//           alt="User Icon"
//         />
//         <div style={styles.headerTextContainer}>
//           <p style={styles.helloname}>Hello,</p>
//         </div>
//         <p style={styles.username}>{UserName}</p>
//         <button style={styles.logoutButton} onClick={() => console.log('Logout pressed')}>
//           <img style={styles.logoutimg} src="/images/Logout.png" alt="Logout" />
//         </button>
//         <div
//           style={{
//             margin: 15,
//             borderBottom: '1px solid black',
//             marginTop: 0
//           }}
//         />

//         {/* Vehicle Details Section */}
//         <div>
//           <img src="/images/Car.png" style={styles.carlogo} alt="Car Logo" />
//           <p style={styles.headingOfHomePage}>Enter Vehicle Details</p>
//         </div>

//         {/* Vehicle Detail Inputs */}
//         <div>
//           <p style={styles.innertextbelowHeadings}>Name of Vehicle :<br /></p>
//           <input
//             style={styles.input}
//             placeholder="Vehicle"
//             value={nameOfVehicle}
//             onChange={(e) => setNameOfVehicle(e.target.value)}
//           />

//           <p style={styles.innertextbelowHeadings}>Vehicle Number :<br /></p>
//           <input
//             style={styles.input}
//             placeholder="Vehicle No."
//             value={id}
//             onChange={handleIdChange}
//           />

//           <p style={styles.innertextbelowHeadings}>Name of the person/Event vehicle issued to :<br /></p>
//           <input
//             style={styles.input}
//             placeholder="Event/Person Name"
//             value={issuedTo}
//             onChange={(e) => setIssuedTo(e.target.value)}
//           />
//         </div>

//         {/* Billing Details Section */}
//         <div>
//           <img src="/images/Bill.png" style={styles.billlogo} alt="Bill Logo" />
//           <p style={styles.headingOfHomePage}>Billing Details</p>

//           <p style={styles.innertextbelowHeadings}>Agreed Amount :<br /></p>
//           <input
//             style={styles.billinginput}
//             placeholder="Rs."
//             value={agreedAmount}
//             onChange={(e) => setAgreedAmount(e.target.value)}
//           />

//           <p style={styles.innertextbelowHeadings}>Received Amount :<br /></p>
//           <input
//             style={styles.billinginput}
//             placeholder="Rs."
//             value={receivedAmount}
//             onChange={(e) => setReceivedAmount(e.target.value)}
//             type="number"
//           />

//           <p style={{ marginLeft: 550, marginTop: -160, fontSize: 15 }}>
//             Date :<br />
//           </p>
//           <input
//             style={{
//               width: '30%',
//               height: 40,
//               border: '1px solid gray',
//               borderRadius: 20,
//               padding: '0 15px',
//               backgroundColor: '#d3d3d3',
//               marginLeft: 540,
//             }}
//             placeholder="dd/mm/yyyy"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>

//         {/* Other Expenses Section */}
//         <div>
//           <img src="/images/Money.png" style={styles.moneylogo} alt="Money Logo" />
//           <p style={styles.headingOfHomePage}>Other Expenses <br /></p>
//           <p style={styles.otherexpensetext}>Driver Expense :</p>
//           <p style={styles.otherexpensetext}>Fuel Expense :</p>
//           <p style={styles.otherexpensetext}>Maintenance :</p>
//         </div>

//         <div style={{ marginTop: -110 }}>
//           <input
//             style={{
//               width: '40%',
//               height: 30,
//               border: '1px solid gray',
//               borderRadius: 10,
//               padding: '0 15px',
//               backgroundColor: '#d3d3d3',
//               marginLeft: 170,
//               marginTop: -90,
//               fontSize: 13,
//               paddingBottom: 6,
//               marginBottom: 10,
//             }}
//             placeholder="Rs."
//             value={driverExpense}
//             onChange={(e) => setDriverExpense(e.target.value)}
//             type="number"
//           />
//           <input
//             style={{
//               width: '40%',
//               height: 30,
//               border: '1px solid gray',
//               borderRadius: 10,
//               padding: '0 15px',
//               backgroundColor: '#d3d3d3',
//               marginLeft: 170,
//               marginTop: 2,
//               fontSize: 13,
//               paddingBottom: 5,
//               marginBottom: 10,
//             }}
//             placeholder="Rs."
//             value={fuelExpense}
//             onChange={(e) => setFuelExpense(e.target.value)}
//             type="number"
//           />
//           <input
//             style={{
//               width: '40%',
//               height: 30,
//               border: '1px solid gray',
//               borderRadius: 10,
//               padding: '0 15px',
//               backgroundColor: '#d3d3d3',
//               marginLeft: 170,
//               marginTop: 2,
//               fontSize: 13,
//               paddingBottom: 6,
//             }}
//             placeholder="Rs."
//             value={maintenance}
//             onChange={(e) => setMaintenance(e.target.value)}
//             type="number"
//           />
//         </div>

//         {/* Save Button */}
//         <div style={styles.savebutton}>
//           <button
//             onClick={async () => {
//               if (!id || !nameOfVehicle) {
//                 return window.alert('Error: ID, Name of Vehicle, and Issued To fields are required!');
//               }
//               await saveData();
//               window.alert('Vehicle Details Saved!');
//               // Reset fields
//               setId('');
//               setNameOfVehicle('');
//               setIssuedTo('N/A');
//               setAgreedAmount('0');
//               setReceivedAmount('0');
//               setDate(new Date().toLocaleDateString('en-GB'));
//               setDriverExpense('0');
//               setFuelExpense('0');
//               setMaintenance('0');
//             }}
//             style={{
//               backgroundColor: '#841584',
//               color: '#fff',
//               padding: '10px 20px',
//               border: 'none',
//               borderRadius: 5,
//               cursor: 'pointer',
//             }}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// const styles = {
//   safeArea: {
//     backgroundColor: '#fff',
//     minHeight: '100vh',
//     overflow: 'auto',
//     padding: 1,
//   },
//   scrollView: {
//     maxWidth: 800,
//     margin: '0 auto',
//   },
//   usrimg: {
//     marginLeft: 20,
//     marginTop: 20,
//     width: 50,
//     height: 50,
//     borderRadius: '50%',
//   },
//   headerTextContainer: {
//     display: 'flex',
//     flexDirection: 'column' as 'column',
//     alignItems: 'flex-start',
//     marginLeft: 10,
//   },
//   helloname: {
//     marginTop: -50,
//     marginLeft: 90,
//     fontSize: 14,
//   },
//   username: {
//     marginTop: -30,
//     marginLeft: 90,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'darkslategrey',
//   },
//   logoutButton: {
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//   },
//   logoutimg: {
//     marginTop: -50,
//     marginLeft: 630,
//     width: 25,
//     height: 25,
//   },
//   carlogo: {
//     marginTop: 10,
//     marginLeft: 20,
//     width: 25,
//     height: 25,
//   },
//   headingOfHomePage: {
//     marginLeft: 60,
//     marginTop: -28,
//     fontSize: 20,
//     fontWeight: '500',
//   },
//   innertextbelowHeadings: {
//     marginLeft: 40,
//     marginTop: 9,
//     fontSize: 15,
//   },
//   input: {
//     width: '80%',
//     height: 40,
//     border: '1px solid gray',
//     borderRadius: 20,
//     padding: '0 20px',
//     marginBottom: 7,
//     marginLeft: 40,
//     backgroundColor: '#d3d3d3',
//   },
//   billlogo: {
//     height: 22,
//     width: 18,
//     marginTop: 20,
//     marginLeft: 25,
//   },
//   billinginput: {
//     width: '40%',
//     height: 35,
//     border: '1px solid gray',
//     borderRadius: 20,
//     padding: '0 20px',
//     paddingBottom: 6,
//     marginBottom: 7,
//     marginLeft: 40,
//     backgroundColor: '#d3d3d3',
//   },
//   moneylogo: {
//     height: 20,
//     width: 21,
//     marginTop: 112,
//     marginLeft: 25,
//   },
//   otherexpensetext: {
//     marginTop: 20,
//     marginLeft: 40,
//     fontSize: 15,
//   },
//   savebutton: {
//     width: '40%',
//     marginLeft: 115,
//     marginTop: 20,
//   },
// };

'use client';

import { useState } from 'react';
import { globalState } from '../../globalState';

const Home = () => {
  const UserName = globalState.UserName;

  const [id, setId] = useState('');
  const [nameOfVehicle, setNameOfVehicle] = useState('');
  const [issuedTo, setIssuedTo] = useState('N/A');
  const [agreedAmount, setAgreedAmount] = useState('0');
  const [receivedAmount, setReceivedAmount] = useState('0');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [driverExpense, setDriverExpense] = useState('0');
  const [fuelExpense, setFuelExpense] = useState('0');
  const [maintenance, setMaintenance] = useState('0');

  // Convert input to uppercase before saving it as id.
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedText = e.target.value.toUpperCase();
    setId(formattedText);
  };

  const saveData = async () => {
    if (!id.trim() || !nameOfVehicle.trim() || !issuedTo.trim()) {
      window.alert(
        'Validation Error: ID, Name of Vehicle, and Issued To are required.'
      );
      return;
    }

    const payload = {
      id,
      name_of_vehicle: nameOfVehicle,
      issued_to: issuedTo,
      Agreed_amount: agreedAmount ? parseInt(agreedAmount, 10) : 0,
      Received_amount: parseInt(receivedAmount, 10),
      date,
      driver_expense: parseInt(driverExpense, 10),
      Fuel_expense: parseInt(fuelExpense, 10),
      Maintenance: parseInt(maintenance, 10),
    };

    try {
      const response = await fetch('http://15.207.48.53:3000/addVehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        window.alert('Success: ' + result.message);
        // Reset fields
        setId('');
        setNameOfVehicle('');
        setIssuedTo('N/A');
        setAgreedAmount('0');
        setReceivedAmount('0');
        setDate(new Date().toLocaleDateString('en-GB'));
        setDriverExpense('0');
        setFuelExpense('0');
        setMaintenance('0');
      } else {
        console.error('Error:', result);
        window.alert('Error: ' + (result.error || 'Failed to save vehicle details.'));
      }
    } catch (error) {
      console.error('Network Error:', error);
      window.alert('Network Error: Unable to connect to the server.');
    }
  };

  const handleSave = async () => {
    if (!id.trim() || !nameOfVehicle.trim() || !issuedTo.trim()) {
      return window.alert(
        'Error: ID, Name of Vehicle, and Issued To fields are required!'
      );
    }
    await saveData();
    window.alert('Vehicle Details Saved!');
  };

  return (
    <div className="safeArea">
      <div className="scrollView">
        {/* Header Section */}
        <div className="header">
          <img className="usrimg" src="/images/usericon.png" alt="User Icon" />
          <div className="headerText">
            <p className="helloname">Hello,</p>
            <p className="username">{UserName}</p>
          </div>
          <button className="logoutButton" onClick={() => console.log('Logout pressed')}>
            <img className="logoutimg" src="/images/Logout.png" alt="Logout" />
          </button>
        </div>
        <hr className="divider" />

        {/* Vehicle Details Section */}
        <div className="section">
          <div className="sectionHeader">
            <img src="/images/Car.png" className="icon" alt="Car Logo" />
            <p className="sectionTitle">Enter Vehicle Details</p>
          </div>
          <div className="inputGroup">
            <label>Name of Vehicle:</label>
            <input
              type="text"
              placeholder="Vehicle"
              value={nameOfVehicle}
              onChange={(e) => setNameOfVehicle(e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label>Vehicle Number:</label>
            <input
              type="text"
              placeholder="Vehicle No."
              value={id}
              onChange={handleIdChange}
            />
          </div>
          <div className="inputGroup">
            <label>Name of the person/Event vehicle issued to:</label>
            <input
              type="text"
              placeholder="Event/Person Name"
              value={issuedTo}
              onChange={(e) => setIssuedTo(e.target.value)}
            />
          </div>
        </div>

        {/* Billing Details Section */}
        <div className="section">
          <div className="sectionHeader">
            <img src="/images/Bill.png" className="icon" alt="Bill Logo" />
            <p className="sectionTitle">Billing Details</p>
          </div>
          <div className="inputGroup">
            <label>Agreed Amount:</label>
            <input
              type="number"
              placeholder="Rs."
              value={agreedAmount}
              onChange={(e) => setAgreedAmount(e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label>Received Amount:</label>
            <input
              type="number"
              placeholder="Rs."
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label>Date:</label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Other Expenses Section */}
        <div className="section">
          <div className="sectionHeader">
            <img src="/images/Money.png" className="icon" alt="Money Logo" />
            <p className="sectionTitle">Other Expenses</p>
          </div>
          <div className="inputGroup">
            <label>Driver Expense:</label>
            <input
              type="number"
              placeholder="Rs."
              value={driverExpense}
              onChange={(e) => setDriverExpense(e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label>Fuel Expense:</label>
            <input
              type="number"
              placeholder="Rs."
              value={fuelExpense}
              onChange={(e) => setFuelExpense(e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label>Maintenance:</label>
            <input
              type="number"
              placeholder="Rs."
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="saveButtonContainer">
          <button className="saveButton" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      <style jsx>{`
        .safeArea {
          background-color: #fff;
          min-height: 100vh;
          padding: 10px;
          box-sizing: border-box;
        }
        .scrollView {
          max-width: 800px;
          margin: 0 auto;
          padding: 10px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .usrimg {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .headerText {
          flex: 1;
          margin-left: 10px;
        }
        .helloname {
          margin: 0;
          font-size: 14px;
        }
        .username {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
          color: darkslategrey;
        }
        .logoutButton {
          background: none;
          border: none;
          cursor: pointer;
        }
        .logoutimg {
          width: 25px;
          height: 25px;
        }
        .divider {
          margin: 15px 0;
          border: none;
          border-bottom: 1px solid #ccc;
        }
        .section {
          margin-bottom: 20px;
        }
        .sectionHeader {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .icon {
          width: 25px;
          height: 25px;
          margin-right: 10px;
        }
        .sectionTitle {
          font-size: 20px;
          font-weight: 500;
          margin: 0;
        }
        .inputGroup {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }
        .inputGroup label {
          margin-bottom: 5px;
          font-size: 15px;
        }
        .inputGroup input {
          width: 100%;
          padding: 10px;
          font-size: 15px;
          border: 1px solid gray;
          border-radius: 5px;
          background-color: #f0f0f0;
          box-sizing: border-box;
        }
        .saveButtonContainer {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .saveButton {
          background-color: #841584;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        /* Responsive Styles */
        @media (max-width: 600px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .logoutButton {
            align-self: flex-end;
          }
          .sectionTitle {
            font-size: 18px;
          }
          .inputGroup input {
            font-size: 14px;
            padding: 8px;
          }
          .saveButton {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
