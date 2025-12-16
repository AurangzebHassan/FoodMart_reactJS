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
        // return (
    
        //     <div className="flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">
      
        //         <p className="text-4xl font-extrabold text-white text-center">
        
        //             Loading Wishlist
      
        //         </p>
      
                
        //         <Loader size="xl" color="border-white border-9" />

        //         <Loader size="large" color="border-white border-7" />

        //         <Loader size="medium" color="border-white border-6" />
    
        //     </div>
  
        // );
        


        return (

				<>
		
					<div className="hidden md:flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">

						<span className="text-4xl font-extrabold text-white text-center"> Loading Wishlist </span>

						
						<Loader size="xl" color="border-white border-9" />

						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

					</div>


					
					<div className="flex md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-yellow-500 gap-2">

						<span className="text-xl font-extrabold text-white text-center"> Loading Wishlist </span>

						
						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

						<Loader size="small" color="border-white border-5" />

					</div>
					
				</>
				
			);
    }



    // Derive favourite products safely (favouritesMap might be empty)
  
       const favouriteProducts = favouritesOrder
         
           .map((id) => productsMap[id])
         
           .filter(Boolean);






    return (
    
        <>
        
            <Navbar />

            
            <div className="container mx-auto lg:mt-3 py-3 md:py-6 px-5 flex-col">

                <div className="flex mb-5 md:mb-10 items-center">

                    <button

                        // className="flex items-center justify-center w-22 max-md:h-7 md:w-25 md:px-4 md:py-1 text-black max-md:text-[14px] font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                        
                        onClick={() => navigate(-1)}
                    >
                    
                        {/* ← Back */}

                        <img src="/icons/back.png" alt="back" className="w-8 md:w-12 hover:-translate-y-1 active:-translate-y-1 transition-all duration-150" title="Back" />
                    
                    </button>

                    
                    <div className="w-full flex items-center justify-center text-xl md:text-4xl text-yellow-500 font-extrabold">

                        Wishlist
                    
                    </div>
                
                </div>

                
                {(favouriteProducts.length > 0) ? 
            
                    (
                        < div className="mb-10 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:pl-20 md:pr-8 max-md:gap-x-5 gap-y-2 md:gap-y-5">
                        
                            {favouriteProducts.map(p =>
                            (
                                <ProductCard key={p.$id} Product={p} />
                            ))}
                    
                        </div>
                    )

                    :

                    (
                        <div className="flex w-full h-100 items-center justify-center pl-20 text-gray-400 font-bold text-sm md:text-2xl">

                            No Products in Wishlist

                        </div>
                    )
                }

            </div>
        </>
    );
}