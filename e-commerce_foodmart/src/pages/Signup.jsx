import React, { useState } from "react";

import { signup } from "../appwrite/appwrite";

import { useNavigate } from "react-router";

import useBlockBack from "../hooks/useBlockBack";

import DarkModeToggle from "../components/DarkModeToggle";



const Signup = () =>
{
  useBlockBack(true);



  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleSignup = async (e) =>
  {
    e.preventDefault();
  
    setError("");

  
    try
    {
      // await signup(email, password, name, navigate);
    
      // after signup we redirected to home (session created in createAccount)
      
        // window.location.href = "/";

      

      // ✅ Call signup; verification email sent in appwrite.js

        await signup(email, password, name, navigate);
    } 
    
    catch (err)
    {
      console.error(`Failed to create account: ${err}`);
    
      setError("Failed to create account. Check input / project settings!");
    }
  };





  
  return (
    <div className="flex items-center justify-center max-md:fixed max-md:inset-0 min-h-screen bg-gray-50 dark:bg-gray-600">
      {/* Centered page container with light background */}

      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-gray-600 shadow-xl rounded-xl p-4.5 sm:p-8 w-[43.5vh] sm:w-full sm:max-w-md"
        /* White card with shadow, rounded corners, padding, and responsive width */
      >
        <div className="flex justify-end">
          <h2 className="w-[80%] text-2xl font-extrabold /*text-[#7c5cff]*/ text-yellow-500 dark:text-yellow-300 text-center mb-4 sm:mb-6">
            Signup
          </h2>

          <div className="mt-0.75">
            {" "}
            <DarkModeToggle />{" "}
          </div>
        </div>

        {/* Full Name Input */}
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="max-sm:text-[12px] w-full px-2.25 py-1.25 sm:px-4 sm:py-3 mb-4 font-mono dark:text-white dark:placeholder:text-white dark:bg-gray-500 border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-2 /*focus:ring-[#7c5cff]*/ focus:ring-yellow-600 dark:focus:ring-yellow-300 focus:border-transparent"
        />
        {/* Full width, padding, rounded, focus ring yellow */}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="max-sm:text-[12px] w-full px-2.25 py-1.25 sm:px-4 sm:py-3 mb-4 font-mono dark:text-white dark:placeholder:text-white dark:bg-gray-500 border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-2 /*focus:ring-[#7c5cff]*/ focus:ring-yellow-600 dark:focus:ring-yellow-300 focus:border-transparent"
        />

        {/* Password Input with toggle */}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="max-sm:text-[12px] w-full px-2.25 py-1.25 sm:px-4 sm:py-3 border font-mono dark:text-white dark:placeholder:text-white dark:bg-gray-500 border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:ring-2 /*focus:ring-[#7c5cff]*/ focus:ring-yellow-600 dark:focus:ring-yellow-300 focus:border-transparent pr-12"
            /* pr-12 leaves space for the eye icon */
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-yellow-500"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500  text-sm mb-3 text-center">{error}</p>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full /*bg-[#7c5cff]*/ dark:active:bg-yellow-400 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400 bg-yellow-500 dark:bg-yellow-300 text-white dark:text-gray-600 py-1.5 max-sm:text-sm sm:py-3 rounded-lg font-bold /*hover:bg-[#5a3ecc]/* hover:bg-yellow-600 focus focus:bg-yellow-600 transition mb-3 sm:mb-4 cursor-pointer"
        >
          Sign up
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-[12px] sm:text-sm sm:mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="focus:border-none focus:outline-none text-yellow-600 dark:text-yellow-500 dark:hover:text-yellow-600 dark:focus:text-yellow-600  hover:text-yellow-800 focus:text-yellow-800 focus:underline hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
};



export default Signup;