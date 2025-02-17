"use client";  // 👈 Add this line

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
      <img src="/images/logo.jpg" alt="Logo" className="w-48 h-48 mb-6" />

      {/* Flash Screen Text */}
      <h2 className="text-lg font-bold text-gray-600 text-center">
        Track And Monitor Your<br /> Expenses
      </h2>

      {/* Navigation Links */}
      <nav className="mt-8 space-y-2">
        <Link href="/GenerateInvoice" className="text-xl text-blue-600 block">Invoice</Link>
        <Link href="/Companies" className="text-xl text-blue-600 block">Companies</Link>
        <Link href="/exportData" className="text-xl text-blue-600 block">Export Data</Link>
        <Link href="/ViewInvoices" className="text-xl text-blue-600 block">View Invoices</Link>
        <Link href="/SignIn" className="text-xl text-blue-600 block">Sign In</Link>
      </nav>
    </div>
  );
}
