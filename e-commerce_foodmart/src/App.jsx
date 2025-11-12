import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { getCurrentUser } from "./appwrite/appwrite";

import { ensureUserProfile } from "./appwrite/db";

import Login from "./pages/Login";

import Signup from "./pages/Signup";

import VerifyEmail from "./pages/VerifyEmail";

import Home from "./pages/Home";



const ProtectedRoute = ({ children }) =>
{
  const [user, setUser] = useState(null);   // user stores the current Appwrite user.
  
  const [checking, setChecking] = useState(true);   // checking is a flag so we can show a loading message while verifying auth.


  useEffect(() =>
  {
    getCurrentUser()      // Calls getCurrentUser() to check if a session exists.

      .then((u) => setUser(u))      // If yes → stores the user.

      .catch(() => setUser(null))     // If not → sets user to null.

      .finally(() => setChecking(false));     // finally → sets checking to false (auth check done).
      
  }, []);     // Runs once when component mounts.


  if (checking) return <p className="text-white text-center mt-10">Checking authentication...</p>;
  
  if (!user) return <Navigate to="/login" replace />;   // Navigate redirects users (for example, here, to login if unauthenticated).


  // Your current route redirects unverified users to /verify-email even if they’re Google users — that’s why you see the invalid link page after Google login.
  
    // PREVIOUS STATEMENT----------------------------------->   // if (user && !user.emailVerification) return <Navigate to="/verify-email" replace />;  // redirect unverified users
  
  
    // Generalized Version:
  
    // Now, we'll be checking for the identities of an unverified user too. If it has no identity, then it's an email password user and redirect to the email verification page.

    // If a user logged in through any provider (Google, GitHub, Discord, etc.), their email is already verified (handled by Appwrite), so they shouldn’t ever be sent to the /verify-email page.


      // 🧩 The root cause

        // Appwrite links the identity internally but does not update:

          // emailVerification, and

          // the user document returned by account.get() (missing identities array).

        // That’s why your isOAuthUser check fails.
  
      // This ends up being undefined because when my frontend called getCurrentUser(), it didn’t include the identities field because I'm using: const user = await account.get();
      
      // user.identities dosen't exist in the returned object.

      // That’s why your check fails, Appwrite thinks it’s a normal email user, and you get redirected to /verify-email, where there’s no valid userId or secret → hence “Invalid verification link”.
  
        const isOAuthUser = user?.identities && user.identities.length > 0;

  
      if (user && !isOAuthUser && !user.emailVerification)
      {  
        // console.log(isOAuthUser);

        return <Navigate to="/verify-email" replace />;
      }
  
  
    // // ?. === optional chaining. If no identites exist (i.e user === email password user), then identites === undefined. So, calling .some() on it wouldn't crash now. Else, it would have.

    //   if (user && !user.emailVerification && !user.identities?.some(i => i.provider === "google"))
      
    //     return <Navigate to="/verify-email" replace />;



  return children;    // If authenticated → render the protected content (the page wrapped in ProtectedRoute aka HomePage.jsx)
};



// const ProtectedRoute = ({ children, profile, sessionChecked }) => {
//   // 🟨 Step 1 — wait until App has finished checking session/profile
//   if (!sessionChecked) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center text-3xl font-extrabold bg-yellow-500 text-white">
//         Loading...
//       </div>
//     );
//   }

//   // 🟨 Step 2 — if no profile, redirect to login
//   if (!profile) return <Navigate to="/login" replace />;

//   // 🟨 Step 3 — handle email verification for non-OAuth users
//   const isOAuthUser = profile?.identities && profile.identities.length > 0;
//   if (!isOAuthUser && !profile.emailVerification) {
//     return <Navigate to="/verify-email" replace />;
//   }

//   // 🟩 Step 4 — otherwise render children
//   return children;
// };






function App()
{
	// 🟩 Add new global states for profile and loading
  
		// const [profile, setProfile] = useState(null);
  
		// const [sessionChecked, setSessionChecked] = useState(false);




	// 🟩 Add a global useEffect that ensures user profile after any login or OAuth redirect
  
		useEffect(() =>
		{
			const init = async () =>
			{
				try
				{
					// Wait 1s to let OAuth session settle after redirect

						await new Promise(res => setTimeout(res, 1000));

					
					const user = await getCurrentUser();
					
					
					if (user)
					{
						console.log("🌐 Session detected:", user.email);
					
						await ensureUserProfile();

						// const userProfile = await ensureUserProfile();

						// setProfile(userProfile); // <--- store profile globally
					}
					
					else
					{
						console.log("❌ No active session found.");

						// setProfile(null);
					}
				}
			
				catch (err)
				{
					console.warn("⚠️ App init failed:", err.message);

					// setProfile(null);
				}

				// finally
				// {
				// 	// 🟩 Ensure UI only renders after everything finishes

				// 		setSessionChecked(true); // <--- indicate that session check is done
				// }
			};


			init();

		}, []); // 🟩 runs only once at app load
	
	
	
	// // 🟩 Show nothing until session is confirmed
  
	// 	if (!sessionChecked)
	// 	{
	// 		return (
				
	// 			<>
				
	// 				<div className="flex h-screen w-full items-center justify-center text-3xl font-extrabold font-mono bg-yellow-500 text-white ">

	// 					Loading...

	// 				</div>
				
	// 			</>

	// 		)
	// 	} 






  return (
    <>
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

          {/* 🟩 Protected route — pass profile + sessionChecked
          
				  <Route
            
					  	path="/"
            
						element=
					  	{
							<ProtectedRoute profile={profile} sessionChecked={sessionChecked}>
                	
								<Home loggedInUser={profile} />
              
						  	</ProtectedRoute>
						}
          		/> */}
			  
			  </Routes>			  
      </Router>
    </>
  );
}



export default App