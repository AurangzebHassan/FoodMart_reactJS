import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import Navbar from "../components/Navbar";

import ProductCard from "../components/product/ProductCard";

import Loader from "../components/Loader";



export default function Wishlist()
{
    const navigate = useNavigate();


    const { productsMap, favouritesOrder, loading } = useCart();



    // ⬅️ NEW local delay state

        const [delayDone, setDelayDone] = useState(false);

    
    // ⬅️ Wait 300–500ms so spinner shows briefly
    
        useEffect(() =>
        {
            const t = setTimeout(() => setDelayDone(true), 1000);
        
            return () => clearTimeout(t);
            
        }, []);




    const isLoading = loading || !delayDone || Object.keys(productsMap || {}).length === 0;



    if (isLoading)
    {
        return (
    
            <div className="flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">
      
                <p className="text-4xl font-extrabold text-white text-center">
        
                    Loading Wishlist
      
                </p>
      
                
                <Loader size="xl" color="border-white border-9" />

                <Loader size="large" color="border-white border-7" />

                <Loader size="medium" color="border-white border-6" />
    
            </div>
  
        );
    }



    // Derive favourite products safely (favouritesMap might be empty)
  
       const favouriteProducts = favouritesOrder
         
           .map((id) => productsMap[id])
         
           .filter(Boolean);






    return (
    
        <>
        
            <Navbar />

            
            <div className="container mx-auto mt-10 py-6 px-5 flex-col">

                <div className="flex mb-10">

                    <button

                        className="flex items-center justify-center w-25 px-4 py-1 text-black font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                        
                        onClick={() => navigate(-1)}
                    >
                    
                        ← Back
                    
                    </button>

                    
                    <div className="w-full flex items-center justify-center text-4xl text-yellow-500 font-extrabold">

                        Wishlist
                    
                    </div>
                
                </div>

                
                {(favouriteProducts.length > 0) ? 
            
                    (
                        < div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:pl-20 md:pr-8 gap-x-10">
                        
                            {favouriteProducts.map(p =>
                            (
                                <ProductCard key={p.$id} Product={p} />
                            ))}
                    
                        </div>
                    )

                    :

                    (
                        <div className="flex w-full h-100 items-center justify-center pl-20 text-gray-400 font-bold text-2xl">

                            No Products in Wishlist

                        </div>
                    )
                }

            </div>
        </>
    );
}