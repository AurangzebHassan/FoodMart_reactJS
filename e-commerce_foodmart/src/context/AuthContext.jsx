// AuthContext.jsx

    // ---------------------------------------------------------------------------

        // This file creates a GLOBAL authentication context for your whole React app.

        // Any component (Navbar, CartDrawer, Home, etc.) can now access the logged-in

        // user's Appwrite user object INSTANTLY, without passing props.

    // ---------------------------------------------------------------------------



import { createContext, useContext, useEffect, useState, useMemo } from "react";

import { getCurrentUser } from "../appwrite/appwrite";  // Appwrite session getter

import { ensureUserProfile } from "../appwrite/db";      // Creates/syncs profile



// 1️⃣ Create the actual React context

    const AuthContext = createContext(null);


// 2️⃣ Export a simple hook so components can call useAuth()
    
    // eslint-disable-next-line react-refresh/only-export-components
    export const useAuth = () => useContext(AuthContext);



/* =============================================================================
   
    ⭐ AUTH PROVIDER COMPONENT
   
        This wraps your entire <App /> and manages global authentication state.

        - It listens to Appwrite session changes
        - It stores the logged-in user
        - It exposes { user, profile, loading } to the whole app
   
    =========================================================================== */



export const AuthProvider = ( { children } ) =>
{

    // Stores the Appwrite user (not your DB profile)

        const [user, setUser] = useState(null);

    
    // Stores the user's profile document from your Users collection
  
        const [profile, setProfile] = useState(null);


    // Loading flag so ProtectedRoute knows when to wait
  
        const [loading, setLoading] = useState(true);



    /* ---------------------------------------------------------------------------
     
        ⭐ useEffect — Runs ONCE on page load
    
            It checks if an Appwrite session exists and sets global state.
     
    --------------------------------------------------------------------------- */
  
        useEffect(() =>
        {
            const loadUser = async () =>
            {
                try
                {
                    // 1. Wait a little → required for OAuth redirects to stabilize the session
            
                        await new Promise(res => setTimeout(res, 300));

                    
                    // 2. Ask Appwrite if a user is logged in
            
                        const current = await getCurrentUser();
                    
            
                        if (current)
                        {
                            setUser(current);               // Store the Appwrite user


                            console.log("AuthContext calling ensureUserProfile()");
                
                            const ensured = await ensureUserProfile(); // Ensure profile exists
                
                            
                            setProfile(ensured);            // Store user profile from DB
                        }
                        
                        else
                        {
                            setUser(null);
                
                            setProfile(null);
                        }
                }
                
                catch (err)
                {
                    console.warn("AuthContext: Failed to load user:", err.message);
            
                    setUser(null);
            
                    setProfile(null);
                }
                
                finally
                {
                    // 3. Authentication check finished
            
                        setLoading(false);
                }
            };

            
            loadUser();
            
        }, []);



    /* ---------------------------------------------------------------------------
     
        ⭐ The value we share globally to ALL components.
     
            Anywhere in the app you can now do:

                const { user, profile, loading } = useAuth();

            and instantly get the logged-in user.


            setUser and setProfile are exposed so Login() can update the user instantly

    --------------------------------------------------------------------------- */

    const value = useMemo(() => ({ user, profile, loading, setUser, setProfile }), [user, profile, loading] );



    
    
    
  return (
    
      <AuthContext.Provider value={value}>
      
          {children}
    
      </AuthContext.Provider>
  
  );
};