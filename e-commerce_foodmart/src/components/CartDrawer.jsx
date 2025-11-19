import { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";

import { getCartItems, addOrUpdateCartItem, removeCartItem, clearUserCart, getAllProducts } from "../appwrite/db.js"; 

import { formatPrice } from "../utils/formatPrice";

import { formatDiscount } from "../utils/formatDiscount.js";



export default function CartDrawer({ onClose, onCartChange })
{
    // ✅ We use AuthContext to get the current user.

    // user.$id is needed to query cart documents.

    // Only need `user` for querying cart items. `profile` is optional if you want to show user info in the drawer.
    
        const { user } = useAuth();
        
    
    
    // ⭐ Cart state
    
        // cart items fetched from appwrite cart collection
        
            const [cartItems, setCartItems] = useState([]); // stores cart documents
        
    
        // Used so we can easily display product name, price, image without storing snapshots in cart (avoids duplication)

            const [productsMap, setProductsMap] = useState({}); // map product_id -> product info
        
    
        const [loading, setLoading] = useState(true); // loading state for fetching cart





    // ⭐ state to control slide in/out animation visibility
  
      const [isVisible, setIsVisible] = useState(false);

    
    // ⭐ when mounted, trigger slide-in animation
  
        useEffect(() =>
        {
            // prevents the body from scrolling when drawer is open

                document.body.style.overflow = "hidden";

            
            // Added slight delay for smoother entry animation (same 10ms)

                setTimeout(() => setIsVisible(true), 10);
                
            
            // restore scroll on unmount like MenuDrawer
        
                return () => document.body.style.overflow = "";
        },
            
            []

        );

     
    // ⭐ handle close with animation delay
  
        const handleClose = () =>
        {
            setIsVisible(false);
        
            setTimeout(() => onClose(), 200); // wait for animation to end before removing from DOM
        };
    
    
    
    // Now clicking outside the drawer closes it (like MenuDrawer)

        const handleOverlayClick = (e) =>
        {
            // ensure we only close if clicking *outside* the drawer
        
                if (e.target === e.currentTarget) handleClose();
        };
    
    
    
    
    
    
    // ------------------- Fetch Cart Items + Product Info -------------------
    
        useEffect(() =>
        {
            if (!user) return; // safety: only fetch if user is logged in


            const fetchCartAndProducts = async () =>
            {
                try
                {
                    setLoading(true);


                    // 1️⃣ Fetch all cart items for the user
                    
                        const cartDocs = await getCartItems(user.$id);
                    
                        // Example cartDocs:
                    
                            // [{ $id: "cart_123", user_id: "usr_001", product_id: "prod_101", quantity: 2 }, ...]
                    
                    
                        // Sort by most recently added item FIRST

                            const sortedCartDocs = [...cartDocs].sort(
                                (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
                            );

                            // Replace previous setCartItems(cartDocs)
                            setCartItems(sortedCartDocs);


                    // 2️⃣ Extract unique product_ids from cart
                    
                        const productIds = [...new Set(sortedCartDocs.map(c => c.product_id))];

                        if (productIds.length === 0)
                        {
                            // Cart is empty → nothing to fetch
                        
                            setProductsMap({});
                        
                            setLoading(false);
                        
                            return;
                        }

                    
                    // 3️⃣ Fetch all products from DB
                    
                    // Could also filter by productIds only, but here we fetch all and map for simplicity
                    
                        const products = await getAllProducts(); 
                        
                        const map = {};
                        
                        products.forEach(
                            
                            p =>
                            {
                                if (productIds.includes(p.$id)) map[p.$id] = p;
                            }
                        );

                        // ✅ productsMap: product_id -> product info
                        
                        // Example: { "prod_101": { name: "Heinz Ketchup", price: 18, image_url: "...", ... }, ... }
                        
                        setProductsMap(map);

                        setLoading(false);
                } 
                
                catch (err)
                {
                    console.error("Failed to fetch cart/products:", err);
                
                    setLoading(false);
                }
            };


            fetchCartAndProducts();


        }, [user]);
    
    
    
    
    
    
    // ------------------- Update Cart Quantity -------------------
    
    const handleUpdateQuantity = async (cartItemId, productId, qtyChange) =>
    {
        try
        {
            // Find current cart item in state
        
                const cartItem = cartItems.find(item => item.$id === cartItemId);
            
            
            if (!cartItem) return;


            const newQty = cartItem.quantity + qtyChange;
            
            if (newQty < 1) return; // don't allow zero or negative quantities


            // 1️⃣ Update cart in Appwrite DB
            
            // qtyChange is +1 or -1; addOrUpdateCartItem increments/decrements in DB
            
                await addOrUpdateCartItem(user.$id, productId, qtyChange);

            
            // 2️⃣ Update local state immediately for fast UI feedback
            
                setCartItems(
                    
                    prev => prev.map(
                        
                        item =>
                    
                            item.$id === cartItemId ? { ...item, quantity: newQty } : item
                    )
                );
            
            
            onCartChange();
        } 
        
        catch (err)
        {
            console.error("Failed to update cart quantity:", err);
        }
    };



    // ------------------- Remove Item -------------------
    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId); // remove from Appwrite DB
            setCartItems(prev => prev.filter(item => item.$id !== cartItemId)); // update UI

            onCartChange();
        } catch (err) {
            console.error("Failed to remove cart item:", err);
        }
    };

    // ------------------- Checkout -------------------
    const handleCheckout = async () => {
        try {
            await clearUserCart(user.$id); // delete all cart docs in Appwrite
            setCartItems([]); // clear local state

            onCartChange();
            alert("Checkout successful! Cart cleared.");
        } catch (err) {
            console.error("Checkout failed:", err);
        }
    };

    // ------------------- Calculate Totals -------------------
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const totalBill = cartItems.reduce((sum, item) => {
        const product = productsMap[item.product_id]; // map cart item → product
        return product ? sum + product.price * item.quantity : sum;
    }, 0);



    // ------------------- Loading State -------------------
    
        // if (loading) return <p className="text-center mt-4">Loading cart...</p>;
        
    
            if (loading) {
                    
                return (
                        <div
                            className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
                                isVisible ? "opacity-100" : "opacity-0"
                            }`}
                            onClick={handleOverlayClick}
                        >
                            <div
                                className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${
                                    isVisible ? "translate-x-0" : "translate-x-full"
                                }`}
                            >
                                <div className="flex h-screen justify-center items-center text-4xl text-yellow-500 font-bold">Loading...</div>
                            </div>
                        </div>
                );
            }

    
    
    
    
    
    return (
        <div
            className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleOverlayClick}
        >
            <div
                className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Close button */}
                <div className="flex justify-center">
                    <button onClick={handleClose} className="text-gray-600 hover:text-gray-900 text-6xl">
                        &times;
                    </button>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-10 mt-4">
                    <h1 className="text-3xl font-extrabold text-yellow-500">Your Cart</h1>
                    <span className={`text-white text-[25px] bg-yellow-500 px-3 rounded-full font-bold mt-1`}>
                        {totalQuantity}
                    </span>
                </div>

                {/* Cart Items */}
                <div className="flex-1 [&::-webkit-scrollbar]:hidden overflow-y-scroll space-y-2">
                    {cartItems.map(item => {
                        const product = productsMap[item.product_id]; // get product info from map
                        if (!product) return null; // skip if product not found

                        return (
                            <div key={item.$id} className="relative flex gap-3 border-b py-4">

                                {
                                    formatDiscount(product.discount_tag) && 
                                    
                                    ( 
                                        <div className={`absolute top-32 ${product.price > 9.99 ? `left-54 px-1.5` : `left-52 px-3`} bg-green-700 text-white font-bold text-sm cursor-pointer hover:-translate-y-1 p-1 rounded-xl transition-all duration-300`}> 
                                    
                                            {product.discount_tag}
                                
                                        </div> 
                                    )
                                }

                                {/* Product image */}
                                <img src={product.image_url} alt={product.name} className="w-20 h-25 rounded-lg object-cover" />

                                {/* Product details */}
                                <div className="flex-1">
                                    {/* Name + Quantity */}
                                    <div className="flex justify-between items-center">
                                        <p className="font-mono text-lg text-gray-800 font-semibold mt-1">{product.name}</p>
                                        <div className="flex items-center gap-2 ml-11 mt-1">
                                            
                                            <div className="flex-col mt-0.5">

                                                <button
                                                    className={`flex mb-1 ${item.quantity === product.stock ? `bg-gray-300` : `bg-yellow-300 hover:bg-orange-600`} cursor-pointer justify-center items-center w-5 h-5 font-bold rounded-md text-sm`}
                                                    onClick={() => handleUpdateQuantity(item.$id, item.product_id, 1)}
                                                    disabled={item.quantity === product.stock ? true : false}

                                                >
                                                    +
                                                </button>
                                                
                                                <button
                                                    className={`flex mb-1 ${item.quantity === 1 ? `bg-gray-300` : `bg-yellow-300 hover:bg-orange-600`} cursor-pointer justify-center items-center w-5 h-5 font-bold rounded-md text-sm`}
                                                    onClick={() => handleUpdateQuantity(item.$id, item.product_id, -1)}
                                                    disabled={item.quantity === 1 ? true : false}
                                                >
                                                    −
                                                </button>


                                                <button
                                                className="flex justify-center items-center rounded-md w-5 h-5 cursor-pointer bg-red-400 hover:bg-red-500"
                                                onClick={() => handleRemoveItem(item.$id)}
                                                >
                                                    <img
                                                        
                                                        src="/icons/delete.png"
                                                        
                                                        alt="delete"

                                                        className=""
                                                    />
                                                </button>

                                            </div>
                                            
                                            <span className={`text-white text-[25px] hover:-translate-y-1 bg-yellow-500 ${item.quantity > 9 ? `px-3` : `px-4.5`} rounded-full font-bold transition-all duration-200`}>
                                                {item.quantity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price + Total */}
                                    <div className="flex justify-between mt-10">
                                        
                                        <div className="flex gap-2">

                                            <p className="text-gray-600 text-md font-mono">{formatPrice(product.price, "USD")}</p>
                                            
                                            {
                                                formatDiscount(product.discount_tag) && 
                                                
                                                ( 
                                                    <p className="text-gray-500 text-sm line-through font-mono">{formatPrice(product.price, "USD", product.discount_tag)}</p>
                                                )
                                            }

                                        </div>
                                        <p className="text-gray-700 font-mono">{formatPrice(product.price * item.quantity, "USD")}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer / Checkout */}
                <div className="mt-3 border-t-3 pt-5">
                    <p className="flex justify-between font-extrabold text-orange-500">
                        <span className="text-black text-[19px]">Total (USD):</span> <span className="text-[25px]">{formatPrice(totalBill, "USD")}</span>
                    </p>
                    <button
                        className="w-full bg-yellow-500 text-white py-2 rounded-full mt-3 hover:bg-orange-600 text-[18px] font-extrabold"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}