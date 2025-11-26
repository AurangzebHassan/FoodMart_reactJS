import React, { useState, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";

import { useCart } from "../../context/CartContext";

import { useNavigate } from "react-router-dom"; // 🟢 For navigation between routes

import { formatPrice } from "../../utils/formatPrice";

import { formatRating } from "../../utils/formatRating";

import { formatDiscount } from "../../utils/formatDiscount";

import { incrementProductCartAddCount } from "../../appwrite/db";

import Loader from "../Loader";



/*
  ✅ A simple reusable card that displays one product.
  
    It receives prop for:
        
        -Product(object)
*/



export default function ProductCard({ Product }) {
    const { user } = useAuth();

    const { addItem, productsMap } = useCart();



    const [addToCartLoading, setAddToCartLoading] = useState(false);



     // always use freshest product data from CartContext
  
        const liveProduct = productsMap[Product.$id] ? productsMap[Product.$id] : Product;
    

    // state to hold the counter quantity
    
        let [quantity, setQuantity] = useState(0);

    
    let [existingStock, setExistingStock] = useState(liveProduct.stock);



    const navigate = useNavigate();



    // 🟢 Sync local stock with global cart
    
    useEffect(() =>
    {
        // this would have worked if I wasn't updating the product stock in the CartContext i.e when products are added to cart.
            
        // existingStock just need to read the product stock and d nothing else.
            
            // const cartItem = cartItems.find((c) => c.product_id === product.$id);
            
            // if (cartItem) setExistingStock(product.stock - cartItem.quantity);

            // else setExistingStock(product.stock);
            
        
        setExistingStock(liveProduct.stock);
        
    }, [liveProduct.stock]);

    
    
    // 🟢 Handle click → navigate to /product/{slug}
    
    const handleClick = () => {
        if (!liveProduct.slug) return; // safety check
        
        navigate(`/product/${liveProduct.slug}`);
    };



    // Add to Cart handler
    
    const handleAddToCart = async () => {
        if (!user) {
            alert("You need to log in first.");
        
            return;
        }

        if (quantity < 1) return;

        try {
            // CartContext handles DB updates and stock validation
        
            await addItem(liveProduct.$id, quantity);
            
                
            // Increment cart add count for trending / analytics
                
            await incrementProductCartAddCount(liveProduct.$id);
                    
                
            // await decreaseProductStock(Product.$id, quantity);
                
                
            // alert(`${quantity}× ${liveProduct.name} added to cart!`);
                
            setQuantity(0);
        }
            
        catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    
    
    
    
    
    return (
      
        <div className="relative mb-10 p-5 flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-70 h-90 mx-auto cursor-pointer">
    
            {/* wishlist heart */}
    
                <div
            
                    className="absolute top-7 right-7 bg-white hover:bg-red-500 p-3 rounded-full transition-all duration-300"
            
                    onClick={() => {!addToCartLoading && navigate("/wishlist");}}
                >
            
                    <img
                
                        src="/icons/heart.svg"
                
                        alt="wishlist"
                
                        className="w-8 hover:fill-current hover:text-white"
                    />
            
                </div>
        
        
            {/* discount tag */}
    
                {formatDiscount(liveProduct.discount_tag) && (
            
                    <div className="absolute top-8 left-7 bg-green-700 text-white font-bold hover:-translate-y-1 p-1 rounded-xl transition-all duration-300">
                
                        {liveProduct.discount_tag}
            
                    </div>
            
                )}
    
        
            {/* Icon section */}
    
                <div
            
                    className="flex justify-center items-center bg-gray-200 w-full h-[60%] rounded-2xl p-3"
            
                    onClick={!addToCartLoading && handleClick}
                >
            
                    <img
                
                        src={liveProduct.image_url}
                
                        alt={liveProduct.name}
                
                        className="w-30 h-35"
                    />
            
                </div>


            {/* Content section */}
    
                <div>
    
                    {/* Product name */}
    
                        <p className="mt-3 text-lg font-bold text-gray-700 hover:text-gray-900 transition"
                    
                            onClick={!addToCartLoading && handleClick}
                        >
                    
                            {liveProduct.name}
                        
                        </p>

    
                    {/* stock + rating */}
    
                        <p className={`font-extralight text-sm text-left w-full mt-2`}>
                    
                            {" "}
                    
                            {existingStock ? existingStock : ''} 
                                
                            {existingStock ? (existingStock === 1) ? " UNIT" : " UNIT(S)" : ''}                                
                                
                            {existingStock ? 'ㅤ•ㅤ' : ''}
                            
                                
                            ⭐
                                
                            {" "}
                    
                        
                            <span className="font-semibold">
                    
                                {" "}
                    
                                {formatRating(liveProduct.rating)}{" "}
                    
                            </span>
                            
                        
                            {" "}
                        
                        </p>

    
                    {/* price */}
    
                        {
                            (!!existingStock) && 
                            
                            (
                                <div className={`flex gap-2 items-center`}>
                    
                                    <p className={`font-bold font-mono text-2xl mt-2`}>
                            
                                        {" "}
                            
                                        
                                        {formatPrice(liveProduct.price, liveProduct.currency, liveProduct.discount_tag)}
                                        

                                        {" "}
                            
                                    </p>
                            
                                    {formatDiscount(liveProduct.discount_tag) && (
                            
                                        <p className="text-gray-500 mt-3 text-left font-bold text-lg line-through font-mono">
                                
                                            {formatPrice(liveProduct.price, "USD")}
                            
                                        </p>
                                    )}
                        
                                </div>
                            )
                        }

                
                    {/* OUT OF STOCK */}
                    
                        {
                            !existingStock && 
                            
                            (
                                <p className="mt-4 text-center text-2xl italic"> 𝑂𝑢𝑡 𝑜𝑓 𝑆𝑡𝑜𝑐𝑘 </p>
                            )
                        }


                    {/* counter + Add to cart button */}

                        {
                            (!!existingStock) && 
                            
                            (
                                <div className="flex justify-between">

                                    {/* counter */}

                                        <div className="flex gap-2 mt-1.5">

                                            <button

                                                className={`flex cursor-pointer justify-center items-center bg-gray-100 ${((quantity === liveProduct.stock) || addToCartLoading) ? `` : `hover:bg-gray-200`} w-7 font-bold rounded-md text-md`}

                                                disabled={(quantity === existingStock) || addToCartLoading}
                                        
                                                onClick={() =>
                                                {
                                                    if (quantity < existingStock)
                                                    {
                                                        setQuantity(quantity + 1);
                                                    }
                                                }}
                                            >
                                        
                                                {" "}
                                                    
                                                +
                                                
                                                {" "}
                                    
                                            </button>

                                    
                                            <span className="font-mono cursor-default">{quantity}</span>

                                    
                                            <button
                                        
                                                className={`flex cursor-pointer justify-center items-center bg-gray-100 ${((quantity === 0) || addToCartLoading) ? `` : `hover:bg-gray-200`} w-6 font-bold rounded-md text-md`}

                                                disabled={(quantity === 0) || addToCartLoading}
                                        
                                                onClick={() => 
                                                {
                                                    if (quantity > 0)
                                                    {
                                                        setQuantity(quantity - 1);                                    
                                                    }
                                                }}
                                            >
                                        
                                                {" "}
                                        
                                                −
                                                    
                                                {" "}
                                    
                                            </button>
                                    
                                        </div>

                    
                                    {/* Add to cart button */}

                                        <button
                            
                                            className={`font-semibold ${quantity ? "text-gray-500 hover:text-gray-600 cursor-pointer" : "text-gray-400"}`}
                                    
                                            disabled={quantity === 0 || addToCartLoading}
                                    
                                            onClick=
                                            {
                                                async () =>
                                                {
                                                    setAddToCartLoading(true);

                                                    await handleAddToCart();

                                                    setAddToCartLoading(false);
                                                }
                                            }
                                        >
                                    
                                            {
                                                addToCartLoading ? 
                                                
                                                (
                                                    <div className="flex items-center justify-center">
                            
                                                        <Loader size="medium" color="border-yellow-500" />
                            
                                                    </div>
                                                )         
                                        
                                                :
                                        
                                                "Add to Cart"
                                            }
                                    
                                        </button>
            
                                </div>
                            )
                        }
                    
                </div>

        </div>
    
    );
}