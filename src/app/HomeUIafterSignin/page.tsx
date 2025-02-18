'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CarCurrentData from '../../components/CarCurrentData';
import { globalState, loadGlobalState } from '../../globalState';
import Image from "next/image";

const HomeUIafterSignin = () => {
  const router = useRouter();
  const UserName = globalState.UserName;

  const [totalPendingAmount, setTotalPendingAmount] = useState(globalState.totalPendingAmount);
  const [totalCount, setTotalCount] = useState(globalState.totalCount);

  useEffect(() => {
    const initializeGlobalState = async () => {
      await loadGlobalState();
      setTotalPendingAmount(globalState.totalPendingAmount);
      setTotalCount(globalState.totalCount);
    };

    initializeGlobalState();
  }, []);

  return (
    <div className="container">
      {/* User Info Section */}
      <div className="header">
        <Image
            src="/images/usericon.png"
            alt="User Icon"
            width={50}
            height={50}
            className="rounded-full"
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

      <div className="separator" />

      {/* Buttons Section */}
      <div className="buttons-section">
        <button className="nav-button" onClick={() => router.push('/HomeforNewVehicle')}>
          <span className="buttonText">ADD NEW VEHICLE</span>
          {/* <img className="arrowIcon" src="/assets/images/right-arrow.png" alt="Arrow" /> */}
          <Image
            src="/images/right-arrow.png"
            alt="Arrow"
            width={20}
            height={20}
            className="rounded-full"
        />
        </button>

        <button className="nav-button" onClick={() => router.push('/exportData')}>
          <span className="buttonText">EXPORT DATA</span>
          <Image
            src="/images/right-arrow.png"
            alt="Arrow"
            width={20}
            height={20}
            className="rounded-full"
        />
        </button>

        <button className="nav-button" onClick={() => router.push('/DeleteVehicle')}>
          <span className="buttonText">DELETE VEHICLE</span>
          <Image
            src="/images/right-arrow.png"
            alt="Arrow"
            width={20}
            height={20}
            className="rounded-full"
        />
        </button>
      </div>

      <div className="separator" />

      {/* Data Section */}
      <div className="data-section">
        <CarCurrentData />
      </div>

      {/* Footer Section */}
      <div className="footer">
        <p>Total Vehicles : {totalCount}</p>
        <p>Pending Amount : Rs. {totalPendingAmount}</p>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          font-family: sans-serif;
        }
        .header {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 20px;
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
          margin-left: 20px;
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
        .buttons-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin: 0 20px;
        }
        .nav-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
        }
        .buttonText {
          font-size: 13px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .arrowIcon {
          width: 15px;
          height: 15px;
          object-fit: contain;
        }
        .data-section {
          margin-bottom: 30px;
          padding: 0 20px;
        }
        .footer {
          padding: 0 20px;
          font-size: 16px;
        }
        .footer p {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default HomeUIafterSignin;
