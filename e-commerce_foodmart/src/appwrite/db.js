import { database, DATABASE_ID, PRODUCTS_TABLE_ID, CATEGORIES_TABLE_ID, Query } from "./appwrite.js";



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

    // export async function getNewProducts()
    // {
    //     try
    //     {
    //         const res = await database.listDocuments(DATABASE_ID, PRODUCTS_TABLE_ID,
                
    //             [
    //                 Query.equal("isNew", true),
        
    //                 Query.orderDesc("$createdAt"),
    //             ]
    //         );
        
    //         return res.documents;
    //     }
    
    //     catch (err)
    //     {
    //         console.error("Error fetching new products:", err);
        
    //         return [];
    //     }
    // }
    
    

    // appwrite/db.js

        

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
