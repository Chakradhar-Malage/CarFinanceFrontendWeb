/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { globalState, saveGlobalState } from '../globalState';

interface CarDataResponse {
  data: any[];
  totalPendingAmount: number;
  totalCount: number;
}

const CarCurrentData = () => {
      const [carData, setCarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCarData = async () => {
    try {
      const response = await axios.get<CarDataResponse>('http://15.207.48.53:3000/allentries');
      const { data, totalPendingAmount, totalCount } = response.data;
      setCarData(data);
      globalState.totalPendingAmount = totalPendingAmount;
      globalState.totalCount = totalCount;
      saveGlobalState();
    } catch (error) {
      console.error('Error fetching car details:', (error as any).message);
      alert('Failed to load car data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-purple-600 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center p-4">
      {carData.map((item) => (
        <div 
          key={item.id} 
          className="flex items-center bg-gray-300 w-11/12 p-4 mb-2 rounded-lg shadow-md cursor-pointer"
          onClick={() => {
            globalState.TempforViewing = item.id;
            localStorage.setItem('TempforViewing', item.id); // Persist the selected vehicle
            router.push('/ViewCarDetails');
          }}
        >
          <Image
            src="/images/CardetailsComponentImg.png"
            alt="Car Image"
            width={55}
            height={55}
            className="rounded-lg bg-purple-600"
          />
          <div className="ml-4 flex-1">
            <p className="font-semibold text-lg">{item.id}</p>
            <p className="text-sm italic font-medium mt-1 truncate">{item.name_of_vehicle}</p>
          </div>
          <p className="text-xs text-gray-700 self-end">{item.date}</p>
        </div>
      ))}
    </div>
  );
};

export default CarCurrentData;
