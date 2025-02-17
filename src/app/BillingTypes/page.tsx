'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const BillingTypeCard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 p-5">
      <div
        className="bg-white rounded-lg p-4 shadow-md w-80 h-36 flex justify-center items-center mb-5 cursor-pointer transition-transform hover:scale-105"
        onClick={() => router.push('/ViewInvoices')}
      >
        <h3 className="text-2xl font-bold text-green-700">Om Sai Enterprise</h3>
      </div>

      <div
        className="bg-white rounded-lg p-4 shadow-md w-80 h-36 flex justify-center items-center mb-5 cursor-pointer transition-transform hover:scale-105"
        onClick={() => router.push('ViewNonGSTinvoices')}
      >
        <h3 className="text-2xl font-bold text-green-700">Om Sai Generators</h3>
      </div>

      <div
        className="bg-white rounded-lg p-4 shadow-md w-80 h-36 flex justify-center items-center mb-5 cursor-pointer transition-transform hover:scale-105"
        onClick={() => router.push('/quotation')}
      >
        <h3 className="text-2xl font-bold text-green-700">Enterprise Quotations</h3>
      </div>

      <div
        className="bg-white rounded-lg p-4 shadow-md w-80 h-36 flex justify-center items-center mb-5 cursor-pointer transition-transform hover:scale-105"
        onClick={() => router.push('Generatorquotation')}
      >
        <h3 className="text-2xl font-bold text-green-700">Generator Quotations</h3>
      </div>
    </div>
  );
};

export default BillingTypeCard;
