'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CarCurrentData from '../components/CarCurrentData';
import { globalState, loadGlobalState } from '@/src/globalState';

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
        <div className="gesture-handler-root">
            <div className="safe-area">
                {/* User Info Section */}
                <Image
                    src="/assets/images/usericon.png"
                    width={48}
                    height={48}
                    className="rounded-full ml-5 mt-5"
                    alt="User Icon"
                />
                <div className="flex flex-col items-start ml-2">
                    <p className="text-sm ml-[90px] mt-[-50px]">Hello,</p>
                </div>
                <p className="text-lg font-bold ml-[90px] mt-[-30px] text-gray-700">{UserName}</p>
                <button>
                    <Image
                        src="/assets/images/Logout.png"
                        width={25}
                        height={25}
                        className="absolute right-10 top-6"
                        alt="Logout Icon"
                    />
                </button>
                <hr className="border border-gray-300 mx-6 my-6" />
                
                {/* Buttons Section */}
                {[
                    { name: 'ADD NEW VEHICLE', path: '/HomeforNewVehicle' },
                    { name: 'EXPORT DATA', path: '/exportData' },
                    { name: 'DELETE VEHICLE', path: '/DeleteVehicle' },
                ].map((item, index) => (
                    <button key={index} onClick={() => router.push(item.path)} className="flex justify-between items-center px-5 py-3 mx-5 my-2 bg-gray-100 border border-gray-300 rounded-md w-[calc(100%-40px)]">
                        <span className="text-sm text-gray-700 overflow-hidden">{item.name}</span>
                        <Image src="/assets/images/right-arrow.png" width={15} height={15} alt="Arrow Icon" />
                    </button>
                ))}
                
                <hr className="border border-gray-300 mx-6 my-6" />
            </div>

            {/* Data Section */}
            <div className="mb-8">
                <CarCurrentData />
            </div>

            {/* Footer Section */}
            <div className="safe-area">
                <p className="ml-6 text-md">Total Vehicles : {totalCount}</p>
                <p className="ml-6 text-md mt-1">Pending Amount : Rs.{totalPendingAmount}</p>
            </div>
        </div>
    );
};

export default HomeUIafterSignin;
