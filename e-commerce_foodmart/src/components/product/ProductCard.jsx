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

    const { addItem, productsMap, isProductFavourite, toggleProductFavourite } = useCart();



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



    // handle the product being made or removed as/from favourites/wishlist

        const handleFavouriteClick = async () => 
        {
            if (!user) return alert("You need to log in to favourite items.");

          
            try
            {
                await toggleProductFavourite(liveProduct.$id);
            }
            
            catch (error)
            {
                console.error("Failed to toggle favourite/wishlist status:", error);
            }
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
      
        <div className="relative p-3 md:p-5 flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-40 h-fit md:w-70 mx-auto cursor-pointer">
    
            {/* wishlist heart */}
    
                <div
            
                    className={`absolute top-4 right-4 md:top-7 md:right-7 bg-white hover:-translate-y-0.5 p-1.5 md:p-3 rounded-full transition-all duration-200`}
            
                    onClick={() => {handleFavouriteClick()}}
                >

                    <img
            
                        src={isProductFavourite(liveProduct.$id) ? `/icons/heart.png` : `/icons/heart.svg`}
                
                        alt="wishlist"
                        
                        className="w-5 md:w-8"
                    />
                
                </div>
        
        
            {/* discount tag */}
    
                {formatDiscount(liveProduct.discount_tag) && (
            
                    <div className="max-md:text-[10px] absolute top-5.25 left-5 md:top-8 md:left-7 bg-green-700 text-white font-bold hover:-translate-y-1 p-1 rounded-xl transition-all duration-300">
                
                        {liveProduct.discount_tag}
            
                    </div>
            
                )}
    
        
            {/* Icon section */}
    
                <div
            
                    className="flex justify-center items-center bg-gray-200 w-full h-[35%] rounded-2xl p-3"
            
                    onClick={!addToCartLoading && handleClick}
                >
            
                    <img
                
                        src={liveProduct.image_url}
                
                        alt={liveProduct.name}
                
                        className={`${(liveProduct.slug === "fruita-vitals-orange-juice") ? 'w-25' : ``} md:w-30 h-25 md:h-37`}
                    />
            
                </div>


            {/* Content section */}
    
                <div>
    
                    {/* Product name */}
    
                        <p className={`mt-1 md:mt-3  ${(liveProduct.name.length > 20) ? `max-md:text-[11px]` : `max-md:text-[13px]`} md:text-lg font-bold text-gray-700 hover:text-gray-900 transition`}
                    
                            onClick={!addToCartLoading && handleClick}
                        >
                    
                            {liveProduct.name}
                        
                        </p>

    
                    {/* stock + rating */}
    
                        <p className={`font-extralight ${(liveProduct.name.length > 20) ? `max-md:text-[9px]` : `max-md:text-[10px]`} md:text-sm text-left w-full mt-0.5 md:mt-2`}>
                    
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
                    
                                    <p className={`font-bold font-mono text-md md:text-2xl mt-0.5 md:mt-2`}>
                            
                                        {" "}
                            
                                        
                                        {formatPrice(liveProduct.price, liveProduct.currency, liveProduct.discount_tag)}
                                        

                                        {" "}
                            
                                    </p>
                            
                                    {formatDiscount(liveProduct.discount_tag) && (
                            
                                        <p className="text-gray-500 mt-1.25 md:mt-3 text-left font-bold text-[10px] md:text-lg line-through font-mono">
                                
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
                                <p className="mt-1 md:mt-4 text-center text-lg md:text-2xl italic"> 𝑂𝑢𝑡 𝑜𝑓 𝑆𝑡𝑜𝑐𝑘 </p>
                            )
                        }


                    {/* counter + Add to cart button */}

                        {
                            (!!existingStock) && 
                            
                            (
                                <div className="flex justify-between">

                                    {/* counter */}

                                        <div className="flex items-center gap-2 mt-0.75 md:mt-1.5">

                                            <button

                                                className={`flex cursor-pointer justify-center items-center bg-gray-100 ${((quantity === liveProduct.stock) || addToCartLoading) ? `` : `hover:bg-gray-200`} max-md:h-4 w-5 md:w-7 font-bold rounded-md max-md:text-[12px] md:text-md`}

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

                                    
                                            <span className="font-mono max-md:text-[12px] cursor-default">{quantity}</span>

                                    
                                            <button
                                        
                                                className={`flex cursor-pointer justify-center items-center bg-gray-100 ${((quantity === 0) || addToCartLoading) ? `` : `hover:bg-gray-200`} max-md:h-4 w-5 md:w-7 font-bold rounded-md max-md:text-[12px] md:text-md`}

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
                            
                                            className={`max-md:mt-0.75 max-md:text-[11px] font-semibold ${quantity ? "text-gray-500 hover:text-gray-600 cursor-pointer" : "text-gray-400"}`}
                                    
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
                            
                                                        <Loader size="medium" color="border-yellow-500 border-5" />
                            
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