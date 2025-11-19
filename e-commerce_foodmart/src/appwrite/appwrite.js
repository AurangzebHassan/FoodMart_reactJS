// ## 🧭 OVERVIEW

// You’ll have **one Appwrite project**, with **multiple databases/collections**.
// Appwrite doesn’t have “SQL tables” — instead, it has **Collections** (like MongoDB documents).

// We’ll create the following **collections** inside one database called `ecommerce_db`:

// | Collection               | Purpose                                        |
// | ------------------------ | ---------------------------------------------- |
// | `users`                  | Stores user profiles (linked to Appwrite Auth) |
// | `products`               | All product info                               |
// | `categories`             | Product grouping                               |
// | `orders`                 | Customer orders after checkout                 |
// | `cart`                   | User shopping cart (temporary before order)    |
// | `reviews` *(optional)*   | Product ratings and reviews                    |
// | `analytics` *(optional)* | Tracks views, trending, etc.                   |

// ---

// ## 🧱 DATABASE STRUCTURE DETAILS

// ### 1️⃣ **Database: `ecommerce_db`**

// All your collections go inside here.

// ---

// ### 2️⃣ **Collection: `users`**

// Appwrite already handles **authentication** (email/password, OAuth, etc.)
// So you don’t need to store passwords — just extra profile info.

// | Field        | Type     | Example                                     | Notes                      |
// | ------------ | -------- | ------------------------------------------- | -------------------------- |
// | `user_id`    | string   | same as `account.$id`                       | Link to Appwrite Auth user |
// | `name`       | string   | "Bruce Wayne"                               | Display name               |
// | `email`      | string   | "[bruce@wayne.com](mailto:bruce@wayne.com)" | For quick lookups          |
// | `address`    | string   | "1007 Mountain Dr, Gotham"                  | Default shipping address   |
// | `phone`      | string   | "+92 300 0000000"                           | Optional                   |
// | `created_at` | datetime | auto                                        |                            |

// 📍 *This collection is optional if you just use Appwrite Auth — but recommended for extra profile data.*

// ---

// ### 3️⃣ **Collection: `categories`**

// Used for “Shop by Department”, “Men/Women/Kids”, etc.

// | Field         | Type   | Example                            |
// | ------------- | ------ | ---------------------------------- |
// | `name`        | string | "Groceries"                        |
// | `slug`        | string | "groceries"                        |
// | `description` | string | "Everyday grocery items"           |
// | `image_url`   | string | "/images/categories/groceries.png" |

// 🔗 Will be referenced by `products`.

// ---

// ### 4️⃣ **Collection: `products`**

// Main collection — holds all product data.

// | Field         | Type     | Example                                       | Notes                  |
// | ------------- | -------- | --------------------------------------------- | ---------------------- |
// | `name`        | string   | "Heinz Tomato Ketchup"                        |                        |
// | `slug`        | string   | "heinz-tomato-ketchup"                        | for clean URLs         |
// | `category_id` | string   | linked to `categories.$id`                    |                        |
// | `price`       | float    | 18.00                                         |                        |
// | `stock`       | integer  | 100                                           | quantity available     |
// | `image`       | string   | "/images/products/heinz.png"                  |                        |
// | `description` | text     | "Delicious ketchup made from fresh tomatoes." |                        |
// | `is_new`      | boolean  | true                                          | mark new arrivals      |
// | `is_trending` | boolean  | true                                          | for homepage carousel  |
// | `created_at`  | datetime | auto                                          | for sorting by newness |

// 🧠 Example Document:

// ```json
// {
//   "name": "Heinz Tomato Ketchup",
//   "slug": "heinz-tomato-ketchup",
//   "category_id": "cat_groceries_123",
//   "price": 18,
//   "stock": 120,
//   "image": "/images/products/heinz_tomato_ketchup.png",
//   "description": "Classic Heinz ketchup made from fresh tomatoes.",
//   "is_new": true,
//   "is_trending": true
// }
// ```

// ---

// ### 5️⃣ **Collection: `cart`**

// Stores what each user has in their cart before checkout.

// | Field        | Type     | Example                   | Notes |
// | ------------ | -------- | ------------------------- | ----- |
// | `user_id`    | string   | same as Appwrite user     |       |
// | `product_id` | string   | reference to products.$id |       |
// | `quantity`   | integer  | 2                         |       |
// | `added_at`   | datetime | auto                      |       |

// 🧠 Example Documents:

// | user_id | product_id | quantity |
// | ------- | ---------- | -------- |
// | usr_001 | prod_101   | 2        |
// | usr_001 | prod_203   | 1        |

// You can fetch all cart items for a user with:

// ```js
// databases.listDocuments("ecommerce_db", "cart", [
//   Query.equal("user_id", user.$id)
// ]);
// ```

// ---

// ### 6️⃣ **Collection: `orders`**

// When a user checks out, items from the cart are moved here.

// | Field        | Type     | Example                                             | Notes                               |
// | ------------ | -------- | --------------------------------------------------- | ----------------------------------- |
// | `user_id`    | string   | usr_001                                             | who placed the order                |
// | `items`      | array    | `[ { product_id: "prod_101", qty: 2, price: 18 } ]` |                                     |
// | `total`      | float    | 54.00                                               | sum of all items                    |
// | `status`     | string   | "processing"                                        | ["pending", "shipped", "delivered"] |
// | `address`    | string   | delivery address                                    |                                     |
// | `created_at` | datetime | auto                                                |                                     |

// 🧠 Example Document:

// ```json
// {
//   "user_id": "usr_001",
//   "items": [
//     { "product_id": "prod_101", "qty": 2, "price": 18 },
//     { "product_id": "prod_203", "qty": 1, "price": 12 }
//   ],
//   "total": 48,
//   "status": "processing",
//   "address": "1007 Mountain Dr, Gotham"
// }
// ```

// ---

// ### 7️⃣ **Collection: `reviews` (optional)**

// | Field        | Type     | Example     |
// | ------------ | -------- | ----------- |
// | `user_id`    | string   | usr_001     |
// | `product_id` | string   | prod_101    |
// | `rating`     | integer  | 5           |
// | `comment`    | string   | "Loved it!" |
// | `created_at` | datetime | auto        |

// ---

// ## ⚙️ APPWRITE BACKEND LOGIC

// ### 🔐 Authentication

// Handled by `Appwrite Auth`:

// * Email/password login & register
// * Get user session: `account.get()`
// * Store user ID in `users` collection when registering (optional).

// ---

// ### 🛒 Cart Handling

// 1️⃣ When user clicks **Add to Cart**:

// ```js
// await databases.createDocument('ecommerce_db', 'cart', ID.unique(), {
//   user_id: user.$id,
//   product_id: product.$id,
//   quantity: 1
// });
// ```

// 2️⃣ When **Cart Page** loads:

// ```js
// const cartItems = await databases.listDocuments('ecommerce_db', 'cart', [
//   Query.equal("user_id", user.$id)
// ]);
// ```

// 3️⃣ When **Quantity changes**:

// ```js
// await databases.updateDocument('ecommerce_db', 'cart', cartItem.$id, {
//   quantity: newQty
// });
// ```

// 4️⃣ When **Checkout**:

// * Fetch cart items
// * Compute total
// * Create new document in `orders`
// * Delete cart items after order placed.

// ---

// ### 🧾 Checkout → Order Flow

// ✅ Steps on frontend:

// 1. User confirms order
// 2. App calls Appwrite function (or client-side DB call) to:

//    * Fetch all `cart` items for that user
//    * Create an `order` document with the items and total
//    * Clear that user’s cart

// ✅ Pseudocode:

// ```js
// const cartItems = await databases.listDocuments("ecommerce_db", "cart", [
//   Query.equal("user_id", user.$id)
// ]);

// const orderItems = cartItems.documents.map(i => ({
//   product_id: i.product_id,
//   qty: i.quantity,
//   price: i.price
// }));

// await databases.createDocument("ecommerce_db", "orders", ID.unique(), {
//   user_id: user.$id,
//   items: orderItems,
//   total: calculateTotal(orderItems),
//   status: "processing",
//   address: user.address
// });

// for (const item of cartItems.documents) {
//   await databases.deleteDocument("ecommerce_db", "cart", item.$id);
// }
// ```

// ---

// ### 🔥 Trending / New Products

// When listing products on your homepage:

// ```js
// const trending = await databases.listDocuments("ecommerce_db", "products", [
//   Query.equal("is_trending", true)
// ]);

// const newProducts = await databases.listDocuments("ecommerce_db", "products", [
//   Query.equal("is_new", true)
// ]);
// ```

// ---

// ## 🧠 Folder Structure (React + Appwrite)

// ```
// src/
//  ├─ appwrite/
//  │   ├─ client.js          ← Appwrite client setup
//  │   ├─ auth.js            ← login/register helpers
//  │   └─ db.js              ← functions for fetching products/cart/orders
//  ├─ components/
//  │   ├─ Navbar.jsx
//  │   ├─ CartDrawer.jsx
//  │   ├─ ProductCard.jsx
//  │   └─ HeroSection.jsx
//  ├─ pages/
//  │   ├─ Home.jsx
//  │   ├─ ProductPage.jsx
//  │   ├─ Cart.jsx
//  │   ├─ Checkout.jsx
//  │   └─ Orders.jsx
//  └─ lib/
//      └─ utils.js
// ```

// ---

// ## 🚀 Example `appwrite/client.js`

// ```js
// import { Client, Databases, Account, ID, Query } from "appwrite";

// const client = new Client()
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject("your_project_id");

// export const account = new Account(client);
// export const databases = new Databases(client);
// export { ID, Query };
// ```

// ---

// ## ✅ Summary

// | Feature            | Collection       | Notes                           |
// | ------------------ | ---------------- | ------------------------------- |
// | Auth               | built-in + users | store extra user info           |
// | Categories         | categories       | used to filter products         |
// | Products           | products         | include `is_trending`, `is_new` |
// | Cart               | cart             | linked to user_id               |
// | Orders             | orders           | on checkout                     |
// | Trending/New       | products flags   | for homepage                    |
// | Reviews (optional) | reviews          | attach to products              |










import { Client, Databases, ID, Query, Account } from 'appwrite';



// ENVIRONMENT VARIABLES SETUP:  --------------------------------------------------------------------------------------------

    export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

    export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;  // foodmart database

    export const CATEGORIES_TABLE_ID = import.meta.env.VITE_APPWRITE_CATEGORIES_TABLE_ID;    // categories table
    
    export const PRODUCTS_TABLE_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_TABLE_ID;    // products table

    export const USERS_TABLE_ID = import.meta.env.VITE_APPWRITE_USERS_TABLE_ID;    // users table
    
    export const CART_TABLE_ID = import.meta.env.VITE_APPWRITE_CART_TABLE_ID;    // cart table



// CLIENT SETUP:  --------------------------------------------------------------------------------------------------------------

    // Access appwrite's functionality and services by defining a new appwrite client instance here.

    // Client: the Appwrite client instance — used to connect your app to Appwrite’s backend.

        const client = new Client()

        .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your Appwrite Endpoint. Tells where your backend lives (Appwrite Cloud in this case).

        .setProject(PROJECT_ID);     // Your project ID. Identifies which appwrite project to interact with.



// SERVICE INSTANCES (these lines create service objects):  ------------------------------------------------------------------------

    // Define which functionality you want to use in appwrite. In our case, we want to use the database service.

    // Databases: allows interacting with Appwrite database tables/collections (create, read, update, delete documents).
    
    // database: handles CRUD operations for your collections.

        export const database = new Databases(client);
        

    // And the account service for authentication. Creates users in the appwrite backend.

    // Account: handles all authentication actions (signup, login, logout, session management).

        export const account = new Account(client);
        

    // also export ID and Query helpers from appwrite SDK

        export { ID, Query };
    





//  AUTHENTICATION SECTION: -----------------------------------------------------------------------------------------------

    // Function to create a new user account.

        export const signup = async (email, password, name, navigate) => 
        {
           try 
           {
               if (password.length < 8)
               {
                   alert("⚠️ Password must be atleast 8 characters!");

                   throw new Error('Invalid password');
               }
               
               // If successful, it creates a user account — but not yet a session (you’re not logged in yet).
               
               // Create user, no session yet.
                     
                    const newUser = await account.create(
                            
                        "unique()",     // "unique()" → Appwrite auto-generates a unique user ID.
                            
                        email,
                        
                        password,
                        
                        name
                
                    );
                    
                    
                // Prevents 401/429 during the next login.
         
                    await new Promise(res => setTimeout(res, 1200));
               
               
               
                // Log in temporarily to send verification
                    
                    try
                    {
                        await account.createEmailPasswordSession({ email, password });
                    }
                    
                    catch (err)
                    {
                        console.warn("Session creation failed:", err);
            
                        
                        if (err.code === 429)
                        {
                            alert("⚠️ Too many session attempts. Please wait a few seconds and retry.");
                
                            return;
                        }
                    }
               
                
                // 🕐 Another short wait to prevent 401/429 from Appwrite rate limiter
    
                    await new Promise(res => setTimeout(res, 1000));

                    
                // ✅ Send verification email right after signup
                    
                    await account.createVerification(`${window.location.origin}/verify-email`);
               

               // 4️⃣ Wait briefly before logging out (Appwrite rate-limit protection). Ensures Appwrite’s internal rate counter resets before deleting the session.
               
                // 🕐 Wait briefly before logout to ensure email is sent
    
                   await new Promise(res => setTimeout(res, 1200));

               
                // 🔴 Optional: immediately log them out (so they can’t use unverified session)
                    
                // 4️⃣ Log out unverified session safely
    
                    try
                    {
                        await account.deleteSession("current");
                    }           
            
                    catch (logoutErr)
                    {
                        console.warn("Logout after signup failed (safe to ignore):", logoutErr);
                    }
                    
               
                alert("A verification link has been sent to your email.\n\n Please check your inbox and verify to continue.");
     
                // navigate("/login");
               
               
               
                // send the user to /login with state
               
                // Why it uses state

                    // The state is crucial because:

                        // It tells Login.jsx that this user just signed up.

                        // Allows Login.jsx to:

                            // Autofill the email field.

                            // Show “Please verify your email” message immediately.

                            // Disable OAuth buttons.

                            // Start polling Appwrite to detect when the email gets verified (auto-refreshes).

                // ✅ So keep the state. It makes the UX seamless after signup — they don’t need to retype their email or wonder what to do next.
                
                    navigate("/login", { state: { justSignedUp: true, email } });
                
               
                return newUser; 
           }
           
           catch (error)
           { 
               console.error(`Signup error: ${error}`);


               // Duplicate email handling

                    if (error.code === 409 || error.message.includes("already exists"))
                    {
                            alert("⚠️ An account with this email already exists.\n\n Please log in instead.");


                            navigate("/login");


                            return null;
                    }
               
               
               
                // OAuth-linked email case
               
                    if (error.code === 400 && error.message.includes("request"))
                    {
                        alert("⚠️ This email is already linked to a Google account.\n\n\n Please log in using 'Continue with Google' \n\nOR \n\nUse a different email.");
            
                        navigate("/login");
            
                        return null;
                    }


               
                // Rate limit handling
        
                    if (error.code === 429)
                    {
                        alert("⚠️ Too many signup attempts. Please wait ⏳ 30–60 seconds and try again.");
                    }


               
                // Session not found handling

                    if (error.code === 404)
                    {
                        console.warn("Session not found. Clearing cookies and retrying...");

                        try
                        {
                            await account.deleteSessions(); // clear all stale sessions
                        }

                        catch (error) { console.error(`Couldn't delete sessions: ${error}`); }
                    }
           }
        };



    // GOOGLE OAUTH2 LOGIN
    
        // 🧩 1. “An identity was made” — what that actually means

            // When you use Google OAuth in Appwrite, it doesn’t always create a new user.
            // Here’s what happens under the hood:

                // Case A: A user already exists with the same email

                    // Appwrite links your Google account to the existing Appwrite user.

                    // It creates an Identity object under that user in Appwrite → this is what you saw inside Users → <Your User> → Identities.

                    // The Identity has:

                        // Its own $id (different from user ID — think of it as a “connection token”).

                        // A provider (like google).

                        // An expire timestamp (usually ~1 hour).

                        // Refresh tokens or access tokens handled by Appwrite internally.

                    // That identity allows Appwrite to authenticate you using your Google session without needing your password.

                // ✅ Result: You log in via Google → Appwrite finds an existing user with the same email → links them → uses that user’s same userId (so same metrics table entries, same data, etc).



                // Case B: No user exists with that email

                    // Appwrite will create a new user automatically using your Google profile’s email + name.

                    // That new user will have:

                        // emailVerification = true (since Google already verified it).

                        // A new, unique $id.

                        // Its own identities entry showing Google as the provider.

                // ✅ Result: You get a brand-new Appwrite user. All your metrics, saved searches, etc., will be independent of your email/password account.



        // 🔐 2. Why does the “Identity” expire in an hour?

            // That expiration refers to the OAuth access token lifespan, not your Appwrite session.

            // Google grants Appwrite a short-lived token (1h) to perform actions like verifying your identity or refreshing a session.
            // But Appwrite separately issues its own session for you, which remains valid according to your Appwrite session TTL (usually 7 days or more).

            // So: The “identity expiration” doesn’t log you out — it just means Appwrite’s link to Google’s OAuth token will refresh silently next time you sign in.



        // 🧠 3. Why did the trending movies stay the same?

            // Because you logged in with the same Appwrite user ID (same underlying user).
            // Appwrite reuses the same account when the email matches → same metrics, same permissions, same everything.

            // If you logged in with a different Google account (different email), you’d see:

            // A different user $id

            // No metrics yet

            // A clean start
        
                // ✅ SAFE GOOGLE LOGIN HANDLER — no more invalid verification link issues
                    
                    export const loginWithGoogle = async () => 
                    {
                        try 
                        {
                            // 1️⃣ Clean up any stale or partial sessions first
                            
                                // try
                                // {
                                //     await account.deleteSessions();
                                    
                                //     console.log("✅ Cleared old sessions before OAuth login");
                                // } 
                                
                                // catch (err)
                                // {
                                //     console.warn("⚠️ No existing session to delete (safe to ignore):", err);
                                // }

                            
                            // 2️⃣ Wait a short delay to avoid Appwrite's rate limit (prevents 429)
                            
                                await new Promise(res => setTimeout(res, 1000));


                            // 3️⃣ Start Google OAuth login flow
                        
                                // successURL → home page
                            
                                // failureURL → login page (in case user cancels)
                            
                                const successURL = `${window.location.origin}/`;
                            
                                const failureURL = `${window.location.origin}/verify-email?reason=oauth_unverified`;

                            
                                console.log("🌐 Redirecting to Google OAuth...");
                            
                            
                                await account.createOAuth2Session("google", successURL, failureURL);
                        } 
                        
                        catch (error)
                        {
                            console.error("❌ Google OAuth login failed:", error);

                            
                            // Handle common causes
                                
                                if (error.code === 429)
                                {
                                    alert("⚠️ Too many login attempts. Please wait 30–60 seconds and try again.");
                                } 
                                
                                else if (error.code === 401)
                                {
                                    alert("⚠️ Session expired. Please try logging in again.");
                                }
                                
                                else
                                {
                                    alert("⚠️ Google sign-in failed. Please try again.");
                                }
                        }
                    };



    // Function to send verification email to already present unverified users
    
        // Function to resend verification email to already registered (unverified) users
            
            export const sendVerificationEmail = async (email, password) =>
            {
                try
                {
                    await account.deleteSession("current").catch(() => { });
    

                    await new Promise((res) => setTimeout(res, 1000));
    

                    await account.createEmailPasswordSession({ email, password });
    
                    await account.createVerification(`${window.location.origin}/verify-email`);
    

                    alert("📧 Verification email sent! Check your inbox.");
    

                    await account.deleteSession("current");
                }
                
                catch (err)
                {
                    console.error("Error sending verification email:", err);
    
                    alert("⚠️ Could not send verification email. Please try again.");
                }
            };



    // Function to create a session for existing user.
    
        // If credentials are correct → user is logged in and receives a session token.
    
            export const login = async (email, password) => 
            {
                try
                {
                    // Always clear any existing session before logging in.
                       
                        // try
                        // {
                        //     await account.deleteSession("current");
                        // }
                    
                        // catch (error)
                        // {
                        //     console.warn("No existing session to delete (safe to ignore): ", error);
                        // }

                    
                    // Wait briefly to avoid rate limit collision
                    
                        await new Promise(res => setTimeout(res, 1000));
                    
                    
                    const session = await account.createEmailPasswordSession(
                    {
                        email,
                    
                        password,
                    });

                    // const user = await account.get();



                    // After session creation, retry account.get() until it returns user (Appwrite may be eventual)
    
                    let user = null;
    

                    for (let i = 0; i < 6; i++)
                    {
                        try
                        {
                            user = await account.get();
        
        
                            if (user) break;
                        }
                        
                        catch (err)
                        {
                            console.warn(`login(): account.get() attempt ${i + 1} failed:`, err);
        
                            // If it fails with 401 and subsequent attempts also fail, continue retries
                        }
      
                        await new Promise(r => setTimeout(r, 400 + i * 200));
                    }

    
                    if (!user)
                    {
                        // No user after retries — do NOT delete current; instead surface a clear error
      
                          console.error("login(): account.get() returned null after retries.");
      
                        const e = new Error("NO_SESSION_AFTER_LOGIN");
      
                        e.code = "NO_SESSION_AFTER_LOGIN";
      
                        throw e;
                    }



                    // // 🟢 Check if user’s email is verified

                    //     if (!user.emailVerification)
                    //     {
                    //         await account.deleteSession("current"); // we wont be deleting the session yet as then we cant get the session which is why we arent getting the resend button.
                        
                    //         // alert("⚠️ Please verify your email before logging in.");

                    //         throw new Error("EMAIL_NOT_VERIFIED");
                    //     }
                    


                    // CHANGED: Keep temporary session so frontend can call resend/polling

                        if (!user.emailVerification)
                        {
                            // Do NOT delete the session here. Keep the session alive so the frontend can:
                        
                                //  - call account.createVerification() (via sendVerificationEmail)
                        
                                //  - call account.get() to poll for verification changes
                        
                            
                            // Frontend is responsible for cleanup (sendVerificationEmail deletes temporary session).
                        
                                alert("⚠️ Please verify your email before logging in.");
                        
                                throw new Error("EMAIL_NOT_VERIFIED");
                        }


                  return session;
                }
                
                catch (error)
                {
                    console.error("Login error:", error); 
                    

                    // Rate limit handling
    
                        if (error.code === 429)
                        {
                            alert("⚠️ Too many login attempts. Please wait ⏳ 30–60 seconds and try again.");
                        }


                    // Session not found handling
    
                        if (error.code === 404)
                        {
                            console.warn("Session not found. Clearing cookies and retrying...");
        
                            try
                            {
                                await account.deleteSessions(); // clear all stale sessions
                            }
        
                            catch (error) { console.error(`Couldn't delete sessions: ${error}`); }
                        }
                    
                    throw error;
                }
            };



    // Function to get the currently logged in user by retrieving the account details.
    
        // Used throughout your app to check authentication state.

            export const getCurrentUser = async () =>
            {
                try
                {
                    // Fetches the currently logged-in user from Appwrite (using their session).

                        return await account.get();
                }
                
                catch (err)
                {
                    console.error(`Error getting current user: ${err}`);

                    return null;    // Returns null if not logged in (session expired, etc.).

                }
            };


            
    // Function to log out the current user by deleting/ending the current session.
    
        // After calling this, getCurrentUser() will return null.
    
            export const logout = async () =>
            {
                // delete current session. Log them out.

                try
                {
                    await account.deleteSession("current");   // "current" means the session tied to this browser/device.
                }
                
                catch (err)
                {
                    console.error(`Error logging out: ${err}`);
                }
            };






// METRICS (per-user movie searches) -----------------------------------------------------------------------------------------------

    // Function to update the search count in the database. Helps maintain the trending searches feature.

        // updateSearchCount: associates metrics to logged-in user via userId field

        // Updates your Appwrite “metrics” collection whenever a user searches a movie.

        // Either increments existing count or creates a new record.

            // export const updateSearchCount = async (searchTerm, movie) =>
            // {
            //     try
            //     {
            //         const user = await getCurrentUser();    // Get current user info — we need their userId to track searches.
                    
            //         if (!user) throw new Error("User not logged in");   // /If there’s no logged-in user, throw an error (since metrics are per-user).


            //         const userId = user.$id;



            //         // 1. Use appwrite SDK/API to check if a record with the given movie_id for the current user (which exists as we're already here or else we would have skipped) already exists in the database.


            //             // PREVIOUS STATEMENT: --------------------------> // const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [Query.equal("searchTerm", searchTerm),]); // 'searchTerm' is the name of the column in the database.

            //             // See if a doc exists for this user (userId) + movie (movie_id)
                        
            //                 const result = await database.listDocuments(DATABASE_ID, TABLE_ID, 
            //                 [
            //                     // Query: helps construct filters, limits, ordering, etc.

            //                         // Query.equal() → filters matching records.                            
        
            //                             Query.equal("userId", userId),
                                    
            //                             Query.equal("movie_id", String(movie.id)),
                                
            //                     Query.limit(1) // We only need to know if it exists, so limit to 1 result.
            //                 ]);

                    
                    
            //         // 2. If it exists, increment the count field of that record by 1.


            //             // PREVIOUS STATEMENT: --------------------------------->   // if (result.documents.length > 0) {
            //                                                                         // // Record exists, increment the count field by 1.

            //                                                                         // const doc = result.documents[0];

            //                                                                         // const updatedCount = doc.count + 1;

            //                                                                         // await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
            //                                                                         //     count: updatedCount,
            //                                                                         // });
            //                                                                         // }
                                                                            
            //             // See if we found a document. If so, increment its count.
                        
            //                 if (result.documents.length > 0)
            //                 {
            //                     const doc = result.documents[0];
                                
            //                     const updatedCount = (doc.count ?? 0) + 1;
                                
            //                     await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, { count: updatedCount });
            //                 }
                


            //         // 3. If it doesn't exist, create a new record with searchTerm and set count to 1.
                    

            //             // PREVIOUS STATEMENT: -------------------------->  //     else
            //                                                                 //     {
            //                                                                 //     // Record doesn't exist, create a new record with count set to 1.

            //                                                                 //     await database.createDocument(
            //                                                                 //         DATABASE_ID,
            //                                                                 //         TABLE_ID,
            //                                                                 //         ID.unique(),
            //                                                                 //         {
            //                                                                 //         searchTerm,
            //                                                                 //         count: 1,
            //                                                                 //         movie_id: movie.id,
            //                                                                 //         poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            //                                                                 //         }
            //                                                                 //     );
            //                                                                 //     }
            //                                                                 // }

            //             // If no document found, create document with per-document permissions so only this user can read/write it

            //             // What happens:

            //                 // A new document (row) is created in your metrics collection.

            //                 // Appwrite saves those permissions specifically for that document.

            //                 // The permissions apply only to that document — not to the rest.

            //                 // So yes — every single document gets its own private ACL (Access Control List) attached at creation.

            //                 // Each ACL says: “Only this user can read, update, or delete me.”

            //                     else
            //                     {
            //                         await database.createDocument(
                                    
            //                             DATABASE_ID,

            //                             TABLE_ID,

            //                             "unique()",

            //                             {
            //                                 userId,     // who searched

            //                                 searchTerm, // what they searched

            //                                 count: 1,   // first search

            //                                 movie_id: movie.id ? String(movie.id) : '',  // TMDB movie ID (string)
        
            //                                 poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : ''  // movie image
            //                             },



            //                             // All users by default have no access to the document so we set per-document permissions here. Users can only create documents aka search records. Creating documents is allowed by default (anyone i.e any user can create it). It's a collection-level permission in appwrite.



            //                             // Document-level permissions. I left these blank in appwrite to set them below.
                                        
                                    
            //                                 // read permission: only this user. Can read only their own search records.
                                            
            //                                 // write permission: only this user. Can update/delete only their own search records.

            //                                     [
            //                                         // Only the user who created it can read, update, or delete it.

            //                                         // This ensures complete privacy — every user’s searches are stored securely.

            //                                             Permission.read(Role.user(userId)),
                                                        
            //                                             Permission.update(Role.user(userId)),

            //                                             Permission.delete(Role.user(userId))
            //                                     ]
            //                         );
            //                     }
            //     }
                
            //     catch (error)
            //     {
            //         console.error(`updateSearchCount error: ${error}`);
            //     }
            // }



        


    // Function to fetch the top trending searches from the database, sorted by count in descending order.

        // PREVIOUS STATEMENT: ---------------------------->    // export const getTrendingMovies = async () =>    // don't need any parameters here. We'll get the data from the database directly.
                                                                // {
                                                                //     try
                                                                //     {
                                                                //         const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [Query.orderDesc('count'), Query.limit(5)]);   // Get top 5 trending searches. Top 5 records with highest count.

                                                                //         return result.documents;   // Return the list of documents (trending searches).
                                                                //     }

                                                                //     catch (error)
                                                                //     {
                                                                //         console.error(`getTrendingMovies error: ${error}`);

                                                                //         return [];
                                                                //     }
                                                                // }
        
    // Function to fetch the top trending searches from the database, sorted by count in descending order.
                                                                
        // Fetch top 5 searched movies for the current user.
            
            // export const getTrendingMovies = async (userId) =>
            // {
            //     try
            //     {
            //         // If no userId provided (i.e not logged in), return empty.

            //             if (!userId) return [];
                
                
            //         // await account.get();
                    
            //         const result = await database.listDocuments(DATABASE_ID, TABLE_ID,
            //         [
            //             // Filter by userId to get only this user's metrics

            //             // Filters only the logged-in user’s documents.

            //                 Query.equal("userId", userId),
                
            //             Query.orderDesc("count"),
                
            //             Query.limit(50)
            //         ]

            //         );
                    
                    

            //         // Logic implemented to deal with the situation when there are 5 ot less documents with duplicates.

            //         // We don't want to show the duplicates.

            //         // Returns the clean list of unique trending movies.

            //             const seen = new Set();
                    
            //             const uniqueMovies = [];

                    
            //             for (const doc of result.documents)
            //             {
            //                 const id = doc.movie_id || '';

                    
            //                 if (!seen.has(id))
            //                 {
            //                     seen.add(id);
                        
            //                     uniqueMovies.push(doc);
            //                 }
            //             }
                

            //         return uniqueMovies;
            //     } 
            
            //     catch (err) 
            //     {
            //         console.error(`getTrendingMovies error: ${err}`);
                
            //         return [];
            //     }
            // };



export default client;