import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { getAllProducts, getAllCategories, incrementProductViewCount, incrementProductCartAddCount } from "../appwrite/db";

import { useAuth } from "../context/AuthContext";

import { useCart } from "../context/CartContext";

import { formatPrice } from "../utils/formatPrice";

import { formatRating } from "../utils/formatRating";

import { formatDiscount } from "../utils/formatDiscount";

import Loader from "../components/Loader";



export default function ProductPage()
{
    const { slug } = useParams(); // get product slug from URL
    

    const navigate = useNavigate();



    const [addToCartLoading, setAddToCartLoading] = useState(false);
    


    const { user } = useAuth();
    
    const { addItem, productsMap, isProductFavourite, toggleProductFavourite, cartItems } = useCart(); // use CartContext for stock and cart operations


    const [product, setProduct] = useState(null); // original product fetched from DB
    
    const [category, setCategory] = useState(null);
    
    const [quantity, setQuantity] = useState(0); // counter for add to cart



    // ------------------------------
        // FETCH PRODUCT + CATEGORY
    // ------------------------------
        
        useEffect(() =>
        {
            async function fetchProduct()
            {
                // fetch all products and find the one with matching slug
            
                    const products = await getAllProducts();
            
                    const prod = products.find((p) => p.slug === slug);

            
                if (!prod)
                {
                    navigate("/"); // redirect if product not found
            
                    return;
                }

            
                setProduct(prod); // store product in local state

            
                // increment product views
            
                    await incrementProductViewCount(prod.$id);

            
                // fetch category of this product
            
                    const categories = await getAllCategories();
            
                    const cat = categories.find((c) => c.$id === prod.category_id);
            
            
                setCategory(cat || null);
        }

            fetchProduct();
            
        }, [slug, navigate]);


    
    // ------------------------------
        // LIVE PRODUCT FROM CART CONTEXT
    // ------------------------------
    
        // Always use the freshest stock and data from CartContext
        
            const liveProduct = productsMap[product?.$id] || product;
 


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

    
    
    // ------------------------------
        // ADD TO CART HANDLER
    // ------------------------------
        
        const handleAddToCart = async () =>
        {
            if (!user)
            {
                alert("You need to log in first.");
            
                return;
            }
        
        
            if (quantity < 1) return;

        
            try
            {
                // CartContext handles stock deduction and DB updates
            
                    await addItem(liveProduct.$id, quantity);

            
                // increment trending/cart analytics
            
                    await incrementProductCartAddCount(liveProduct.$id);

            
                // alert(`${quantity}× ${liveProduct.name} added to cart!`);
            
            
                setQuantity(0); // reset counter; stock will auto-sync
            }
            
            catch (error)
            {
                console.error("Failed to add to cart:", error);
            }
        };


    
    // ------------------------------
        // LOADING STATE
    // ------------------------------
   
         if (!liveProduct || !category?.image_url)
        {
             return (

				<>
		
					<div className="dark:hidden md:flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">

						<span className="text-4xl font-extrabold text-white text-center"> Loading Product </span>

						
						<Loader size="xl" color="border-white border-9" />

						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

					</div>


					<div className="hidden dark:md:flex w-full h-screen items-center justify-center bg-gray-600 gap-2">

						<span className="text-4xl font-extrabold text-yellow-300 text-center"> Loading Product </span>

						
						<Loader size="xl" color="border-yellow-300 border-9" />

						<Loader size="large" color="border-yellow-300 border-7" />

						<Loader size="medium" color="border-yellow-300 border-6" />

					</div>



					

					
					<div className="flex md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-yellow-500 gap-2">

						<span className="text-xl font-extrabold text-white text-center"> Loading Product </span>

						
						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

						<Loader size="small" color="border-white border-5" />

					</div>


					<div className="hidden dark:flex dark:md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-gray-600 gap-2">

						<span className="text-xl font-extrabold text-yellow-300 text-center"> Loading Product </span>

						
						<Loader size="large" color="border-yellow-300 border-7" />

						<Loader size="medium" color="border-yellow-300 border-6" />

						<Loader size="small" color="border-yellow-300 border-5" />

					</div>
					
				</>
				
			);
        }
        
    
    
    
    
    
    // we'll use this to set custom add to cart buttons to indicate if product is already in cart or not
        
            const isInCart = cartItems.some(item => item.product_id === liveProduct.$id);

    
    
    
    
    
    // ------------------------------
        // JSX RENDER
    // ------------------------------
    
        return (
        <div className="dark:bg-gray-600 dark:h-screen dark:max-md:fixed dark:max-md:inset-0">
            
            <Navbar />

            <div className="container mx-auto mt-4 lg:mt-10 px-5">
            
                {/* Back Button */}
                
                    <button
                        
                        // className="mb-5 md:mb-15 flex items-center justify-center w-16 max-md:h-7 md:w-25 md:px-4 md:py-1 text-black max-md:text-[14px] font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                        
                        onClick={() => navigate(-1)}
                    >
                        {/* ← Back */}

                        <img src="/icons/back.png" alt="back" className="mb-2 md:mb-5 w-8 md:w-12 hover:-translate-y-1 active:-translate-y-1 transition-all duration-150" title="Back" />

                    </button>

                    

                <div className="flex flex-row gap-2 md:gap-10 xl:gap-0 lg:pl-22 lg:pr-10 xl:pr-20 2xl:pr-45">
                    
                    {/* LEFT SIDE — BIG IMAGE */}
                        
                        <div className="relative flex justify-center w-1/2">
                        
                            <img
                        
                                src={liveProduct.image_url}
                                
                                alt={liveProduct.name}
                                
                                className="relative w-full h-full max-w-md max-h-md bg-gray-200 dark:bg-gray-400 rounded-xl shadow-lg object-cover"
                            />


                            {/* wishlist heart */}
    
                                <div

                                    className={`absolute top-1.5 right-2.25 md:top-2.5 md:right-3.5 xl:right-13.5 2xl:right-23.5 bg-white dark:bg-gray-600 hover:-translate-y-0.5 p-1.5 md:p-3 rounded-full transition-all duration-200`}

                                    onClick={() => {handleFavouriteClick()}}
                                >

                                    <img

                                        src={isProductFavourite(liveProduct.$id) ? `/icons/heart.png` : `/icons/heart.svg`}
                                
                                        alt="wishlist"
                                        
                                        className="w-5 md:w-8"
                                    />
                                
                                </div>
                        
                            
                            {/* Discount Tag */}
                            
                                {formatDiscount(liveProduct.discount_tag) && 
                                
                                    (
                            
                                        <div className="absolute top-2.5 left-2.25 md:top-4 md:left-4.5 xl:left-14.5 2xl:left-24.5 bg-green-700 text-white hover:-translate-y-1 cursor-pointer transition-all duration-200 max-md:text-[10px] md:text-2xl font-extrabold max-md:p-1 md:px-3 md:py-1 rounded-xl">
                                        
                                            {liveProduct.discount_tag}
                                        
                                        </div>
                                
                                    )
                                }
                                
                        </div>

                        
                    {/* RIGHT SIDE — PRODUCT INFO */}
                    
                        <div className="w-1/2 flex flex-col md:mr-3">
                    
                            {/* Product Name */}
                    
                                <h1 className="max-md:text-[13px] md:max-lg:text-[27.75px] lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-800 dark:text-white">
                        
                                    {liveProduct.name}
                    
                                </h1>

                                
                            {/* Category */}
                    
                                {category && 
                                
                                    (
                                    
                                        <div
                                    
                                            className="flex max-md:text-[8.5px] md:max-lg:text-md lg:text-lg xl:text-xl 2xl:text-2xl mt-2 md:mt-2 lg:mt-4 gap-0.5 md:gap-2 text-yellow-600 dark:text-yellow-300 font-semibold cursor-pointer hover:underline"
                                    
                                            onClick={() => navigate(`/category/${category.slug}`)}
                                        >
                                        
                                            <img
                                        
                                                src={category.image_url}
                                            
                                                alt={category.name}
                                            
                                                className="max-md:w-4 lg:w-7 md:w-5"
                                            />
                                        
                                            {category.name}
                                    
                                        </div>
                                    
                                    )
                                }

                                
                            {/* Stock + Rating */}
                                
                                <p className={`dark:text-gray-300 font-extralight max-md:text-[9px] md:text-sm text-left w-full mt-3 md:mt-6 xl:mt-8 max-md:ml-4.5`}>
                                                    
                                    {" "}
                            
                                    {liveProduct.stock ? liveProduct.stock : ''} 
                                        
                                    {liveProduct.stock ? (liveProduct.stock === 1) ? " UNIT" : " UNIT(S)" : ''}                                
                                        
                                    {liveProduct.stock ? 'ㅤ•ㅤ' : ''}
                                    
                                        
                                    ⭐
                                        
                                    {" "}
                            
                                
                                    <span className="font-semibold">
                            
                                        {" "}
                            
                                        {formatRating(liveProduct.rating)}{" "}
                            
                                    </span>
                                    
                                
                                    {" "}
                                
                                </p>

                                
                            {/* Description */}
                
                                <p className={`text-yellow-600 dark:text-yellow-300 ${!liveProduct.stock ? `max-md:text-[8.5px] md:text-sm md:leading-7 lg:text-[16px] lg:leading-9 xl:text-lg xl:leading-11` : `max-md:text-[8.5px] md:text-sm xl:text-lg lg:leading-7 xl:leading-9 2xl:leading-11`} mt-3 md:mt-6 text-justify`}>
                                    
                                    {liveProduct.description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia possimus quae earum, accusantium vitae saepe provident itaque dolorum optio et."}
                                    
                                </p>

                                
                            {/* Price */}
                    
                                {
                                    (!!liveProduct.stock) && 
                                    
                                    (
                                        <div className={`flex gap-1 md:gap-2 items-center max-md:mt-3`}>
                            
                                            <p className={`dark:text-white font-bold font-mono text-lg md:text-3xl lg:text-4xl xl:text-5xl md:mt-8`}>
                                    
                                                {" "}
                                    
                                                
                                                {formatPrice(liveProduct.price, liveProduct.currency, liveProduct.discount_tag)}
                                                
        
                                                {" "}
                                    
                                            
                                            </p>
                                    
                                            {formatDiscount(liveProduct.discount_tag) && (
                                    
                                                <p className="text-gray-500 dark:text-gray-400 mt-1 md:mt-9 text-left font-bold max-md:text-[11px] md:text-xl xl:text-2xl line-through font-mono">
                                        
                                                    {formatPrice(liveProduct.price, "USD")}
                                    
                                                </p>
                                            )}
                                
                                        </div>
                                    )
                                }
                                
                                
                            {/* OUT OF STOCK */}
                        
                            {
                                !liveProduct.stock && 
                                
                                (
                                    <p className="dark:text-white mt-3 md:mt-8 xl:mt-16 2xl:mt-20 text-center text-lg md:text-3xl lg:text-4xl xl:text-5xl italic"> 𝑂𝑢𝑡 𝑜𝑓 𝑆𝑡𝑜𝑐𝑘 </p>
                                )
                            }

                            
                            {/* Counter + Add to Cart */}
                    
                                {
                                    (!!liveProduct.stock) && 
                                    
                                    (
                                        <div className="flex justify-between mt-3 md:mt-6 lg:mt-8">

                                            {/* counter */}

                                                <div className="flex items-center gap-2 md:gap-6 lg:gap-8 xl:gap-10">

                                                    <button

                                                        className={`flex cursor-pointer justify-center items-center bg-gray-200 dark:bg-gray-500 ${((quantity === liveProduct.stock) || addToCartLoading) ? `` : `dark:hover:bg-gray-700 dark:active:bg-gray-700 dark:hover:text-white dark:active:text-white active:bg-gray-200 hover:bg-gray-300`} w-6 max-md:h-5 md:w-8 lg:w-11 xl:w-14 2xl:h-11 font-extrabold rounded-md text-md`}

                                                        disabled={(quantity === liveProduct.stock) || addToCartLoading}
                                                
                                                        onClick={() =>
                                                        {
                                                            if (quantity < liveProduct.stock)
                                                            {
                                                                setQuantity(quantity + 1);
                                                            }
                                                        }}
                                                    >
                                                
                                                        {" "}
                                                            
                                                        +
                                                        
                                                        {" "}
                                            
                                                    </button>

                                            
                                                    <span className="dark:text-white font-mono md:text-xl lg:text-2xl cursor-default">{quantity}</span>

                                            
                                                    <button
                                                
                                                        className={`flex cursor-pointer justify-center items-center bg-gray-200 dark:bg-gray-500 ${((quantity === 0) || addToCartLoading) ? `` : `dark:hover:bg-gray-700 dark:active:bg-gray-700 dark:hover:text-white dark:active:text-white active:bg-gray-200 hover:bg-gray-300`} w-6 max-md:h-5 md:w-8 lg:w-11 xl:w-14 2xl:h-11 font-extrabold rounded-md text-md`}

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
                                    
                                                    className={`font-semibold max-md:text-[13px] md:text-xl lg:text-2xl xl:text-3xl ${quantity ? "text-gray-500 hover:text-gray-600 cursor-pointer" : "text-gray-400"}`}
                                            
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
                                                            <>
                                                                <div className="dark:hidden hidden md:flex items-center justify-center">
                                                                    
                                                                    <Loader size="large" color="border-yellow-500" />
                                        
                                                                </div>
                                                                
                                                                
                                                                <div className="dark:hidden dark:md:flex items-center justify-center">
                                                                    
                                                                    <Loader size="large" color="border-yellow-300" />
                                        
                                                                </div>
                                                                
                                                            

                                                            


                                                                <div className="dark:hidden flex md:hidden items-center justify-center">
                                                                        
                                                                        <Loader size="medium" color="border-yellow-500" />
                                        
                                                                </div>


                                                                <div className="dark:flex dark:md:hidden items-center justify-center">
                                                                        
                                                                        <Loader size="medium" color="border-yellow-300" />
                                        
                                                                </div>
                                                            </>
                                                        )         
                                                
                                                        :
                                                
                                                        (
                                                            <img src={isInCart ? `/icons/again-add-to-cart.png` : `/icons/add-to-cart.png`} title={isInCart ? `Again add to cart` : `Add to cart`} alt="Add to Cart" className="w-5 md:w-8 hover:-translate-y-1 active:-translate-y-1 cursor-pointer transition-all duration-200" />
                                                        )
                                                    }
                                            
                                                </button>
                    
                                        </div>
                                    )
                                }
                    </div>
                </div>
                
            </div>
        </div>
        );
}