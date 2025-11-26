import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import { getFavouriteProducts } from "../appwrite/db";

import Navbar from "../components/Navbar";

import ProductCard from "../components/product/ProductCard";

import Loader from "../components/Loader";



export default function Wishlist()
{
    const { slug } = useParams();


    const navigate = useNavigate();

    
    const [products, setProducts] = useState([]);


    const [loading, setLoading] = useState(true);



    const { productsMap } = useCart();

    useEffect(() =>
    {
      setProducts(products.filter((p) => productsMap[p.$id].isFavourite));
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsMap]);




    useEffect(() =>
    {
        async function fetchData()
        {
            setLoading(true);


            const prods = await getFavouriteProducts();

            
            if (!prods)
            {
                setLoading(false);
             
                return;
            }


            setProducts(prods);

            setLoading(false); // only stop AFTER cat + products fetched
        }

        fetchData();

    }, [slug]);


    
    if (loading)
    {
        return (
    
            <div className="flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">
            
                <p className="text-3xl font-bold text-white text-center"> Loading Wishlist </p>

                <Loader size="xl" color="border-white" />
            
            </div>
        
        );
    }






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

                
                {(products.length > 0) ? 
            
                    (
                        < div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:pl-20 md:pr-8 gap-x-10">
                        
                            {products.map(p =>
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