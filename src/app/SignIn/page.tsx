'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Removed unused imports
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/Companies"); // Redirect to Companies page if already logged in
    }
  }, [router]);

  const handleSignIn = () => {
    // Access the username and password from the environment variables
    const storedUsername = process.env.NEXT_PUBLIC_USERNAME;
    const storedPassword = process.env.NEXT_PUBLIC_PASSWORD;

    // Check the username and password
    if (username === storedUsername && password === storedPassword) {
      // Save login status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username); // Optional: Store username
      setError(null); // Reset error message
      router.push("/Companies"); // Redirect to Companies page
    } else {
      setError("Invalid username or password"); // Display error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <div className="mb-6">
        <Image src="/images/logo.jpg" alt="Logo" width={200} height={200} />
      </div>

      {/* Username Input */}
      <input
        type="text"
        className="w-80 h-12 border border-gray-400 rounded-lg px-4 mb-4 bg-gray-200"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Password Input */}
      <input
        type="password"
        className="w-80 h-12 border border-gray-400 rounded-lg px-4 mb-4 bg-gray-200"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Sign In Button */}
      <button
        onClick={handleSignIn}
        className="w-80 h-12 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
      >
        Sign In
      </button>

      {/* Bottom Text */}
      <p className="mt-10 text-lg font-semibold">Yes, We CAN!</p>
    </div>
  );
};

export default SignIn;
