"use client"; // 👈 Add this line

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to SignIn page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/SignIn");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Logo */}
      <Image
        src="/images/logo.jpg"
        alt="Logo"
        width={192} // Equivalent to Tailwind's w-48 (12rem = 192px)
        height={192} // Equivalent to Tailwind's h-48
        className="w-48 h-48 mb-6"
      />

      {/* Flash Screen Text */}
      <h2 className="text-lg font-bold text-gray-600 text-center">
        Track And Monitor Your
        <br />
        Expenses
      </h2>

      {/* Navigation Links */}
      <nav className="mt-8 space-y-4">
        <Link
          href="/GenerateInvoice"
          className="text-xl text-blue-600 block px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 transition duration-300"
        >
          Invoice
        </Link>
        <Link
          href="/Companies"
          className="text-xl text-blue-600 block px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 transition duration-300"
        >
          Companies
        </Link>
        <Link
          href="/exportData"
          className="text-xl text-blue-600 block px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 transition duration-300"
        >
          Export Data
        </Link>
        <Link
          href="/ViewInvoices"
          className="text-xl text-blue-600 block px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 transition duration-300"
        >
          View Invoices
        </Link>
        <Link
          href="/SignIn"
          className="text-xl text-blue-600 block px-4 py-2 rounded-md hover:bg-blue-100 hover:text-blue-800 transition duration-300"
        >
          Sign In
        </Link>
      </nav>
    </div>
  );
}
