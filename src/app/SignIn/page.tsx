"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/Companies"); // Navigate to Companies page
    }
  }, []);

  const handleSignIn = () => {
    if (username === "OmSai" && password === "9762230555") {
      // Save login status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username); // Optional: Store username
      router.push("/Companies"); // Redirect after login
    } else {
      alert("Invalid username or password");
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
