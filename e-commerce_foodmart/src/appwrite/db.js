import { account, database, DATABASE_ID, PRODUCTS_TABLE_ID, CATEGORIES_TABLE_ID, USERS_TABLE_ID, CART_TABLE_ID, FAVOURITES_TABLE_ID, Query } from "./appwrite.js";

import { Permission, Role } from "appwrite";



//--------------PRODUCTS + CATEGORY COLLECTION-------------------------------------------------

    /* ------------------- 🟩 1. Get all categories ------------------- */

        export async function getAllCategories() {
            try {
                const res = await database.listDocuments(DATABASE_ID, CATEGORIES_TABLE_ID);
                return res.documents;
            } catch (err) {
                console.error("Error fetching categories:", err);
                return [];
            }
        }



    /* ------------------- 🟩 2. Get all products ------------------- */
    
        export async function getAllProducts() {
            try {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID, [
                    Query.orderDesc("$createdAt"),
                ]);
                return res.documents;
            } catch (err) {
                console.error("Error fetching products:", err);
                return [];
            }
        }



    /* ------------------- 🟩 3. Get products by category ------------------- */
    
        export async function getProductsByCategory(categoryId) {
            try {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID, [
                    Query.equal("category_id", categoryId),
                ]);
                return res.documents;
            } catch (err) {
                console.error("Error fetching category products:", err);
                return [];
            }
        }



    /* ------------------- 🟩 4. Get trending products ------------------- */
    
        export async function getTrendingProducts() {
            try {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID, [
                    Query.equal("isTrending", true),
                    Query.orderDesc("score")
                ]);
                return res.documents;
            } catch (err) {
                console.error("Error fetching trending products:", err);
                return [];
            }
        }


    /* ------------------- 🟩 5. Get most searched products ------------------- */
    
        export async function getMostSearchedProducts() {
            try {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID, [
                    Query.orderDesc("search_count"),
                    Query.limit(7)
                ]);
                return res.documents;
            } catch (err) {
                console.error("Error fetching most searched products:", err);
                return [];
            }
        }



    /* ------------------- 🟩 6. Get most searched products ------------------- */
    
        export async function getMostAddedToCartProducts() {
            try {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID, [
                    Query.orderDesc("cart_add_count"),
                    Query.limit(7)
                ]);
                return res.documents;
            } catch (err) {
                console.error("Error fetching most added to cart products:", err);
                return [];
            }
        }



    /* ------------------- 🟩 7. Get most searched products ------------------- */
    
        export async function getMostViewedProducts() {
            try {
                const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID, [
                    Query.orderDesc("view_count"),
                     Query.limit(7)
                ]);
                return res.documents;
            } catch (err) {
                console.error("Error fetching most viewed products:", err);
                return [];
            }
        }



    /* ------------------- 🟩 8. Get new arrivals ------------------- */

        export async function getNewProducts() {
            try {
                const all = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID, [
                    Query.orderDesc("$createdAt"),
                    Query.limit(7)
                ]);
                return all.documents;
            } catch (err) {
                console.error("Error fetching new products:", err);
                return [];
            }
        }



    /* ------------------- 🟩 9. favourtie/wishlist functions ------------------- */
        
        export async function getUserFavourites(userId) 
        {
            try
            {
                const res = await database.listDocuments(
              
                    DATABASE_ID,
              
                    FAVOURITES_TABLE_ID,
              
                    [
                        Query.equal("user_id", userId),
                        
                        Query.orderDesc("$createdAt")
                    ]
            );
            
                return res.documents;
            }
            
            catch (err)
            {
                console.error("Error fetching user favourites:", err);
                
                return [];
          }
        }



        export async function findFavourite(userId, productId) 
        {
            try
            {
                const res = await database.listDocuments(
              
                    DATABASE_ID,
              
                    FAVOURITES_TABLE_ID,
              
                    [
                        Query.equal("user_id", userId),
                
                        Query.equal("product_id", productId),
                    ]
            );
            
                return res.documents[0] || null;
            }
            
            catch (err)
            {
                console.error("Error finding favourite:", err);
            
                return null;
          }
        }



        export async function addFavourite(userId, productId) 
        {
            try
            {
                return await database.createDocument(
              
                    DATABASE_ID,
              
                    FAVOURITES_TABLE_ID,
              
                    "unique()",
              
                    {
                        user_id: userId,
                        
                        product_id: productId
                    },
              
                    [
                        Permission.read(Role.user(userId)),
                
                        Permission.delete(Role.user(userId)),
                    ]
                );
            }
            
            catch (err)
            {
                console.error("Error adding favourite:", err);
            
                return null;
            }
        }



        export async function removeFavourite(favId) 
        {
            try
            {
                return await database.deleteDocument(
              
                    DATABASE_ID,
              
                    FAVOURITES_TABLE_ID,
              
                    favId
                );
            }
            
            catch (err)
            {
                console.error("Error removing favourite:", err);
            
                return null;
            }
        }


        
        export async function toggleFavourite(userId, productId) 
        {
            const existing = await findFavourite(userId, productId);

          
            if (existing)
            {
                await removeFavourite(existing.$id);
            
                return { isFavourite: false };
            }

            await addFavourite(userId, productId);
          
            return { isFavourite: true };
        }






//-------------------------- USERS COLLECTION------------------------------------------------------------------

    /* ------------------- 🟩 6. Get user profile ------------------- */

        export async function getUserProfile(userId) {
            console.log("\t\tgetUserprofile() called");
            try {
                const res = await database.listDocuments(DATABASE_ID, USERS_TABLE_ID, [Query.equal("user_id", userId)]);
                console.log(res.documents);
                return res.documents.length > 0 ? res.documents[0] : null;
            } catch (err) {
                console.error("Error fetching user profile:", err);
                return null;
            }
        }



    /* ------------------- 🟩 7. Create user profile (if missing) ------------------- */

        export function getStoredProfilePic(email) {
            const username = email.split("@")[0];
            const possibleExtensions = [".jpeg", ".jpg", ".png", ".svg"];
            for (let ext of possibleExtensions) {
                const path = `/images/user_profile_pics/${username}_pfp${ext}`;
                return path;
            }
            return "/icons/user.svg";
        }

        export async function createUserProfile(user) {
            console.log("\t\tcreateUserprofile() called");
            const existingProfile = await getUserProfile(user.$id);
            if (existingProfile) return existingProfile;
            try {
                const res = await database.createDocument(DATABASE_ID, USERS_TABLE_ID, "unique()", {
                    user_id: user.$id,
                    name: user.name || user.email.split("@")[0],
                    email: user.email,
                    profile_pic: getStoredProfilePic(user.email) || "/icons/user.svg",
                    bio: null,
                    role: "user"
                }, [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]);
                console.log(res);
                return res;
            } catch (err) {
                if (err.code === 409) {
                    console.warn("User profile already exists (unique constraint).");
                    return null;
                }
                console.error("Error creating user profile:", err);
                return null;
            }
        }



    /* ------------------- 🟩 8. Ensure user profile exists ------------------- */
    
        export async function ensureUserProfile() {
            console.log("\t\tensureUserprofile() called");
            let user = null;
            for (let i = 0; i < 3; i++) {
                try { user = await account.get(); if (user) break; } catch { await new Promise(res => setTimeout(res, 500)); }
            }
            if (!user) { console.error("No Appwrite session detected after retries."); return null; }
            let profiles = await database.listDocuments(DATABASE_ID, USERS_TABLE_ID, [Query.equal("user_id", user.$id)]);
            let profile = null;
            if (profiles.documents.length === 0) {
                await createUserProfile(user);
                profile = await getUserProfile(user.$id);
                console.log("Profile created successfully:", profile);
            } else if (profiles.documents.length === 1) {
                profile = profiles.documents[0];
            } else {
                profiles.documents.sort((a,b)=> new Date(b.$createdAt) - new Date(a.$createdAt));
                profile = profiles.documents[0];
                for (let i=1;i<profiles.documents.length;i++) {
                    await database.deleteDocument(DATABASE_ID, USERS_TABLE_ID, profiles.documents[i].$id);
                    console.log("Deleted duplicate profile:", profiles.documents[i].$id);
                }
            }
            const updates = {};
            const storedPic = getStoredProfilePic(user.email);
            if(profile.name!==user.name && user.name) updates.name=user.name;
            if(profile.email!==user.email) updates.email=user.email;
            if(profile.profile_pic!==storedPic) updates.profile_pic=storedPic;
            if(Object.keys(updates).length>0){
                await database.updateDocument(DATABASE_ID, USERS_TABLE_ID, profile.$id, updates);
                profile = await getUserProfile(user.$id);
            }
            return profile;
        }






// ------------------- CART COLLECTION ----------------------------------------------------------------------

    export async function getCartItems(userId) {
        try {
            const res = await database.listDocuments(DATABASE_ID, CART_TABLE_ID, [Query.equal("user_id", userId)]);
            return res.documents;
        } catch (err) {
            console.error("Error fetching cart items:", err);
            return [];
        }
    }



    export async function addOrUpdateCartItem(userId, productId, quantity=1) {
        try {
            const existingItems = await database.listDocuments(DATABASE_ID, CART_TABLE_ID, [
                Query.equal("user_id", userId),
                Query.equal("product_id", productId)
            ]);
            if(existingItems.documents.length>0){
                const item = existingItems.documents[0];
                const newQty = item.quantity + quantity;
                const updated = await database.updateDocument(DATABASE_ID, CART_TABLE_ID, item.$id, { quantity: newQty });
                return updated;
            } else {
                const created = await database.createDocument(DATABASE_ID, CART_TABLE_ID, "unique()", {
                    user_id:userId, product_id:productId, quantity:quantity
                }, [
                    Permission.read(Role.user(userId)),
                    Permission.update(Role.user(userId)),
                    Permission.delete(Role.user(userId))
                ]);
                return created;
            }
        } catch(err){
            console.error("Error adding/updating cart item:", err);
            return null;
        }
    }



    export async function removeCartItem(cartItemId){
        try{
            await database.deleteDocument(DATABASE_ID, CART_TABLE_ID, cartItemId);
            
            return true;
        } catch(err){
            console.error("Error removing cart item:", err);
            return false;
        }
    }



    export async function clearUserCart(userId){
        try{
            const items = await getCartItems(userId);
            for(let item of items){
                await database.deleteDocument(DATABASE_ID, CART_TABLE_ID, item.$id);
            }
            return true;
        } catch(err){
            console.error("Error clearing user cart:", err);
            return false;
        }
    }






// ------------------- Product Trending / Stats helpers ----------------------------------------------------------------------

    export async function incrementProductSearchCount(productId) {
        try {
            const product = await database.getDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId);
            await database.updateDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId, {
                search_count: (product.search_count||0)+1
            });
            await updateProductScore(productId);
            await incrementCategorySearchCount(product.category_id);
        } catch(err){ console.error("Error incrementing product search count:",err); }
    }



    export async function incrementProductViewCount(productId) {
        try {
            const product = await database.getDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId);
            await database.updateDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId, {
                view_count: (product.view_count||0)+1,
                // last_viewed_at: new Date().toISOString()
            });
            await updateProductScore(productId);
            await incrementCategoryViewCount(product.category_id);
        } catch(err){ console.error("Error incrementing product view count:",err); }
    }



    // deals with the number of times the 'Add to Cart' button is pressed
    
    // Cart add is about interest frequency, not quantity
    
        export async function incrementProductCartAddCount(productId) {
            try {
                const product = await database.getDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId);
                await database.updateDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId, {
                    cart_add_count: (product.cart_add_count||0)+1
                });
                await updateProductScore(productId);
                await incrementCategoryCartAddCount(product.category_id);
            } catch(err){ console.error("Error incrementing cart add count:",err); }
        }



    // deals with the number/quantity of the item bought
    
        export async function incrementProductPurchaseCount(productId, qty=1) {
            try {
                const product = await database.getDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId);
                await database.updateDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId, {
                    purchase_count: (product.purchase_count||0)+qty,
                    // last_purchased_at: new Date().toISOString()
                });
                await updateProductScore(productId);
                await incrementCategoryPurchaseCount(product.category_id, qty);
            } catch(err){ console.error("Error incrementing product purchase count:",err); }
        }



    export async function updateProductScore(productId) 
    {
        try
        {
            const product = await database.getDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId);
        
            const score =
        
                (product.search_count || 0) * 0.2 +
        
                (product.view_count || 0) * 0.3 +
        
                (product.cart_add_count||0)*0.7 +
        
                (product.purchase_count || 0) * 1.0;
            
                
            const isTrending = score >= 15;   // <-- add threshold logic

        
            await database.updateDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId, { score, isTrending });
        } 
        
        catch (err)
        {
            console.error("Error updating product score:", err);
        }
    }






// ------------------- Category Trending / Stats helpers -------------------

    export async function incrementCategorySearchCount(categoryId) {
        try {
            const category = await database.getDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId);
            await database.updateDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId, {
                search_count: (category.search_count||0)+1
            });
            await updateCategoryScore(categoryId);
        } catch(err){ console.error("Error incrementing category search count:",err); }
    }



    export async function incrementCategoryViewCount(categoryId) {
        try {
            const category = await database.getDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId);
            await database.updateDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId, {
                view_count: (category.view_count||0)+1
            });
            await updateCategoryScore(categoryId);
        } catch(err){ console.error("Error incrementing category view count:",err); }
    }



    export async function incrementCategoryCartAddCount(categoryId) {
        try {
            const category = await database.getDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId);
            await database.updateDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId, {
                cart_add_count: (category.cart_add_count||0)+1
            });
            await updateCategoryScore(categoryId);
        } catch(err){ console.error("Error incrementing category cart add count:",err); }
    }



    export async function incrementCategoryPurchaseCount(categoryId, qty = 1) {
        try {
            const category = await database.getDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId);
            await database.updateDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId, {
                purchase_count: (category.purchase_count||0)+qty
            });
            await updateCategoryScore(categoryId);
        } catch(err){ console.error("Error incrementing category purchase count:",err); }
    }



    export async function updateCategoryScore(categoryId) 
    {
        try
        {
            const category = await database.getDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId);
        
            const score =
        
                (category.search_count || 0) * 0.2 +
        
                (category.view_count || 0) * 0.3 +
        
                (category.cart_add_count || 0) * 0.7 +
        
                (category.purchase_count || 0) * 1.0;
            
            
            const isTrending = score >= 15;   // <-- add threshold logic
        
        
            await database.updateDocument(DATABASE_ID, CATEGORIES_TABLE_ID, categoryId, { score, isTrending });
        }
        
        catch (err)
        {
            console.error("Error updating category score:", err);
        }
    }



// Reduce stock by quantity

    export async function decreaseProductStock(productId, quantity)
    {
        try
        {
            const product = await database.getDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId);
            
            const newStock = Math.max((product.stock || 0) - quantity, 0);
            

            return await database.updateDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId, { stock: newStock });
        }
        
        catch (err)
        {
            console.error("Error decreasing stock:", err);
        
            return null;
        }
    }



// Increase stock by quantity (e.g., if user removes from cart)

    export async function increaseProductStock(productId, quantity)
    {
        try
        {
            const product = await database.getDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId);
        
            const newStock = (product.stock || 0) + quantity;
        
        
            return await database.updateDocument(DATABASE_ID, PRODUCTS_TABLE_ID, productId, { stock: newStock });
        } 
        
        catch (err)
        {
            console.error("Error increasing stock:", err);
        
            return null;
        }
    }