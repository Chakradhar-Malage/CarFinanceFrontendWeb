"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

const DeleteVehicle = () => {
  const [id, setId] = useState("");

  const handleDelete = async () => {
    if (!id) {
      alert("Error: Please enter a Vehicle ID");
      return;
    }

    try {
      const response = await axios.delete(`http://15.207.48.53:3000/deleteVehicle/${id}`);
      alert("Success: " + response.data);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Error: Failed to delete the vehicle");
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

      <h2 className="text-xl font-semibold mb-4">Enter the Vehicle Number to delete:</h2>
      <input
        type="text"
        placeholder="Vehicle Number"
        value={id}
        onChange={(e) => setId(e.target.value.toUpperCase())}
        className="border p-2 rounded w-full mb-4"
      />

      <button onClick={handleDelete} className="bg-purple-700 text-white px-4 py-2 rounded-lg w-full">
        Delete
      </button>
    </div>
  );
};

export default DeleteVehicle;
