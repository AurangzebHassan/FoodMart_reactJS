import React, { useState } from "react";

import { signup } from "../appwrite";

import { useNavigate } from "react-router";



const Signup = () =>
{
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






  // return (
    
  //   <div className="auth-page">
      
  //     <form className="auth-card" onSubmit={handleSignup}>
        
  //       <h2>Create Account</h2>
        

  //       <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        
  //       <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
  //       {/* <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required /> */}

  //       {/* Password field with visibility toggle */}

  //         <div className="relative password-field">
    
  //           <input
      
  //             type={showPassword ? "text" : "password"}
      
  //             placeholder="Password"
      
  //             value={password}
      
  //             onChange={(e) => setPassword(e.target.value)}
      
  //             required
      
  //             className="w-full pr-10"
    
  //           />
    
  //           <span
      
  //             onClick={() => setShowPassword((prev) => !prev)}
      
  //             className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#7c5cff]"
      
  //             title={showPassword ? "Hide password" : "Show password"}
    
  //           >
      
  //             {showPassword ? "🙈" : "👁️"}
    
  //           </span>

  //         </div>

        

  //       {error && <p className="auth-error">{error}</p>}
        

  //       <button className="auth-btn mb-1" type="submit">Sign up</button>

        
  //       <p className="muted">
          
  //         Already have an account? <a href="/login">Login</a>
        
  //       </p>
      
  //     </form>
    
  //   </div>

  // );



  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    {/* Centered page container with light background */}

    <form
      onSubmit={handleSignup}
      className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      /* White card with shadow, rounded corners, padding, and responsive width */
    >
      <h2 className="text-2xl font-extrabold text-yellow-500 text-center mb-6">
        Signup
      </h2>
      {/* Heading with theme color, center aligned, spaced from inputs */}

      {/* Full Name Input */}
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
      />
      {/* Full width, padding, rounded, focus ring yellow */}

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
      />

      {/* Password Input with toggle */}
      <div className="relative w-full mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent pr-12"
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
        <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
      )}

      {/* Signup Button */}
      <button
        type="submit"
        className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition mb-4"
      >
        Sign up
      </button>

      {/* Google Sign-in Button */}
      {/* <button
        type="button"
        onClick={handleGoogleClick}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-100 transition mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" className="w-5 h-5">
          <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
          <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
          <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
          <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
        </svg>
        Continue with Google
      </button> */}

      {/* Login Link */}
      <p className="text-center text-gray-600 text-sm mt-4">
        Already have an account? <a href="/login" className="text-yellow-600 hover:text-yellow-800 hover:underline">Login</a>
      </p>
    </form>
  </div>
);
};



export default Signup;