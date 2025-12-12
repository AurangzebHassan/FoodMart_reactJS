// ---------------------------------------------------------------------------

	// This file wires your entire application together. It wraps everything in

	// AuthProvider so that user state becomes available globally.

// ---------------------------------------------------------------------------



import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useCart } from "./context/CartContext";

import Login from "./pages/Login";

import Signup from "./pages/Signup";

import VerifyEmail from "./pages/VerifyEmail";

import Home from "./pages/Home";

import ProductPage from "./pages/ProductPage";

import CategoryPage from "./pages/CategoryPage";

import Wishlist from "./pages/Wishlist";

import Checkout from "./pages/Checkout";

import Orders from "./pages/Orders";

import Loader from "./components/Loader";



// ⭐ WHAT WE CHANGED
	
	// ✅ Added <AuthProvider> around your whole app

		// This gives global user + profile state instantly to every component.


	// ✅ ProtectedRoute now uses useAuth()

		// No more manual user state inside ProtectedRoute.


	// ✅ App.jsx still runs your ensureUserProfile() logic

		// This guarantees user profile creation/sync stays intact.



import { AuthProvider, useAuth } from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";






// const ProtectedRoute = ({ children }) =>
// {
//   const [user, setUser] = useState(null);   // user stores the current Appwrite user.
  
//   const [checking, setChecking] = useState(true);   // checking is a flag so we can show a loading message while verifying auth.


//   useEffect(() =>
//   {
//     getCurrentUser()      // Calls getCurrentUser() to check if a session exists.

//       .then((u) => setUser(u))      // If yes → stores the user.

//       .catch(() => setUser(null))     // If not → sets user to null.

//       .finally(() => setChecking(false));     // finally → sets checking to false (auth check done).
      
//   }, []);     // Runs once when component mounts.


//   if (checking) return <p className="text-white text-center mt-10">Checking authentication...</p>;
  
//   if (!user) return <Navigate to="/login" replace />;   // Navigate redirects users (for example, here, to login if unauthenticated).


//   // Your current route redirects unverified users to /verify-email even if they’re Google users — that’s why you see the invalid link page after Google login.
  
//     // PREVIOUS STATEMENT----------------------------------->   // if (user && !user.emailVerification) return <Navigate to="/verify-email" replace />;  // redirect unverified users
  
  
//     // Generalized Version:
  
//     // Now, we'll be checking for the identities of an unverified user too. If it has no identity, then it's an email password user and redirect to the email verification page.

//     // If a user logged in through any provider (Google, GitHub, Discord, etc.), their email is already verified (handled by Appwrite), so they shouldn’t ever be sent to the /verify-email page.


//       // 🧩 The root cause

//         // Appwrite links the identity internally but does not update:

//           // emailVerification, and

//           // the user document returned by account.get() (missing identities array).

//         // That’s why your isOAuthUser check fails.
  
//       // This ends up being undefined because when my frontend called getCurrentUser(), it didn’t include the identities field because I'm using: const user = await account.get();
      
//       // user.identities dosen't exist in the returned object.

//       // That’s why your check fails, Appwrite thinks it’s a normal email user, and you get redirected to /verify-email, where there’s no valid userId or secret → hence “Invalid verification link”.
  
//         const isOAuthUser = user?.identities && user.identities.length > 0;

  
//       if (user && !isOAuthUser && !user.emailVerification)
//       {  
//         // console.log(isOAuthUser);

//         return <Navigate to="/verify-email" replace />;
//       }
  
  
//     // // ?. === optional chaining. If no identites exist (i.e user === email password user), then identites === undefined. So, calling .some() on it wouldn't crash now. Else, it would have.

//     //   if (user && !user.emailVerification && !user.identities?.some(i => i.provider === "google"))
      
//     //     return <Navigate to="/verify-email" replace />;



//   return children;    // If authenticated → render the protected content (the page wrapped in ProtectedRoute aka HomePage.jsx)
// };



/* -------------------------------------------------------------------------
	⭐ ProtectedRoute using AuthContext ⭐

		This wrapper ensures:
			
			- user must be logged in
			- email users must verify email
			- OAuth users skip verification

------------------------------------------------------------------------- */

	const ProtectedRoute = ({ children }) =>
	{
		const { user, loading } = useAuth();



		// local delay state
	
			const [delayDone, setDelayDone] = useState(false);
	
		
		// ⬅️ Wait 300–500ms so spinner shows briefly
		
			useEffect(() =>
			{
				const t = setTimeout(() => setDelayDone(true), 5000);
			
				return () => clearTimeout(t);
				
			}, []);
		
		
		
		const isLoading = loading || !delayDone;



		if (isLoading)
		
			return (

				<>
		
					<div className="hidden md:flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">

						<span className="text-4xl font-extrabold text-white text-center"> {/*Checking authentication*/} Fresh Groceries Coming Right Up </span>

						
						<Loader size="xl" color="border-white border-9" />

						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

					</div>


					
					<div className="flex md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-yellow-500 gap-2">

						<span className="text-xl font-extrabold text-white text-center"> {/*Checking authentication*/} Welcome to FoodMart </span>

						
						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

						<Loader size="small" color="border-white border-5" />

					</div>
					
				</>
				
			);

		
		if (!user) return <Navigate to="/login" replace />;


		// const isOAuthUser = user?.identities && user.identities.length > 0;

		if (!user.emailVerification)
		
			return <Navigate to="/verify-email" replace />;

		
		return children;
		
	};



	const CheckoutGuard = ({ children }) =>
	{
		const { cartItems, justPlacedOrder } = useCart();


		// Only allow access if cart has items

			if (!cartItems.length && !justPlacedOrder)
			{
				// alert('No Items in Cart! Redirecting...');

				return <Navigate to="/" replace />; // redirect to Home or Cart
			}


		return children;
	}






function App()
{  
  return (
    
	  <>
		  
		{/* ⭐ Wrap the entire Router with AuthProvider so every child can use useAuth() */}
	  
			<AuthProvider>
		
				<CartProvider>
					
				  
					<Router>
				
						<Routes>
					
						  
							<Route path="/login" element={<Login />} />

							<Route path="/signup" element={<Signup />} />
				
							<Route path="/verify-email" element={<VerifyEmail />} />

						  
							<Route path="/" element=      
							
								{
					
									<ProtectedRoute>
					
										<Home />

									</ProtectedRoute>

								}
				
							/>

						  
							<Route path="/product/:slug" element=
							
								{
									<ProtectedRoute>

										<ProductPage />
								  
									</ProtectedRoute>	
								}
						  
						  	/>

						  
							<Route path="/category/:slug" element=
							
								{
									<ProtectedRoute>

										<CategoryPage />
								  
									</ProtectedRoute>	
								}
						  
						  	/>
							
						  
							<Route path="/wishlist" element=
							
								{
									<ProtectedRoute>

										<Wishlist />
								  
									</ProtectedRoute>	
								}
						  
						  	/>
							
						  
							<Route path="/checkout" element=
							
								{
									<ProtectedRoute>

										<CheckoutGuard>
										
											<Checkout />
											
									  	</CheckoutGuard>
								  
									</ProtectedRoute>	
								}
						  
						  	/>
							
							
							
							<Route path="/orders" element=
							
								{
									<ProtectedRoute>
										
											<Orders />
								  
									</ProtectedRoute>	
								}
						  
						  	/>
						  

							{/* <Route path="/profile" element=
							
								{
									<ProtectedRoute>

										<Profile />
								  
									</ProtectedRoute>	
								}
						  
						  	/> */}

						  
						</Routes>			  

					</Router>

				  
				</CartProvider>
			
			</AuthProvider>
    
	  </>
  
  );
}



export default App