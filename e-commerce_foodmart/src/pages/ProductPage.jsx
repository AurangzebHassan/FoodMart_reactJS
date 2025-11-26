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

import { ToggleFavourite } from "../appwrite/db";



export default function ProductPage()
{
    const { slug } = useParams(); // get product slug from URL
    

    const navigate = useNavigate();



    const [addToCartLoading, setAddToCartLoading] = useState(false);
    


    const { user } = useAuth();
    
    const { updateProductField, addItem, productsMap } = useCart(); // use CartContext for stock and cart operations


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
            
    
    
    const [isFavourite, setIsFavourite] = useState(liveProduct?.isFavourite || false);

    useEffect(() =>
    {
        if (liveProduct)
        {
            setIsFavourite(liveProduct.isFavourite || false);
        }

    }, [liveProduct]);





    // handle the product being made or removed as/from favourites/wishlist

        const handleFavouriteClick = async () =>
        {
            try
            {
                await ToggleFavourite(liveProduct.$id, isFavourite); // backend update
                
                updateProductField(liveProduct.$id, "isFavourite", !isFavourite); // global state
                
                setIsFavourite(!isFavourite); // local state to re-render this card
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
            
                <div className="flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">
                
                    <p className="text-3xl font-bold text-white text-center"> Loading Product </p>
                    
                    <Loader size="xl" color="border-white" />
                
                </div>
        
            );
        }

    
    
    
    
    
    // ------------------------------
        // JSX RENDER
    // ------------------------------
    
        return (
        <>
            <Navbar />

            <div className="container mx-auto mt-15 px-5">
            
                {/* Back Button */}
                
                    <button
                        
                        className="mb-15 flex items-center justify-center w-25 px-4 py-1 text-black font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                        
                        onClick={() => navigate(-1)}
                    >
                        ← Back

                    </button>

                    

                <div className="flex flex-col md:flex-row gap-10 xl:gap-0 lg:pl-22 lg:pr-10 xl:pr-20 2xl:pr-45">
                    
                    {/* LEFT SIDE — BIG IMAGE */}
                        
                        <div className="relative flex justify-center md:w-1/2">
                        
                            <img
                        
                                src={liveProduct.image_url}
                                
                                alt={liveProduct.name}
                                
                                className="relative w-full h-full max-w-md max-h-md bg-gray-200 rounded-xl shadow-lg object-cover"
                            />


                            {/* wishlist heart */}
    
                                <div

                                    className={`absolute top-2.5 right-3.5 xl:right-13.5 2xl:right-23.5 bg-white hover:-translate-y-0.5 p-3 rounded-full transition-all duration-200`}

                                    onClick={() => {handleFavouriteClick()}}
                                >

                                    <img

                                        src={isFavourite ? `/icons/heart.png` : `/icons/heart.svg`}
                                
                                        alt="wishlist"
                                        
                                        className="w-8"
                                    />
                                
                                </div>
                        
                            
                            {/* Discount Tag */}
                            
                                {formatDiscount(liveProduct.discount_tag) && 
                                
                                    (
                            
                                        <div className="absolute top-4 left-4.5 xl:left-14.5 2xl:left-24.5 bg-green-700 text-white hover:-translate-y-1 cursor-pointer transition-all duration-200 text-2xl font-extrabold px-3 py-1 rounded-xl">
                                        
                                            {liveProduct.discount_tag}
                                        
                                        </div>
                                
                                    )
                                }
                                
                        </div>

                        
                    {/* RIGHT SIDE — PRODUCT INFO */}
                    
                        <div className="md:w-1/2 flex flex-col mr-3">
                    
                            {/* Product Name */}
                    
                                <h1 className="md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-800">
                        
                                    {liveProduct.name}
                    
                                </h1>

                                
                            {/* Category */}
                    
                                {category && 
                                
                                    (
                                    
                                        <div
                                    
                                            className="flex md:text-md lg:text-lg xl:text-xl 2xl:text-2xl mt-2 lg:mt-4 gap-2 text-yellow-600 font-semibold cursor-pointer hover:underline"
                                    
                                            onClick={() => navigate(`/category/${category.slug}`)}
                                        >
                                        
                                            <img
                                        
                                                src={category.image_url}
                                            
                                                alt={category.name}
                                            
                                                className="lg:w-7 md:w-5"
                                            />
                                        
                                            {category.name}
                                    
                                        </div>
                                    
                                    )
                                }

                                
                            {/* Stock + Rating */}
                                
                                <p className={`font-extralight text-sm text-left w-full mt-6 xl:mt-8`}>
                                                    
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
                
                                <p className={`text-yellow-600 ${!liveProduct.stock ? `md:text-sm md:leading-7 lg:text-[16px] lg:leading-9 xl:text-lg xl:leading-11` : `md:text-sm xl:text-lg lg:leading-7 xl:leading-9 2xl:leading-11`} mt-6 text-justify`}>
                                    
                                    {liveProduct.description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia possimus quae earum, accusantium vitae saepe provident itaque dolorum optio et."}
                                    
                                </p>

                                
                            {/* Price */}
                    
                                {
                                    (!!liveProduct.stock) && 
                                    
                                    (
                                        <div className={`flex gap-2 items-center`}>
                            
                                            <p className={`font-bold font-mono text-3xl lg:text-4xl xl:text-5xl mt-8`}>
                                    
                                                {" "}
                                    
                                                
                                                {formatPrice(liveProduct.price, liveProduct.currency, liveProduct.discount_tag)}
                                                
        
                                                {" "}
                                    
                                            
                                            </p>
                                    
                                            {formatDiscount(liveProduct.discount_tag) && (
                                    
                                                <p className="text-gray-500 mt-9 text-left font-bold text-xl xl:text-2xl line-through font-mono">
                                        
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
                                    <p className="mt-12 xl:mt-16 2xl:mt-20 text-center text-3xl lg:text-4xl xl:text-5xl italic"> 𝑂𝑢𝑡 𝑜𝑓 𝑆𝑡𝑜𝑐𝑘 </p>
                                )
                            }

                            
                            {/* Counter + Add to Cart */}
                    
                                {
                                    (!!liveProduct.stock) && 
                                    
                                    (
                                        <div className="flex justify-between mt-6 lg:mt-8">

                                            {/* counter */}

                                                <div className="flex items-center gap-6 lg:gap-8 xl:gap-10">

                                                    <button

                                                        className={`flex cursor-pointer justify-center items-center bg-gray-200 ${((quantity === liveProduct.stock) || addToCartLoading) ? `` : `hover:bg-gray-300`} w-8 lg:w-11 xl:w-14 2xl:h-11 font-extrabold rounded-md text-md`}

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

                                            
                                                    <span className="font-mono text-xl lg:text-2xl cursor-default">{quantity}</span>

                                            
                                                    <button
                                                
                                                        className={`flex cursor-pointer justify-center items-center bg-gray-200 ${((quantity === 0) || addToCartLoading) ? `` : `hover:bg-gray-300`} w-8 lg:w-11 xl:w-14 2xl:h-11 font-extrabold rounded-md text-md`}

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
                                    
                                                    className={`font-semibold text-xl lg:text-2xl xl:text-3xl ${quantity ? "text-gray-500 hover:text-gray-600 cursor-pointer" : "text-gray-400"}`}
                                            
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
                                                                
                                                                <Loader size="large" color="border-yellow-500" />
                                    
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
                
            </div>
        </>
        );
}