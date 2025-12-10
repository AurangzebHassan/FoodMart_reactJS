import { useState, useEffect } from "react";

import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { formatPrice } from "../utils/formatPrice";

import { formatRating } from "../utils/formatRating.js";

import Navbar from "../components/Navbar.jsx";

import Loader from "../components/Loader.jsx";



export default function Checkout()
{
    const { user, profile } = useAuth();


    const 
    {
        cartItems,
    
        cartQuantity,
    
        cartTotal,
    
        refreshCartDocsAndProducts,

        markCheckout,

        clearCheckoutFlag,
    
        updateItem,
    
        removeItem,
    
        clearCart,
    
        productsMap,
    
        isProductFavourite,
    
        toggleProductFavourite,

        loading,

        placeOrder,

        setJustPlacedOrder
    
    } = useCart();



    const navigate = useNavigate();


    const [localCart, setLocalCart] = useState(cartItems);
    
    const [removingItemId, setRemovingItemId] = useState(null);
    
    const [updatingItemId, setUpdatingItemId] = useState(null);
    
    const [clearCartLoading, setClearCartLoading] = useState(false);
    
    const [refreshCartLoading, setRefreshCartLoading] = useState(false);

    const [placingOrderLoading, setPlacingOrderLoading] = useState(false);

    const [selectedShipping, setSelectedShipping] = useState("standard");



    // mark page as checkout
    
        useEffect(() =>
        {
            markCheckout();
        
            // return () => setIsCheckoutPage(false);
            
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    
    
    
    // --- Sync localCart EXACTLY like CartDrawer ---
    
        useEffect(() =>
        {
            const remapped = cartItems.map((item) =>
            {
                const prodFromMap = productsMap[item.product?.$id];
            
            
                if (!prodFromMap) return item;
            
            
                return { ...item, product: { ...prodFromMap } };
            });
            
            setLocalCart(remapped);
            
        }, [cartItems, productsMap]);
    
    
    
    // local delay state

        const [delayDone, setDelayDone] = useState(false);

    
    // ⬅️ Wait 300–500ms so spinner shows briefly
    
        useEffect(() =>
        {
            const t = setTimeout(() => setDelayDone(true), 1000);
        
            return () => clearTimeout(t);
            
        }, []);



    const isLoading = loading || !delayDone || Object.keys(productsMap || {}).length === 0;


        
    const handleProductClick = (product) =>
    {
        if (!product.slug) return;
    
        navigate(`/product/${product.slug}`);
    };



    const handleFavouriteClick = async (productId) =>
    {
        if (!user) return alert("You need to log in to favourite items.");

        try
        {
            await toggleProductFavourite(productId);
        
            setLocalCart((prev) =>
        
                prev.map((item) =>
        
                    item.product.$id === productId
        
                        ? { ...item, product: { ...productsMap[productId] } }
        
                        : item
                )
            );
        } 
        
        catch (err)
        {
            console.error("Failed to toggle favourite:", err);
        }
    };



    if (isLoading)
    {
        // return (
    
        //     <div className="flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">
      
        //         <p className="text-4xl font-extrabold text-white text-center">
        
        //             Loading Checkout
      
        //         </p>
      
                
        //         <Loader size="xl" color="border-white border-9" />

        //         <Loader size="large" color="border-white border-7" />

        //         <Loader size="medium" color="border-white border-6" />
    
        //     </div>
  
        // );



        return (

				<>
		
					<div className="hidden md:flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">

						<span className="text-4xl font-extrabold text-white text-center"> Loading Checkout </span>

						
						<Loader size="xl" color="border-white border-9" />

						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

					</div>


					
					<div className="flex md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-yellow-500 gap-2">

						<span className="text-xl font-extrabold text-white text-center"> Loading Checkout </span>

						
						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

						<Loader size="small" color="border-white border-5" />

					</div>
					
				</>
				
			);
    }






    return (

        <>
        
            <Navbar />

            

            {/* CONTAINER */}
            
                <div className="container mx-auto mt-10 mb-20 py-6 px-5 flex-col">

                
                    {/* BACK + TITLE + REFRESH */}
                    
                        <div className="flex mb-10 lg:mb-15">
                    

                            {/* BACL BUTTON */}

                                <button
                                    
                                    className="flex items-center justify-center w-30 lg:w-25 px-4 py-1 text-black font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                                    
                                    onClick={() => navigate(-1)}
                                >
                                    
                                    ← Back
                                    
                                </button>

                    
                            {/* CHECKOUT HEADING */}
                             
                                <div className="w-full flex items-center justify-center">
                                    
                                    <h1 className="text-4xl text-yellow-500 font-extrabold">
                                        
                                        Checkout
                                        
                                    </h1>
                                    
                                </div>
                            
                    
                            {/* REFRESH */}
                                            
                                <button
                                    
                                    className={`${refreshCartLoading || clearCartLoading || updatingItemId !== null || removingItemId !== null ? "invisible" : "hover:-translate-y-1"} transition-all duration-200 rounded-full`}
                                    
                                    onClick=
                                    {
                                        async () =>
                                        {
                                            setRefreshCartLoading(true);
                                        
                                            await refreshCartDocsAndProducts();
                                        
                                            setRefreshCartLoading(false);
                                        }}
                                    
                                        disabled={refreshCartLoading || clearCartLoading || updatingItemId !== null || removingItemId !== null}
                                    >
    
                                        <img src="/icons/refresh.png" alt="refresh" className="w-11" />
                                        
                                </button>

                    
                        </div>


                    
                    <div className="flex flex-col-reverse lg:grid lg:grid-cols-5 xl:grid-cols-7">
                        
                        
                        {/* CART ITEMS LIST */}
                    
                            <div className="max-lg:mt-10 lg:col-span-2 xl:col-span-4 2xl:col-span-4 space-y-6 mb-12 lg:mb-20 lg:pr-5">
                                
                                
                                {localCart.map((item) => 
                                {
                                    const product = item.product;
                                

                                    if (!product) return null;


                                    return (
                                        
                                        <div
                                            
                                            key={item.$id}
                                            
                                            className="relative border border-gray-50 bg-white rounded-lg drop-shadow-lg hover:drop-shadow-2xl hover:-translate-y-1 transition-all duration-300 p-4 flex lg:max-xl:flex-col gap-4"
                                        >
                                            
                                            {/* discount */}
                                            
                                                {item.discount_value > 0 && (
                                                    
                                                    <div className={`absolute ${(item.discount_value > 9.99) ? `left-65 top-33.5 lg:left-74 xl:left-59 xl:top-46 lg:top-42` : `left-66.5 top-33.5 lg:left-75.5 xl:left-60.5 xl:top-45.5 lg:top-41.75`} px-2 py-2 bg-green-700 hover:-translate-y-1 transition-all duration-200 text-white text-sm lg:text-md font-extrabold rounded-full`}>
                                                    
                                                        {product.discount_tag}
                                                        
                                                    </div>
                                                    
                                                )}

                                            

                                            {/* favourite heart */}
                                            
                                                <div
                                                    
                                                    className="absolute top-6 left-6 bg-white rounded-full p-2.5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
                                                    
                                                    onClick={() => handleFavouriteClick(product.$id)}
                                                >
                                                    
                                                    <img
                                                        
                                                        src={isProductFavourite(product.$id) ? "/icons/heart.png" : "/icons/heart.svg"}
                                                        
                                                        className="w-8.5"
                                                    />
                                                
                                                </div>


                                            
                                            {/* IMAGE */}
                                            
                                                <img
                                            
                                                    src={product.image_url}
                                                    
                                                    alt={product.name}
                                                    
                                                    className="lg:w-90 xl:w-70 lg:h-50 xl:h-55 max-lg:h-41 max-lg:w-75 rounded-lg object-contain cursor-pointer bg-gray-100 hover:bg-gray-200 transtition-all duration-200"
                                                    
                                                    onClick={() => {!((updatingItemId) || (removingItemId) || clearCartLoading || refreshCartLoading) && handleProductClick(product)}}
                                                />

                                            

                                            {/* INFO */}
                                            
                                                <div className="flex-1 py-1">
                                                    
                                                    
                                                    <div className="flex items-center justify-between">
                                                        
                                                    
                                                        {/* PRODUCT NAME */}
                                                    
                                                            <p
                                                            
                                                                className="font-mono text-xl font-bold cursor-pointer text-gray-700 hover:text-black"
                                                                
                                                                onClick={() => {!((updatingItemId) || (removingItemId) || clearCartLoading || refreshCartLoading) && handleProductClick(product)}}
                                                            >
                                                            
                                                                {product.name}

                                                            </p>
                                                        
                                                
                                                        {/* quantity badge */}
                                                            
                                                            <span className={`lg:max-xl:absolute lg:top-5.75 lg:right-5.75 cursor-default text-white text-3xl lg:py-2 hover:-translate-y-1 bg-yellow-500 transition-all duration-200 hover:bg-orange-600 ${item.quantity > 9 ? "px-1.5 lg:px-3" : `${((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading || refreshCartLoading) ? `px-2 lg:px-4` : `px-3 lg:px-5`}`} rounded-full font-extrabold`}>
                                                                
                                                                {
                                                                    ((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading || refreshCartLoading) ?
                                                                    
                                                                    (
                                                                        <div className={`flex items-center justify-center py-1.75 ${item.quantity > 9 ? `lg:px-1.25` : ``}`}>
                                                
                                                                            <Loader size="medium" color="border-white border-6" />
                                                
                                                                        </div>
                                                                    ) 
                                                                
                                                                    : 
                                                                    
                                                                    (
                                                                        item.quantity
                                                                    )
                                                                }
                                                                
                                                            </span>


                                                    </div>
                                                    
                                                
                                                    {/* Stock + Rating + Quantity control buttons */}
                                                                                    
                                                        <div className="flex-col pl-6 md:max-lg:mt-2 lg:mt-2">
                                                            
                                                    
                                                            <p className={`font-light text-sm`}>
                                                                                
                                                                {" "}
                                                        
                                                                {product.stock ? product.stock : ''} 
                                                                    
                                                                {product.stock ? (product.stock === 1) ? " UNIT" : " UNIT(S)" : ''}                                
                                                                    
                                                                {product.stock ? 'ㅤ•ㅤ' : ''}
                                                                
                                                                    
                                                                ⭐
                                                                    
                                                                {" "}
                                                        
                                                            
                                                                <span className="font-semibold">
                                                        
                                                                    {" "}
                                                        
                                                                    {formatRating(product.rating)}{" "}
                                                        
                                                                </span>
                                                                
                                                            
                                                                {" "}
                                                            
                                                            </p>
                                                            
                                                            
                                                            
                                                            {/* quantity controls */}
                                            
                                                            {/* buttons */}
                                                            
                                                                <div className="flex gap-5 lg:mt-6 justify-end items-center">
                                                                    
                                                                    
                                                                    <button
                                                                        
                                                                        className={`px-3 text-2xl lg:text-3xl cursor-pointer rounded-full font-semibold ${product.stock === 0 || clearCartLoading || placingOrderLoading || refreshCartLoading ? "bg-gray-300" : "bg-yellow-300 hover:bg-orange-600" }`}
                                                                        
                                                                        onClick=
                                                                        {
                                                                            async () => 
                                                                            {
                                                                                setUpdatingItemId(item.$id);
                                                                            
                                                                                await updateItem(item.$id, product.$id, 1);
                                                                            
                                                                                setUpdatingItemId(null);
                                                                            }
                                                                        }
                                                                        
                                                                        disabled={ product.stock === 0 || updatingItemId !== null || removingItemId !== null || clearCartLoading || refreshCartLoading || placingOrderLoading }
                                                                    >
                                                                    
                                                                        +
                                                                        
                                                                    </button>

                                                                    
                                                                    <button
                                                                        
                                                                        className={`px-3 text-2xl lg:text-3xl rounded-full cursor-pointer font-bold ${ item.quantity === 1 || clearCartLoading || placingOrderLoading || refreshCartLoading ? "bg-gray-300" : "bg-yellow-300 hover:bg-orange-600" }`}
                                                                        
                                                                        onClick=
                                                                        {
                                                                            async () =>
                                                                            {
                                                                                setUpdatingItemId(item.$id);
                                                                            
                                                                                await updateItem(item.$id, product.$id, -1);
                                                                            
                                                                                setUpdatingItemId(null);
                                                                            }
                                                                        }
                                                                        
                                                                        disabled={ item.quantity === 1 || updatingItemId !== null || removingItemId !== null || clearCartLoading || refreshCartLoading || placingOrderLoading }
                                                                    >
                                                                        
                                                                        −
                                                                        
                                                                    </button>

                                                                    

                                                                    {/* delete */}
                                                                    
                                                                        <button
                                                                            
                                                                            className={`py-0.75 px-1.25 cursor-pointer rounded-full ${ clearCartLoading || placingOrderLoading || refreshCartLoading ? "bg-gray-300" : "bg-red-400 hover:bg-red-500" }`}
                                                                            
                                                                            onClick=
                                                                            {
                                                                                async () =>
                                                                                {
                                                                                    setRemovingItemId(item.$id);
                                                                                
                                                                                    await removeItem(item.$id, product.$id);
                                                                                
                                                                                    setRemovingItemId(null);
                                                                            
                                                                                }
                                                                            }
                                                                            
                                                                            disabled={ removingItemId !== null || updatingItemId !== null || clearCartLoading || placingOrderLoading || refreshCartLoading }
                                                                        >
                                                                            
                                                                            <img
                                                                            
                                                                                src="/icons/delete.png"
                                                                                
                                                                                className="lg:w-8 w-6 mx-auto"
                                                                            />
                                                                        
                                                                        </button>
                                                                
                                                                
                                                                </div>
                                                            
                                                        
                                                        </div>
                                                    
                            
                                                
                                                    {/* price row */}
                                                    
                                                        <div className="flex justify-between lg:mt-6 md:mt-7">
                                                            
                                                    
                                                            <div className="flex gap-3">
                                                            
                                                        
                                                                {item.discount_value > 0 && (
                                                            
                                                                    <p className="text-gray-600 lg:text-[22px] font-mono">
                                                                    
                                                                        {formatPrice(
                                                                    
                                                                            product.price,
                                                                            
                                                                            product.currency,
                                                                            
                                                                            item.discount_value
                                                                        )}
                                                                        
                                                                    </p>
                                                                    
                                                                )}

                                                        
                                                                <p
                                                        
                                                                    className={`font-mono ${ item.discount_value ? "mt-1.5 line-through text-gray-400 text-md " : "text-gray-600 lg:text-[22px]" }`}
                                                                >
                                                                    
                                                                    {formatPrice(
                                                                    
                                                                        product.price,
                                                                        
                                                                        product.currency
                                                                    )}
                                                                    
                                                                </p>
                                                                
                                                        
                                                            </div>

                                                    
                                                            <p className="text-[18px] lg:text-[23px] text-gray-800 font-mono font-bold">
                                                    
                                                                {formatPrice(item.subtotal, product.currency)}
                                                                
                                                            </p>
                                                            
                                                    
                                                        </div>

                                                    
                                                </div>


                                        </div>

                                    );
                                })}
                                
                        
                            </div>
                        
                
                        {/* CHECKOUT SUMMARY CARD + BUTTONS */}
                        
                            <div className="lg:sticky lg:top-27 xl:top-33 lg:self-start sm:col-span-3 sm:flex sm:flex-col lg:items-stretch xl:col-span-3 2xl:col-span-3 grid grid-cols-5 sm:grid-cols-1 max-lg:border-b-4 pt-10 lg:pt-0">
                                
                            
                                {/* CHECKOUT SUMMARY CARD */}
                            
                                <div className="col-span-4 mb-5 hover:drop-shadow-2xl hover:-translate-y-1 transition-all duration-200">

                            
                                    <div className="border-4 bg-gray-50 border-yellow-500 rounded-2xl">

                                
                                        {/* Title */}
                                        
                                            <h2 className="text-3xl p-6 font-extrabold text-yellow-600 rounded-xl border-b-4 border-yellow-500 bg-yellow-200 mb-6 text-center">
                                        
                                                Order Summary
                                                
                                            </h2>

                                

                                        {/* Total Items + Subtotal */}
                                        
                                            <div className="flex justify-between text-xl font-bold mb-4 px-10">
                                            
                                                <span className="text-gray-700">Items:</span>
                                            
                                                <span className="text-orange-600">
                                                    

                                                    {
                                                        (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                        
                                                        (
                                                            <div className={`flex items-center justify-center`}>
                                    
                                                                <Loader size="medium" color="border-orange-600 border-4" />
                                    
                                                            </div>
                                                        ) 
                                                    
                                                        : 
                                                        
                                                        (
                                                            cartQuantity
                                                        )
                                                    }
                                                    
                                                    
                                                </span>
                                                
                                            </div>

                                    
                                            <div className="flex justify-between text-xl font-bold mb-6 px-10">
                                    
                                                <span className="text-gray-700">Subtotal:</span>
                                                
                                                <span className="text-orange-600">

                                        
                                                    {
                                                        (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                        
                                                        (
                                                            <div className={`flex items-center justify-center`}>
                                    
                                                                <Loader size="medium" color="border-orange-600 border-4" />
                                    
                                                            </div>
                                                        ) 
                                                    
                                                        : 
                                                        
                                                        (
                                                            formatPrice(cartTotal, "USD")
                                                        )
                                                    }

                                        
                                                </span>
                                                
                                            </div>

                                

                                        {/* SHIPPING OPTIONS */}
                                        
                                            <div className="mb-6 px-10">
                                        
                                        
                                                <p className="text-2xl font-extrabold text-yellow-600 mb-3">Shipping</p>

                                        
                                                <div className="space-y-3 text-lg text-gray-700 font-semibold pl-5">

                                            

                                                    {/* Standard Shipping */}
                                                    
                                                        <label className={`flex justify-between items-center ${(selectedShipping === "standard" ? `bg-gray-100` : `hover:bg-gray-100`)} cursor-pointer p-2 rounded-lg transition-all duration-200`}>
                                                            
                                                
                                                            <div>
                                                            
                                                                <input
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value="standard"
                                                                    checked={selectedShipping === "standard"}
                                                                    onChange={() => setSelectedShipping("standard")}
                                                                    className="mr-3"
                                                                />
                                                            
                                                                Standard (4–6 days)
                                                                
                                                            </div>

                                                
                                                            <span className="text-orange-600">
                                                
                                                                {formatPrice(4.99, "USD")}
                                                                
                                                            </span>
                                                            
                                                            
                                                        </label>

                                            

                                                    {/* Fast Shipping */}
                                                    
                                                        <label className={`flex justify-between items-center cursor-pointer ${(selectedShipping === "fast" ? `bg-gray-100` : `hover:bg-gray-100`)} p-2 rounded-lg transition-all duration-200`}>
                                                            
                                                
                                                            <div>
                                                            
                                                                <input
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value="fast"
                                                                    checked={selectedShipping === "fast"}
                                                                    onChange={() => setSelectedShipping("fast")}
                                                                    className="mr-3"
                                                                />
                                                            
                                                                Fast (2–3 days)
                                                                
                                                            </div>

                                                
                                                            <span className="text-orange-600">
                                                
                                                                {formatPrice(9.99, "USD")}
                                                                
                                                            </span>
                                                            
                                                            
                                                        </label>


                                            
                                                    {/* Express Delivery */}
                                                    
                                                        <label className={`flex justify-between items-center cursor-pointer ${(selectedShipping === "express" ? `bg-gray-100` : `hover:bg-gray-100`)} p-2 rounded-lg transition-all duration-200`}>
                                                            
                                                            
                                                            <div>
                                                            
                                                                <input
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value="express"
                                                                    checked={selectedShipping === "express"}
                                                                    onChange={() => setSelectedShipping("express")}
                                                                    className="mr-3"
                                                                />
                                                            
                                                                    Express (1 day)
                                                                    
                                                            </div>

                                                
                                                            <span className="text-orange-600">
                                                
                                                                {formatPrice(19.99, "USD")}
                                                                
                                                            </span>
                                                            
                                                            
                                                        </label>


                                                </div>
                                                
                                                
                                            </div>
                                            
                                            
                                    
                                        {/* ADDRESS */}
                                        
                                            <div className="flex justify-between lg:items-center font-bold mb-4 px-10">
                                            
                                                <span className="text-gray-700 text-xl md:max-lg:mr-17 lg:mr-15">Address:</span>
                                            
                                                <span className="text-orange-600">{profile.address}</span>
                                                
                                            </div>

                                    

                                        {/* TAX + FINAL TOTAL */}
                                        
                                            {(() => 
                                            {
                                                // Subtotal recalculated reliably from localCart
            
                                                    const subtotal = localCart.reduce((sum, item) => sum + item.subtotal, 0);

            
                                                const shippingCost = selectedShipping === "express" ? 19.99 : selectedShipping === "fast" ? 9.99 : 4.99;


                                                const tax = subtotal * 0.10;

                                                const finalTotal = subtotal + tax + shippingCost;


                                                                    
                                                return (
                                                    
                                                    <div className="bg-yellow-200 rounded-xl text-yellow-500 p-4 mt-6 px-10 border-t-4">
                                                        
                                                        
                                                        <div className="flex justify-between text-lg font-semibold mb-4 mt-2">
                                                            

                                                            <span className="text-gray-800 font-semibold">Tax (10%):</span>
                                                            
                                                            
                                                            <span className="text-orange-600">
                                                            
                                                                
                                                                {
                                                                    (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                                    
                                                                    (
                                                                        <div className={`flex items-center justify-center`}>
                                                
                                                                            <Loader size="medium" color="border-orange-600 border-4" />
                                                
                                                                        </div>
                                                                    ) 
                                                                
                                                                    : 
                                                                    
                                                                    (
                                                                        formatPrice(tax, "USD")
                                                                    )
                                                                }

                                                                
                                                            </span>


                                                        </div>

                                                        
                                                        <div className="flex justify-between text-2xl font-extrabold">
                                                            

                                                            <span className="text-yellow-600">Total:</span>
                                                            
                                                            
                                                            <span className="text-black font-extrabold">
                                                            
                                                                
                                                                {
                                                                    (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                                    
                                                                    (
                                                                        <div className={`flex items-center justify-center`}>
                                                
                                                                            <Loader size="large" color="border-black border-6" />
                                                
                                                                        </div>
                                                                    ) 
                                                                
                                                                    : 
                                                                    
                                                                    (
                                                                        formatPrice(finalTotal, "USD")
                                                                    )
                                                                }
                                                                {}

                                                                
                                                            </span>


                                                        </div>


                                                    </div>

                                                );
                                        
                                            })()}
                                            
                                            
                                    </div>
                                    
                            
                                </div>



                                {/* FOOTER */}
                                
                                    {cartQuantity > 0 && (
                                        
                                            <div className="max-lg:pl-2 max-lg:mb-10">

                                        
                                                {/* Buttons */}
                                                
                                                    <div className="grid gap-6 sm:grid-cols-7 sm:gap-2">

                                                        
                                                        {/* PLACE ORDER (placeholder — logic later) */}
                                            
                                                            <button
                                                                
                                                                className={`col-span-3 ${clearCartLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null ? `bg-gray-400 text-black` : `bg-yellow-500 text-white hover:bg-orange-600 hover:-translate-y-1`} transition-all duration-200 rounded-full py-2 font-extrabold`}
                                                                
                                                                onClick=
                                                                {
                                                                    async () => 
                                                                    {
                                                                        setPlacingOrderLoading(true);

                                                                        const orderId = await placeOrder(profile.address, selectedShipping);


                                                                        if (orderId)
                                                                        {
                                                                            navigate('/orders');
                                                                            
                                                                            // reset checkout state / justPlacedOrder after short delay
                                                                                
                                                                                setTimeout(() =>
                                                                                {
                                                                                    clearCheckoutFlag();
                                                                                
                                                                                    setJustPlacedOrder(false);
                                                                                    
                                                                                }, 200);
                                                                        }

                                                                        setPlacingOrderLoading(false);
                                                                    }
                                                                }
                                                                
                                                                disabled={ clearCartLoading || placingOrderLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null }
                                                            >
                                                                
                                                                {placingOrderLoading ? 
                                                                
                                                                    (
                                                                        <div className="flex justify-center">
                                                                    
                                                                            <Loader size="medium" color="border-white" />
                                                                            
                                                                        </div>
                                                                    ) 
                                                                    
                                                                    : 
                                                                    
                                                                    (
                                                                        "Place Order"
                                                                    )
                                                                }
                                                                
                                                            </button>


                                        
                                                        {/* CLEAR */}
                                                        
                                                            <button
                                                                
                                                                className={`${ clearCartLoading || placingOrderLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null ? "bg-gray-400 text-black" : "bg-red-600 text-white hover:-translate-y-1" } transition-all duration-200 rounded-full py-2 font-extrabold col-span-2`}
                                                                
                                                                onClick=
                                                                {
                                                                    async () =>
                                                                    {
                                                                        setClearCartLoading(true);
                                                                    
                                                                        await clearCart();

                                                                        clearCheckoutFlag();
                                                                    
                                                                        setClearCartLoading(false);
                                                                    }
                                                                }
                                                                
                                                                disabled={ clearCartLoading || placingOrderLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null }
                                                            >
                                                                
                                                                {clearCartLoading ? 
                                                                
                                                                    (
                                                                        <div className="flex justify-center">
                                                                    
                                                                            <Loader size="medium" color="border-white" />
                                                                            
                                                                        </div>
                                                                    ) 
                                                                    
                                                                    : 
                                                                    
                                                                    (
                                                                        "Clear"
                                                                    )
                                                                }
                                                                
                                                            </button>


                                        
                                                        {/* CANCEL CHECKOUT (placeholder — logic later) */}
                                            
                                                            <button
                                                                
                                                                className={`${ clearCartLoading || placingOrderLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null ? "bg-gray-400 text-black" : "bg-red-600 text-white hover:-translate-y-1" } col-span-2 transition-all duration-200 rounded-full py-2 font-extrabold`}
                                                                
                                                                onClick={() => {clearCheckoutFlag(); navigate(-1);}}
                                                                
                                                                disabled={ clearCartLoading || placingOrderLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null }
                                                            >
                                                                
                                                                Cancel
                                                                
                                                            </button>
                                                            
                                                            
                                                    </div>
                                            
                                    
                                            </div>

                                        
                                    )}


                            </div>
                    

                    </div>
                    
                
                </div>
        
        </>
        
    );
}