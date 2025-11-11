import React, { useState } from "react";

import { useNavigate } from "react-router-dom"; // 🟢 For navigation between routes

import { formatPrice } from "../../utils/formatPrice";

import { formatRating } from "../../utils/formatRating";

import { formatDiscount } from "../../utils/formatDiscount";



/*
  ✅ A simple reusable card that displays one category.
  
    It receives prop for:
        
        -Product(object)
*/



export default function ProductCard({ Product })
{
    // stae to hold the counter quantity

    let [quantity, setQuantity] = useState(0);


    const navigate = useNavigate();



    // 🟢 Handle click → navigate to /category/{slug}
    
        const handleClick = () =>
        {
            if (!Product.slug) return; // safety check
        
            navigate(`/product/${Product.slug}`);
        };






    return (

        // wrapper div with hover and shadow

            <div className="relative mb-10 p-5 flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-70 h-90 mx-auto cursor-pointer">
        
            
                {/* wishlist heart */}
                    
                    <div className="absolute top-7 right-7 bg-white hover:bg-red-500 p-3 rounded-full transition-all duration-300" onClick={() => navigate('/wishlist')}> 
                        
                        <img src="/icons/heart.svg" alt="wishlist" className="w-8 hover:fill-current hover:text-white" /> 
                        
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-red-500 hover:text-white transition-colors duration-300"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>     */}
                    
                    </div>
                    
            
                {/* discount tag */}

                    {
                        formatDiscount(Product.discount_tag) && 
                        
                        ( 
                            <div className="absolute top-8 left-7 bg-green-700 text-white font-bold hover:-translate-y-1 p-1 rounded-xl transition-all duration-300" onClick={() => navigate('/wishlist')}> 
                        
                                {Product.discount_tag}
                    
                            </div> 
                        )
                    }
            
            
                {/* Icon section */}
        
                    <div 
                    
                        className="flex justify-center items-center bg-gray-200 w-full h-[60%] rounded-2xl p-3"
                        
                        onClick={handleClick}    
                    >
                
                        <img src={Product.image_url} alt={Product.name} className="w-30 h-35" />
                                    
                    </div>

        
                
                {/* Content section */}

                    <div>
            
                        {/* Product name */}
            
                            <p 
                            
                                className="mt-3 text-lg font-bold text-gray-700 hover:text-gray-900 transition"
                                
                                onClick={handleClick}
                            >
                                
                                {Product.name}
                                
                            </p>
                            

                        {/* stock + rating */}
                        
                            <p className="font-extralight text-sm text-left w-full mt-2"> {Product.stock} UNIT(S)ㅤ⭐ <span className="font-semibold"> {formatRating(Product.rating)} </span> </p>
                        
                
                        {/* price */}
                    
                            <p className="text-left w-full font-bold font-mono text-2xl mt-2"> {formatPrice(Product.price, Product.currency)} </p>
                        
                
                        {/* counter + Add to cart button */}
                    
                            <div className="flex justify-between"> 
                                
                                {/* counter */}
                                
                                    <div className="flex gap-2 mt-1.5">
                                    
                                        <button 
                                        
                                            className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 w-7 font-bold rounded-md text-md"
                                        
                                            onClick={() => {if(quantity < Product.stock) setQuantity(++quantity)}}
                                    
                                        > + </button>

                            
                                        <span className="font-mono"> 
                                        
                                            {quantity} 
                                        
                                        </span>
                                    
                            
                                        <button 
                                        
                                            className="flex justify-center items-center bg-gray-100 hover:bg-gray-200 w-6 font-bold rounded-md text-md"
                                            
                                            onClick={() => {if(quantity > 0) setQuantity(--quantity)}}
                                            
                                        > − </button>

                                    </div>
                            
                        
                        
                                {/* Add to cart button */}
                                
                                    {/* {(quantity > 0) && 
                                    
                                        (
                                            <button
                                            
                                                className="font-semibold text-gray-400 hover:text-gray-500 cursor-pointer transition-all duration-300"
                                            
                                            > 
                                            
                                                Add to Cart 
                                            
                                            </button> 
                                        )
                                    } */}
                                    
                    
                                    <button
                                    
                                        className={`font-semibold ${quantity ? "text-gray-500 hover:text-gray-600 cursor-pointer" : "text-gray-400"}`}
                                    
                                        disabled={quantity === 0}    
                                    > 
                                    
                                        Add to Cart 
                                    
                                    </button> 
                    
                            </div>

            
                    </div>

        </div>
        
  );
}