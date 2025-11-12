import { account, database, DATABASE_ID, PRODUCTS_TABLE_ID, CATEGORIES_TABLE_ID, USERS_TABLE_ID, Query } from "./appwrite.js";

import { Permission, Role } from "appwrite"



//--------------PRODUCTS + CATEGORY COLLECTION-------------------------------------------------


    /* ------------------- 🟩 1. Get all categories ------------------- */

        export async function getAllCategories()
        {
            try
            {
                const res = await database.listDocuments(DATABASE_ID, CATEGORIES_TABLE_ID);
            
                return res.documents;
            }
            
            catch (err)
            {
                console.error("Error fetching categories:", err);
            
                return [];
            }
        }



    /* ------------------- 🟩 2. Get all products ------------------- */

        export async function getAllProducts()
        {
            try
            {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID,
                    
                    [
                        Query.orderDesc("$createdAt"),
                    ]
                );
            
                return res.documents;
            }
            
            catch (err)
            {
                console.error("Error fetching products:", err);
            
                return [];
            }
        }



    /* ------------------- 🟩 3. Get products by category ------------------- */

        export async function getProductsByCategory(categoryId)
        {
            try
            {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID,
                    
                    [
                        Query.equal("category_id", categoryId),
                    ]
                );
            
                return res.documents;
            } 
        
            catch (err)
            {
                console.error("Error fetching category products:", err);
            
                return [];
            }
        }



    /* ------------------- 🟩 4. Get trending products ------------------- */

        export async function getTrendingProducts()
        {
            try
            {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID,
                    
                    [
                        Query.equal("isTrending", true),

                        Query.orderDesc("rating")
                    ]
                );
            
                return res.documents;
            } 
        
            catch (err)
            {
                console.error("Error fetching trending products:", err);
            
                return [];
            }
        }



    /* ------------------- 🟩 5. Get new arrivals ------------------- */

        export async function getNewProducts()
        {
            try
            {
                const all = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID,
                    
                    [
                        // not relying on isNew. We're dynamically calculating the newness.
                        
                            Query.orderDesc("$createdAt"),
                            
                            Query.limit(7)
                    ]
                );


                // Filter client-side: last 7 days
            
                    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);


                return all.documents.filter(prod => new Date(prod.$createdAt) >= sevenDaysAgo);            
            }
            
            catch (err)
            {
                console.error("Error fetching new products:", err);
                
                return [];
            }
        }










//-------------------------- USERS COLLECTION------------------------------------------------------------------


    /* ------------------- 🟩 6. Get user profile ------------------- */

        export async function getUserProfile(userId)
        {
            console.log("getUserprofile() called");

            try
            {
                const res = await database.listDocuments(
                    
                    DATABASE_ID,
                    
                    USERS_TABLE_ID,
                    
                    [Query.equal("user_id", userId)]
                );


                console.log(res.documents);


                // if no profile found, return null instead of breaking
                
                    return res.documents.length > 0 ? res.documents[0] : null;
            }
            
            catch (err)
            {
                console.error("Error fetching user profile:", err);
                
                return null;
            }
        }



    /* ------------------- 🟩 7. Create user profile (if missing) ------------------- */
    
        // ------------------------ START: Helper to get stored profile pic ------------------------

            export function getStoredProfilePic(email)
            {
                const username = email.split("@")[0];

                const possibleExtensions = [".jpeg", ".jpg", ".png", ".svg"];

                
                for (let ext of possibleExtensions)
                {
                    const path = `/images/user_profile_pics/${username}_pfp${ext}`;

                    // console.log("pfp path: ", path);
                

                    // Check if image exists (this is async in the browser)
                
                    // We'll optimistically return the first path; if the file doesn't exist, browser shows broken image
                
                        return path;
                }


                // Fallback default
                    
                    return "/icons/user.svg";
            }

        // ------------------------ FINISH: Helper to get stored profile pic ------------------------


        export async function createUserProfile(user)
        {
            console.log("createUserprofile() called");

            try
            {
                // create the user profile document with secure permissions
            
                    const res = await database.createDocument(
                
                        DATABASE_ID,
                
                        USERS_TABLE_ID,
                
                        "unique()",
                
                        {
                            user_id: user.$id,
                
                            name: user.name || user.email.split("@")[0],
                
                            email: user.email,
                
                            profile_pic: getStoredProfilePic(user.email) || "/icons/user.svg",

                            bio: null,
                
                            role: "user"

                            // joined_at: new Date().toISOString(),
                        },
                        
                        [
                            // Appwrite doesn’t accept a plain user ID string here.

                            // It expects a permission action, e.g.Permission.read(Role.user(user.$id)), Permission.update(...), etc.
                            
                                // `user:${user.$id}` // private permissions to the logged-in user
                                
                            
                            Permission.read(Role.user(user.$id)),
                            
                            Permission.update(Role.user(user.$id)),
        
                            Permission.delete(Role.user(user.$id))
                        ]
                    );

                console.log(res);
                

                return res;
            }
            
            catch (err)
            {
                if (err.code === 409)
                {
                    console.warn("User profile already exists (unique constraint).");
                
                    return null;
                }

                console.error("Error creating user profile:", err);
        
                return null;
            }
        }



    /* ------------------- 🟩 8. Use above 2 helpers to ensure user profile/doc is created ------------------- */

        
    // 1️⃣ Where hasEnsuredProfile lives In your db.js:

        // let hasEnsuredProfile = false; // local guard
        // export async function ensureUserProfile() {
        //     if (hasEnsuredProfile) return;
        //     hasEnsuredProfile = true;
        //     ...
        // }


        // hasEnsuredProfile is declared at the module level in db.js.

        // That means it exists once per module, not per function call.

        // Any call to ensureUserProfile() that imports this module will share the same variable.


    // 2️⃣ How imports work

        //     In App.jsx or Login.jsx you do something like:

        //     import { ensureUserProfile } from "./db.js";


        //     JavaScript ES modules are singletons.

        //     No matter how many files import db.js, the module is executed once.

        //     That means hasEnsuredProfile is shared across all imports.

        //     So:

        //     ensureUserProfile(); // first call
        //     ensureUserProfile(); // second call


        //     First call → hasEnsuredProfile is false, function runs, sets it to true.

        //     Second call → hasEnsuredProfile is now true, function returns immediately, preventing duplicate execution.


    // 3️⃣ Why it works across App.jsx and Login.jsx

        //     Even if you call ensureUserProfile() in two different components, they both import the same db.js module, so they see the same hasEnsuredProfile:

        //     App.jsx               Login.jsx
        //         │                     │
        //         ├─ import ensureUserProfile ─┐
        //         │                             │
        //         └─ calls ensureUserProfile() ─┘


        //     First component that runs sets hasEnsuredProfile = true.

        //     Any subsequent call from another component sees it and skips execution.


    // 4️⃣ Key points

        //     Module-level variable = shared across imports → singleton behavior.

        //     Prevents duplicate profile creation within the same tab/session.

        //     Does not prevent duplication across different browser tabs (for that you rely on the Appwrite unique constraint).


    // 💡 Analogy:
        
        //    Think of hasEnsuredProfile as a “flag on the door” in your db.js module.Once one function sets it to true, everyone else who tries to go through that door sees it’s already closed.


            let hasEnsuredProfile = false; // local guard


        export async function ensureUserProfile() 
        {
            if (hasEnsuredProfile) return;

            hasEnsuredProfile = true;



            console.log("ensureUserprofile() called");



            // const user = await account.get();

                let user = null;

                for (let i = 0; i < 3; i++)
                {
                    // retry up to 3 times
                    
                        try
                        {
                            user = await account.get();
                        
                        
                            if (user) break;
                        }
                    
                        catch
                        {
                            console.warn("Appwrite session not ready yet, retrying...");
                            
                            await new Promise((res) => setTimeout(res, 500)); // wait 0.5 sec
                        }
                }


                if (!user)
                {
                    console.error("No Appwrite session detected after retries.");
                
                    return null;
                }



            let profile = await getUserProfile(user.$id);

            console.log("Existing profile:", profile);

            
            if (!profile)
            {
                try
                {
                    // Optional small delay to avoid race with another tab/component
        
                    await new Promise((res) => setTimeout(res, 200));
            
                    
                    // Double-check if profile exists (another call might have created it)
        
                    const doubleCheck = await getUserProfile(user.$id);

                    
                    if (!doubleCheck)
                    {
                        // Attempt creation (unique constraint on `user_id` prevents duplicates)

                            await createUserProfile(user);
        
                        
                        profile = await getUserProfile(user.$id);

                        console.log("Profile created successfully", profile);
                    }

                    else
                    {
                        profile = doubleCheck;
            
                        console.log("Profile already created by another call:", profile);
                    }
                }
                
                catch (err)
                {
                    if (err.code === 409)
                    {
                        console.warn("User profile already exists (unique constraint).");
            
                        profile = await getUserProfile(user.$id); // fetch the existing one
                    }
                    
                    else
                    {
                        console.error("Failed to create user profile:", err);
                    }
                }
            }

            else
            {
                // ------------------------ START: Sync existing profile if changed ------------------------

                    // google users could change their name (username), email or their profile pics 
        
                        const updates = {};
            
            
                    
                        if (profile.name !== user.name && user.name) updates.name = user.name;
            
                
                
                        // if (profile.profile_pic !== user.prefs?.picture && user.prefs?.picture) updates.profile_pic = user.prefs.picture;
                        
                        const storedPic = getStoredProfilePic(user.email);
                        
                        console.log("stored pic path", storedPic);

                        if (profile.profile_pic !== storedPic) updates.profile_pic = storedPic;
        
                
            
                        if (profile.email !== user.email) updates.email = user.email;

                    
                    
                        if (Object.keys(updates).length > 0)
                        {
                            await database.updateDocument(DATABASE_ID, USERS_TABLE_ID, profile.$id, updates);
                    
                            console.log("Profile synced with OAuth Provider:", updates);
                    
                            profile = await getUserProfile(user.$id); // fetch updated profile
                        }
            
                // ------------------------ FINISH: Sync existing profile if changed ------------------------
            }


            return profile;
        }