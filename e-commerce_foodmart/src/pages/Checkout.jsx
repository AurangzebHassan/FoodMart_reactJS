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
        return (

				<>
		
					<div className="dark:hidden md:flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">

						<span className="text-4xl font-extrabold text-white text-center"> Loading Checkout </span>

						
						<Loader size="xl" color="border-white border-9" />

						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

					</div>


					<div className="hidden dark:md:flex w-full h-screen items-center justify-center bg-gray-600 gap-2">

						<span className="text-4xl font-extrabold text-yellow-300 text-center"> Loading Checkout </span>

						
						<Loader size="xl" color="border-yellow-300 border-9" />

						<Loader size="large" color="border-yellow-300 border-7" />

						<Loader size="medium" color="border-yellow-300 border-6" />

					</div>



					

					
					<div className="flex md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-yellow-500 gap-2">

						<span className="text-xl font-extrabold text-white text-center"> Loading Checkout </span>

						
						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

						<Loader size="small" color="border-white border-5" />

					</div>


					<div className="hidden dark:flex dark:md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-gray-600 gap-2">

						<span className="text-xl font-extrabold text-yellow-300 text-center"> Loading Checkout </span>

						
						<Loader size="large" color="border-yellow-300 border-7" />

						<Loader size="medium" color="border-yellow-300 border-6" />

						<Loader size="small" color="border-yellow-300 border-5" />

					</div>
					
				</>
				
			);
    }






    return (

        <div className={`dark:bg-gray-600 ${(localCart.length === 1) ? `dark:md:max-lg:h-full dark:h-screen dark:max-md:fixed dark:max-md:inset-0` : ``} transition-all duration-200`}>
        
            <Navbar />

            

            {/* CONTAINER */}
            
                <div className="container mx-auto lg:mt-3 max-md:pb-3 md:max-lg:pb-5 md:py-3 px-5 flex-col">

                
                    {/* BACK + TITLE + REFRESH */}
                    
                        <div className="flex max-md:items-center mb-1 md:mb-10">
                    

                            {/* BACL BUTTON */}

                                <button
                                    
                                    // className="flex items-center justify-center w-22 max-md:h-5 md:w-30 md:px-4 md:py-1 text-black max-md:text-[12px] font-bold md:font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                                    
                                    onClick={() => navigate(-1)}
                                >
                                    
                                    {/* ← Back */}
                                    
                                    <img src="/icons/back.png" alt="back" className="dark:hidden w-8 md:w-12 hover:-translate-y-1 active:-translate-y-1 transition-all duration-150" title="Back" />

                                    <img src="/icons/dark_back.png" alt="back" className="hidden dark:flex w-8 md:w-12 hover:-translate-y-1 active:-translate-y-1 transition-all duration-150" title="Back" />
                                    
                                </button>

                    
                            {/* CHECKOUT HEADING */}
                             
                                <div className="w-full flex items-center justify-center">
                                    
                                    <h1 className="text-lg md:text-4xl text-yellow-500 dark:text-yellow-300 font-extrabold">
                                        
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
    
                                        <img src="/icons/refresh.png" alt="refresh" className="w-7 md:w-11" />
                                        
                                </button>

                    
                        </div>


                    
                    <div className="flex flex-col-reverse lg:grid lg:grid-cols-5 xl:grid-cols-7">
                        
                        
                        {/* CART ITEMS LIST */}
                    
                            <div className="max-md:mt-5.5 md:max-lg:mt-5 lg:col-span-2 xl:col-span-4 2xl:col-span-4 space-y-2 md:space-y-6 lg:mb-20 lg:pr-5">
                                
                                
                                {localCart.map((item) => 
                                {
                                    const product = item.product;
                                

                                    if (!product) return null;


                                    return (
                                        
                                        <div
                                            
                                            key={item.$id}
                                            
                                            className="relative border border-gray-50 dark:border-gray-500 bg-white dark:bg-gray-700 rounded-lg drop-shadow-lg hover:drop-shadow-2xl hover:-translate-y-1 active:drop-shadow-2xl active:-translate-y-1 transition-all duration-300 p-2 md:p-4 flex lg:max-xl:flex-col gap-2 md:gap-4"
                                        >
                                            
                                            {/* discount */}
                                            
                                                {item.discount_value > 0 && (
                                                    
                                                    <div className={`absolute ${(item.discount_value > 9.99) ? `max-md:bottom-3.25 left-3 md:left-65.25 md:top-34.5 lg:left-74 xl:left-49.5 xl:top-45 lg:top-42` : `max-md:bottom-3.25 left-3 md:left-66.75 md:top-34.5 lg:left-75.5 xl:left-52 xl:top-45.5 lg:top-41.75`} p-0.75 md:p-2 bg-green-700 hover:-translate-y-1 transition-all duration-200 text-white max-md:text-[7px] md:text-sm lg:text-md font-extrabold rounded-full`}>
                                                    
                                                        {product.discount_tag}
                                                        
                                                    </div>
                                                    
                                                )}

                                            

                                            {/* favourite heart */}
                                            
                                                <div
                                                    
                                                    className={`absolute top-2.75 ${(product.slug === 'fruita-vitals-orange-juice') ? `left-20.5`: `left-20.75`} md:top-6 md:left-6 bg-white dark:bg-gray-600 rounded-full p-1 md:p-2.5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200`}
                                                    
                                                    onClick={() => handleFavouriteClick(product.$id)}
                                                >
                                                    
                                                    <img
                                                        
                                                        src={isProductFavourite(product.$id) ? "/icons/heart.png" : "/icons/heart.svg"}
                                                        
                                                        className="dark:hidden flex w-3.5 md:w-6.5"
                                                    />


                                                    <img
                                                        
                                                        src={isProductFavourite(product.$id) ? "/icons/heart.png" : "/icons/dark_heart.png"}
                                                        
                                                        className="hidden dark:flex w-3.5 md:w-6.5"
                                                    />
                                                
                                                </div>


                                            
                                            {/* IMAGE */}
                                            
                                                <img
                                            
                                                    src={product.image_url}
                                                    
                                                    alt={product.name}
                                                    
                                                    className="max-md:w-25 max-md:h-25 lg:w-90 xl:w-60 lg:h-50 xl:h-52 md:h-41 md:w-75 rounded-lg object-contain cursor-pointer bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-600 hover:bg-gray-200 transtition-all duration-200"
                                                    
                                                    onClick={() => {!((updatingItemId) || (removingItemId) || clearCartLoading || refreshCartLoading) && handleProductClick(product)}}
                                                />

                                            

                                            {/* INFO */}
                                            
                                                <div className="flex-1 py-1">
                                                    
                                                    
                                                    <div className="flex items-center justify-between">
                                                        
                                                    
                                                        {/* PRODUCT NAME */}
                                                    
                                                            <p
                                                            
                                                                className="font-mono max-md:text-[10px] md:text-xl font-bold cursor-pointer text-gray-700 dark:text-gray-200 dark:hover:text-gray-300 hover:text-black"
                                                                
                                                                onClick={() => {!((updatingItemId) || (removingItemId) || clearCartLoading || refreshCartLoading) && handleProductClick(product)}}
                                                            >
                                                            
                                                                {product.name}

                                                            </p>
                                                        
                                                
                                                        {/* quantity badge */}
                                                            
                                                            <span className={`lg:max-xl:absolute lg:top-5.75 lg:right-5.75 cursor-default text-white dark:bg-yellow-300 dark:text-gray-600 max-md:text-[12px] md:text-3xl lg:py-2 hover:-translate-y-1 active:-translate-y-1 bg-yellow-500 transition-all duration-200 hover:bg-orange-600 active:bg-orange-600 dark:hover:bg-orange-400 dark:active:bg-orange-400 ${item.quantity > 9 ? "px-1.5 lg:px-3" : `${((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading || refreshCartLoading) ? `px-1.5 md:px-2 lg:px-4` : `px-2.25 md:px-3 lg:px-5`}`} rounded-full font-extrabold`}>
                                                                
                                                                {
                                                                    ((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading || refreshCartLoading) ?
                                                                    
                                                                    (
                                                                        <>
                                                                        
                                                                            <div className={`dark:hidden hidden md:flex items-center justify-center py-1.75 ${item.quantity > 9 ? `lg:px-1.25` : ``}`}>
                                                    
                                                                                <Loader size="medium" color="border-white border-6" />
                                                    
                                                                            </div>
                                                                            
                                                                            <div className={`dark:hidden md:hidden flex items-center justify-center ${item.quantity > 9 ? `max-md:py-px` : ``}`}>
                                                    
                                                                                <Loader size="small" color="border-white" />
                                                    
                                                                            </div>

                                                                        

                                                                            <div className={`hidden dark:md:flex items-center justify-center py-1.75 ${item.quantity > 9 ? `lg:px-1.25` : ``}`}>
                                                    
                                                                                <Loader size="medium" color="border-gray-600 border-6" />
                                                    
                                                                            </div>
                                                                            
                                                                            <div className={`hidden dark:md:hidden dark:flex items-center justify-center ${item.quantity > 9 ? `max-md:py-px` : ``}`}>
                                                    
                                                                                <Loader size="small" color="border-gray-600" />
                                                    
                                                                            </div>
                                                                    
                                                                        </>
                                                                    ) 
                                                                
                                                                    : 
                                                                    
                                                                    (
                                                                        item.quantity
                                                                    )
                                                                }
                                                                
                                                            </span>


                                                    </div>
                                                    
                                                
                                                    {/* Stock + Rating + Quantity control buttons */}
                                                                                    
                                                        <div className="flex-col pl-3 mt-1 md:mt-0 lg:mt-2">
                                                            
                                                    
                                                            <p className={`dark:md:text-gray-400 dark:max-md:text-gray-500 font-light max-md:text-[9px] md:text-sm`}>
                                                                                
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
                                                            
                                                                <div className="flex gap-3 md:gap-5 max-md:mt-2 md:mt-5.5 lg:mt-6 items-center">
                                                                    
                                                                    
                                                                    <button
                                                                        
                                                                        className={`px-1.75 md:px-3 max-md:text-[14px] md:text-2xl lg:text-3xl cursor-pointer rounded-full font-semibold ${product.stock === 0 || clearCartLoading || placingOrderLoading || refreshCartLoading ? "bg-gray-300" : "bg-yellow-300 hover:bg-orange-600 active:bg-orange-600" }`}
                                                                        
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
                                                                        
                                                                        className={`px-1.75 md:px-3 max-md:text-[14px] md:text-2xl lg:text-3xl rounded-full cursor-pointer font-bold ${ item.quantity === 1 || clearCartLoading || placingOrderLoading || refreshCartLoading ? "bg-gray-300" : "bg-yellow-300 hover:bg-orange-600 active:bg-orange-600" }`}
                                                                        
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
                                                                            
                                                                            className={`py-0.75 px-1.25 cursor-pointer rounded-full ${ clearCartLoading || placingOrderLoading || refreshCartLoading ? "bg-gray-300" : "bg-red-400 hover:bg-red-500 active:bg-red-500" }`}
                                                                            
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
                                                                                
                                                                                className="w-3.25 lg:w-8 md:w-6 mx-auto"
                                                                            />
                                                                        
                                                                        </button>
                                                                
                                                                
                                                                </div>
                                                            
                                                        
                                                        </div>
                                                    
                            
                                                
                                                    {/* price row */}
                                                    
                                                        <div className="flex justify-between mt-2 lg:mt-6 md:mt-4.75">
                                                            
                                                    
                                                            <div className="flex gap-1 md:gap-3">
                                                            
                                                        
                                                                {item.discount_value > 0 && (
                                                            
                                                                    <p className="text-gray-600 dark:text-gray-300 max-md:text-[11px] lg:text-[22px] font-mono">
                                                                    
                                                                        {formatPrice(
                                                                    
                                                                            product.price,
                                                                            
                                                                            product.currency,
                                                                            
                                                                            item.discount_value
                                                                        )}
                                                                        
                                                                    </p>
                                                                    
                                                                )}

                                                        
                                                                <p
                                                        
                                                                    className={`font-mono ${ item.discount_value ? "mt-0.75 md:mt-1 line-through text-gray-400 dark:text-gray-500 max-md:text-[9px] md:text-sm" : "text-gray-600 dark:text-gray-300 max-md:text-[11px] lg:text-[22px]" }`}
                                                                >
                                                                    
                                                                    {formatPrice(
                                                                    
                                                                        product.price,
                                                                        
                                                                        product.currency
                                                                    )}
                                                                    
                                                                </p>
                                                                
                                                        
                                                            </div>

                                                    
                                                            <p className="max-md:text-[11px] md:text-[18px] lg:text-[23px] text-gray-800 dark:text-white font-mono font-bold">
                                                    
                                                                {formatPrice(item.subtotal, product.currency)}
                                                                
                                                            </p>
                                                            
                                                    
                                                        </div>

                                                    
                                                </div>


                                        </div>

                                    );
                                })}
                                
                        
                            </div>
                        
                
                        {/* CHECKOUT SUMMARY CARD + BUTTONS */}
                        
                            <div className="lg:sticky lg:top-27 xl:top-33 lg:self-start col-span-3 flex-col lg:items-stretch xl:col-span-3 2xl:col-span-3 grid grid-cols-1 max-md:border-b-2 md:max-lg:border-b-4 max-md:pt-5 lg:pt-0">
                                
                            
                                {/* CHECKOUT SUMMARY CARD */}
                            
                                <div className="col-span-4 mb-3 md:mb-5 hover:drop-shadow-2xl hover:-translate-y-1 active:drop-shadow-2xl active:max-md:-translate-y-0.5 active:md:-translate-y-1 transition-all duration-200">

                            
                                    <div className="border-2 md:border-4 bg-gray-50 dark:bg-gray-600 border-yellow-500 dark:border-yellow-300 rounded-2xl">

                                
                                        {/* Title */}
                                        
                                            <h2 className="text-sm md:text-3xl p-5 md:p-6 font-extrabold text-yellow-600 dark:text-yellow-400 rounded-xl border-b-2 md:border-b-4 border-yellow-500 dark:border-yellow-300 bg-yellow-100 dark:bg-gray-700 md:bg-yellow-200 mb-4 md:mb-6 text-center">
                                        
                                                Order Summary
                                                
                                            </h2>

                                

                                        {/* Total Items + Subtotal */}
                                        
                                            <div className="flex items-center justify-between md:text-xl font-bold mb-2 md:mb-6 px-5 md:px-10">
                                            
                                                <span className="text-gray-700 dark:text-gray-400 max-md:text-[11px]">Items:</span>
                                            
                                                <span className="text-orange-600 dark:text-orange-400 max-md:text-[10px]">
                                                    

                                                    {
                                                        (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                        
                                                        (
                                                            <>
                                                                <div className={`dark:hidden hidden md:flex items-center justify-center`}>
                                        
                                                                    <Loader size="medium" color="border-orange-600 border-4" />
                                        
                                                                </div>
                                                        
                                                                
                                                                <div className={`dark:hidden flex md:hidden items-center justify-center`}>
                                    
                                                                    <Loader size="small" color="border-orange-600 border-1" />
                                    
                                                                </div>
                                                                
                                                        

                                                                <div className={`hidden dark:md:flex items-center justify-center`}>
                                        
                                                                    <Loader size="medium" color="border-orange-400 border-4" />
                                        
                                                                </div>
                                                        
                                                                
                                                                <div className={`hidden dark:flex dark:md:hidden items-center justify-center`}>
                                    
                                                                    <Loader size="small" color="border-orange-400 border-1" />
                                    
                                                                </div>
                                                        
                                                            </>
                                                        ) 
                                                    
                                                        : 
                                                        
                                                        (
                                                            cartQuantity
                                                        )
                                                    }
                                                    
                                                    
                                                </span>
                                                
                                            </div>

                                    
                                            {/* <div className="flex items-center justify-between md:text-xl font-bold mb-2 md:mb-6 px-5 md:px-10">
                                    
                                                <span className="text-gray-700 dark:text-gray-400 max-md:text-[11px]">Subtotal:</span>
                                                
                                                <span className="text-orange-600 dark:text-orange-400 max-md:text-[10px]">

                                        
                                                    {
                                                        (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                        
                                                        (
                                                             <>
                                                                <div className={`dark:hidden hidden md:flex items-center justify-center`}>
                                        
                                                                    <Loader size="medium" color="border-orange-600 border-4" />
                                        
                                                                </div>
                                                        
                                                                
                                                                <div className={`dark:hidden flex md:hidden items-center justify-center`}>
                                    
                                                                    <Loader size="small" color="border-orange-600 border-1" />
                                    
                                                                </div>
                                                                
                                                        

                                                                <div className={`hidden dark:md:flex items-center justify-center`}>
                                        
                                                                    <Loader size="medium" color="border-orange-400 border-4" />
                                        
                                                                </div>
                                                        
                                                                
                                                                <div className={`hidden dark:flex dark:md:hidden items-center justify-center`}>
                                    
                                                                    <Loader size="small" color="border-orange-400 border-1" />
                                    
                                                                </div>
                                                        
                                                            </>
                                                        ) 
                                                    
                                                        : 
                                                        
                                                        (
                                                            formatPrice(cartTotal, "USD")
                                                        )
                                                    }

                                        
                                                </span>
                                                
                                            </div> */}

                                

                                        {/* SHIPPING OPTIONS */}
                                        
                                            <div className="mb-2 md:mb-6 px-5 md:px-10">
                                        
                                        
                                                <p className="max-md:text-[11.5px] md:text-2xl font-extrabold text-yellow-600 dark:text-yellow-400 mb-1 md:mb-3">Shipping</p>

                                        
                                                <div className="md:space-y-3 max-md:text-[10px] md:text-lg text-gray-700 dark:text-gray-400 font-semibold pl-5">

                                            

                                                    {/* Standard Shipping */}
                                                    
                                                        <label className={`flex justify-between items-center ${(selectedShipping === "standard" ? `bg-gray-100 dark:bg-gray-700` : `hover:bg-gray-100 dark:hover:bg-gray-700`)} cursor-pointer p-2 rounded-lg transition-all duration-200`}>
                                                            
                                                
                                                            <div className="max-md:flex max-md:items-center">
                                                            
                                                                <input
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value="standard"
                                                                    checked={selectedShipping === "standard"}
                                                                    onChange={() => setSelectedShipping("standard")}
                                                                    className="mr-3 w-1.5 md:w-2.5 accent-orange-600 dark:accent-orange-400"
                                                                />
                                                            
                                                                Standard (4–6 days)
                                                                
                                                            </div>

                                                
                                                            <span className="text-orange-600 dark:text-orange-400">
                                                
                                                                {formatPrice(4.99, "USD")}
                                                                
                                                            </span>
                                                            
                                                            
                                                        </label>

                                            

                                                    {/* Fast Shipping */}
                                                    
                                                        <label className={`flex justify-between items-center cursor-pointer ${(selectedShipping === "fast" ? `bg-gray-100 dark:bg-gray-700` : `hover:bg-gray-100 dark:hover:bg-gray-700`)} p-2 rounded-lg transition-all duration-200`}>
                                                            
                                                
                                                            <div className="max-md:flex max-md:items-center">
                                                            
                                                                <input
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value="fast"
                                                                    checked={selectedShipping === "fast"}
                                                                    onChange={() => setSelectedShipping("fast")}
                                                                    className="mr-3 w-1.5 md:w-2.5 accent-orange-600 dark:accent-orange-400"
                                                                />
                                                            
                                                                Fast (2–3 days)
                                                                
                                                            </div>

                                                
                                                            <span className="text-orange-600 dark:text-orange-400">
                                                
                                                                {formatPrice(9.99, "USD")}
                                                                
                                                            </span>
                                                            
                                                            
                                                        </label>


                                            
                                                    {/* Express Delivery */}
                                                    
                                                        <label className={`flex justify-between items-center cursor-pointer ${(selectedShipping === "express" ? `bg-gray-100 dark:bg-gray-700` : `hover:bg-gray-100 dark:hover:bg-gray-700`)} p-2 rounded-lg transition-all duration-200`}>
                                                            
                                                            
                                                            <div className="max-md:flex max-md:items-center">
                                                            
                                                                <input
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value="express"
                                                                    checked={selectedShipping === "express"}
                                                                    onChange={() => setSelectedShipping("express")}
                                                                    className="mr-3 w-1.5 md:w-2.5 accent-orange-600 dark:accent-orange-400"
                                                                />
                                                            
                                                                    Express (1 day)
                                                                    
                                                            </div>

                                                
                                                            <span className="text-orange-600 dark:text-orange-400">
                                                
                                                                {formatPrice(19.99, "USD")}
                                                                
                                                            </span>
                                                            
                                                            
                                                        </label>


                                                </div>
                                                
                                                
                                            </div>
                                            
                                            
                                    
                                        {/* ADDRESS */}
                                        
                                            <div className="flex items-center justify-between lg:items-center font-bold mb-4 md:mb-4 px-5 md:px-10">
                                            
                                                <span className="text-gray-700 dark:text-gray-400 max-md:text-[11px] md:text-xl md:max-lg:mr-17 lg:mr-15">Address:</span>
                                            
                                                <span className="text-orange-600 dark:text-orange-400 max-md:text-[10px]">{profile.address}</span>
                                                
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
                                                    
                                                    <div className="bg-yellow-100 dark:bg-gray-700 md:bg-yellow-200 rounded-xl text-yellow-500 dark:text-yellow-300 p-2 md:p-4 mt-2 md:mt-6 px-5 md:px-10 border-t-3 md:border-t-4">
                                                        
                                                        
                                                        <div className="flex items-center justify-between md:text-xl font-bold mb-2 md:mb-4 mt-1 md:mt-2">
                                    
                                                            <span className="text-gray-800 dark:text-gray-200 max-md:text-[11.5px]">Subtotal:</span>
                                                            
                                                            <span className="text-red-600 dark:text-red-400 max-md:text-[10.5px]">

                                                    
                                                                {
                                                                    (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                                    
                                                                    (
                                                                        <>
                                                                            <div className={`dark:hidden hidden md:flex items-center justify-center`}>
                                                    
                                                                                <Loader size="medium" color="border-red-600 border-4" />
                                                    
                                                                            </div>
                                                                    
                                                                            
                                                                            <div className={`dark:hidden flex md:hidden items-center justify-center`}>
                                                
                                                                                <Loader size="small" color="border-red-600 border-1" />
                                                
                                                                            </div>
                                                                            
                                                                    

                                                                            <div className={`hidden dark:md:flex items-center justify-center`}>
                                                    
                                                                                <Loader size="medium" color="border-red-400 border-4" />
                                                    
                                                                            </div>
                                                                    
                                                                            
                                                                            <div className={`hidden dark:flex dark:md:hidden items-center justify-center`}>
                                                
                                                                                <Loader size="small" color="border-red-400 border-1" />
                                                
                                                                            </div>
                                                                    
                                                                        </>
                                                                    ) 
                                                                
                                                                    : 
                                                                    
                                                                    (
                                                                        formatPrice(cartTotal, "USD")
                                                                    )
                                                                }

                                                    
                                                            </span>
                                                            
                                                        </div>



                                                        <div className="flex justify-between md:text-lg font-bold mb-3 md:mb-6">
                                                            

                                                            <span className="text-gray-800 dark:text-gray-200 font-bold max-md:text-[11.5px]">Tax (10%):</span>
                                                            
                                                            
                                                            <span className="text-red-600 dark:text-red-400 max-md:text-[10.5px]">
                                                            
                                                                
                                                                {
                                                                    (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                                    
                                                                    (
                                                                        <>
                                                                            <div className={`dark:hidden hidden md:flex items-center justify-center`}>
                                                    
                                                                                <Loader size="medium" color="border-red-600 border-4" />
                                                    
                                                                            </div>
                                                                    
                                                                            
                                                                            <div className={`dark:hidden flex md:hidden items-center justify-center`}>
                                                
                                                                                <Loader size="small" color="border-red-600 border-1" />
                                                
                                                                            </div>
                                                                            
                                                                    

                                                                            <div className={`hidden dark:md:flex items-center justify-center`}>
                                                    
                                                                                <Loader size="medium" color="border-red-400 border-4" />
                                                    
                                                                            </div>
                                                                    
                                                                            
                                                                            <div className={`hidden dark:flex dark:md:hidden items-center justify-center`}>
                                                
                                                                                <Loader size="small" color="border-red-400 border-1" />
                                                
                                                                            </div>
                                                                    
                                                                        </>
                                                                    ) 
                                                                
                                                                    : 
                                                                    
                                                                    (
                                                                        formatPrice(tax, "USD")
                                                                    )
                                                                }

                                                                
                                                            </span>


                                                        </div>

                                                        

                                                        <div className="flex justify-between max-md:text-sm md:text-2xl font-extrabold">
                                                            

                                                            <span className="text-yellow-600 dark:text-yellow-400">Total:</span>
                                                            
                                                            
                                                            <span className="text-black dark:text-white font-extrabold">
                                                            
                                                                
                                                                {
                                                                    (updatingItemId || removingItemId || clearCartLoading || refreshCartLoading) ?
                                                                    
                                                                    (
                                                                        <>
                                                                            <div className={`dark:hidden hidden md:flex items-center justify-center`}>
                                                    
                                                                                <Loader size="large" color="border-black border-6" />
                                                    
                                                                            </div>
                                                                    
                                                                            
                                                                            <div className={`dark:hidden flex md:hidden items-center justify-center`}>
                                                
                                                                                <Loader size="medium" color="border-black border-5" />
                                                
                                                                            </div>
                                                                            
                                                                    

                                                                            <div className={`hidden dark:md:flex items-center justify-center`}>
                                                    
                                                                                <Loader size="large" color="border-white border-6" />
                                                    
                                                                            </div>
                                                                    
                                                                            
                                                                            <div className={`hidden dark:flex dark:md:hidden items-center justify-center`}>
                                                
                                                                                <Loader size="medium" color="border-white border-5" />
                                                
                                                                            </div>
                                                                    
                                                                        </>
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
                                        
                                            <div className="mb-5 md:max-lg:mb-10">

                                        
                                                {/* Buttons */}
                                                
                                                    <div className="grid md:gap-3 grid-cols-7 max-md:gap-1 max-md:text-[12px]">

                                                        
                                                        {/* PLACE ORDER (placeholder — logic later) */}
                                            
                                                            <button
                                                                
                                                                className={`col-span-3 ${clearCartLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null ? `bg-gray-400 text-black` : `bg-yellow-500 dark:bg-yellow-300 dark:text-gray-600 text-white hover:bg-orange-600 dark:hover:bg-orange-400 hover:-translate-y-1`} transition-all duration-200 rounded-full md:py-2 font-bold md:font-extrabold cursor-pointer`}
                                                                
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
                                                                        <>
                                                                            <div className="dark:hidden flex justify-center">
                                                                        
                                                                                <Loader size="medium" color="border-white" />
                                                                                
                                                                            </div>
                                                                            

                                                                            <div className="hidden dark:flex justify-center">
                                                                        
                                                                                <Loader size="medium" color="border-gray-600" />
                                                                                
                                                                            </div>
                                                                        </>
                                                                    ) 
                                                                    
                                                                    : 
                                                                    
                                                                    (
                                                                        "Place Order"
                                                                    )
                                                                }
                                                                
                                                            </button>


                                        
                                                        {/* CLEAR */}
                                                        
                                                            <button
                                                                
                                                                className={`${ clearCartLoading || placingOrderLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null ? "bg-gray-400 text-black" : "bg-red-600 text-white hover:-translate-y-1" } transition-all duration-200 rounded-full py-2 font-bold md:font-extrabold col-span-2 cursor-pointer`}
                                                                
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
                                                                
                                                                className={`${ clearCartLoading || placingOrderLoading || refreshCartLoading || updatingItemId !== null || removingItemId !== null ? "bg-gray-400 text-black" : "bg-red-600 text-white hover:-translate-y-1" } col-span-2 transition-all duration-200 rounded-full py-2 font-bold md:font-extrabold cursor-pointer`}
                                                                
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
        
        </div>
        
    );
}