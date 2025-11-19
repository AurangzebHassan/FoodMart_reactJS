import { account, database, DATABASE_ID, PRODUCTS_TABLE_ID, CATEGORIES_TABLE_ID, USERS_TABLE_ID, CART_TABLE_ID, Query } from "./appwrite.js";

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


                // Time-based
                    
                    // Filter client-side: last 7 days
                
                        // const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);


                    // return all.documents.filter(prod => new Date(prod.$createdAt) >= sevenDaysAgo);

                

                // recency-based

                    return (all.documents);
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
            console.log("\t\tgetUserprofile() called");

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
            console.log("\t\tcreateUserprofile() called");



            const existingProfile = await getUserProfile(user.$id);
    
            if (existingProfile) return existingProfile; // don’t create a new one



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

        export async function ensureUserProfile()
        {
          console.log("\t\tensureUserprofile() called");

          let user = null;

          // retry to get Appwrite session (handles OAuth redirects and Appwrite eventual consistency)

          for (let i = 0; i < 3; i++) {
            try {
              user = await account.get();
              if (user) break;
            } catch {
              console.warn("Appwrite session not ready yet, retrying...");
              await new Promise((res) => setTimeout(res, 500));
            }
          }

          if (!user) {
            console.error("No Appwrite session detected after retries.");
            return null;
          }

          // Fetch all profiles for this user_id
          let profiles = await database.listDocuments(
            DATABASE_ID,
            USERS_TABLE_ID,
            [Query.equal("user_id", user.$id)]
          );

          let profile = null;

          if (profiles.documents.length === 0) {
            // No profile exists → create one
            await createUserProfile(user);
            profile = await getUserProfile(user.$id);
            console.log("Profile created successfully:", profile);
          } else if (profiles.documents.length === 1) {
            // Only one profile exists → use it
            profile = profiles.documents[0];
          } else {
            // Duplicate profiles detected → keep newest, delete others
            console.warn("Duplicate profiles detected for user_id:", user.$id);

            // Sort by createdAt descending → newest first
            profiles.documents.sort(
              (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
            );

            profile = profiles.documents[0];

            // Delete all older duplicates
            for (let i = 1; i < profiles.documents.length; i++) {
              await database.deleteDocument(
                DATABASE_ID,
                USERS_TABLE_ID,
                profiles.documents[i].$id
              );
              console.log(
                "Deleted duplicate profile:",
                profiles.documents[i].$id
              );
            }
          }

          // Sync profile fields with current user info
          const updates = {};
          const storedPic = getStoredProfilePic(user.email);

          if (profile.name !== user.name && user.name) updates.name = user.name;
          if (profile.email !== user.email) updates.email = user.email;
          if (profile.profile_pic !== storedPic)
            updates.profile_pic = storedPic;

          if (Object.keys(updates).length > 0) {
            await database.updateDocument(
              DATABASE_ID,
              USERS_TABLE_ID,
              profile.$id,
              updates
            );
            console.log("Profile synced with OAuth Provider:", updates);
            profile = await getUserProfile(user.$id); // refresh
          }

          return profile;
        }










// ------------------- CART COLLECTION ----------------------------------------------------------------------


    // 1️⃣ Get all cart items for a user
        
            export async function getCartItems(userId) 
            {
                try
                {
                    const res = await database.listDocuments(
                    
                        DATABASE_ID,
                    
                        CART_TABLE_ID,
                    
                        [Query.equal("user_id", userId)]
                    );
                
                    return res.documents;
                }
                
                catch (err)
                {
                    console.error("Error fetching cart items:", err);
                
                    return [];
                }
            }



    // 2️⃣ Add/update a cart item (if exists, increment qty)
    
        export async function addOrUpdateCartItem(userId, productId, quantity = 1) 
        {
            try
            {
                const existingItems = await database.listDocuments(
            
                    DATABASE_ID,
            
                    CART_TABLE_ID,
            
                    [
                        Query.equal("user_id", userId),
            
                        Query.equal("product_id", productId)
                    ]
                );


                if (existingItems.documents.length > 0)
                {
                    // Update quantity as product already exists in cart
                
                        const item = existingItems.documents[0];
                    
                        const newQty = item.quantity + quantity;
                    
                            const updated = await database.updateDocument(
                        
                                DATABASE_ID,
                        
                                CART_TABLE_ID,
                        
                                item.$id,
                        
                                { quantity: newQty }
                            );
                    
                    return updated;
                }
                
                else
                {
                    // Create new cart doc a product is new to cart
                
                        const created = await database.createDocument(
                    
                            DATABASE_ID,
                    
                            CART_TABLE_ID,
                    
                            "unique()",
                    
                            {
                                user_id: userId,
                    
                                product_id: productId,
                    
                                quantity: quantity,
                            },
                    
                            [
                    
                                Permission.read(Role.user(userId)),
                    
                                Permission.update(Role.user(userId)),
                    
                                Permission.delete(Role.user(userId))
                    
                            ]
                        );
                
                    
                    return created;
                }
            }
            
            catch (err)
            {
                console.error("Error adding/updating cart item:", err);
            
                return null;
            }
        }



    // 3️⃣ Remove a cart item
    
        export async function removeCartItem(cartItemId) 
        {
            try
            {
                await database.deleteDocument(DATABASE_ID, CART_TABLE_ID, cartItemId);
            
                return true;
            } 
            
            catch (err)
            {
                console.error("Error removing cart item:", err);
            
                return false;
            }
        }



    // 4️⃣ Clear cart (after checkout)
    
        export async function clearUserCart(userId) 
        {
            try
            {
                const items = await getCartItems(userId);
            
            
                for (let item of items)
                {
                    await database.deleteDocument(DATABASE_ID, CART_TABLE_ID, item.$id);
                }
                
                return true;
            } 
            
            catch (err)
            {
                console.error("Error clearing user cart:", err);
            
                return false;
            }
        }