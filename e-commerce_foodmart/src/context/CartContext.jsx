import { createContext, useContext, useState, useEffect, useCallback } from "react";

import { useAuth } from "./AuthContext"; // you already have this

import { getAllProducts, getCartItems, addOrUpdateCartItem, removeCartItem, clearUserCart } from "../appwrite/db";

import { formatPrice } from "../utils/formatPrice";

import { formatDiscount } from "../utils/formatDiscount";



// -----------------------------------------------------------
    // CREATE CONTEXT
// -----------------------------------------------------------

    const CartContext = createContext();


// -----------------------------------------------------------
    // EXPORT HOOK FOR ACCESSING CART CONTEXT
// -----------------------------------------------------------

    // eslint-disable-next-line react-refresh/only-export-components
    export function useCart()
    {
        return (useContext(CartContext));
    } 


// -----------------------------------------------------------
    // CART PROVIDER
// -----------------------------------------------------------

    export function CartProvider({ children }) 
    {
        const { user } = useAuth(); // get logged-in user


        // Raw cart items from Appwrite: [$id, user_id, product_id, quantity]
    
            const [cartDocs, setCartDocs] = useState([]);
 
        // Full product table for hydration
    
            const [productsMap, setProductsMap] = useState({});

        // Final enriched cart items (used by UI)
    
            const [cartItems, setCartItems] = useState([]);

        // Quantity badge (sum of quantities)
    
            const [cartQuantity, setCartQuantity] = useState(0);

        // Total cost
        
            const [cartTotal, setCartTotal] = useState(0);

        // Loading state for initial sync
    
            const [loading, setLoading] = useState(true);

        
        
        // -----------------------------------------------------------
            // 1. Fetch all products ONCE
        // -----------------------------------------------------------
        
            const fetchProducts = useCallback(async () => 
            {
                const products = await getAllProducts();

                const map = {};
                
                for (let p of products) map[p.$id] = p;


                setProductsMap(map);

            }, []);

        
        // -----------------------------------------------------------
            // 2. Fetch cart docs for this user
        // -----------------------------------------------------------
        
            const fetchCartDocs = useCallback(async () => 
            {
                if (!user)
                {
                    setCartDocs([]);
                
                    return;
                }

                const docs = await getCartItems(user.$id);

                // Sort: newest first
                
                    docs.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

                
                setCartDocs(docs);

            }, [user]);

        
        // -----------------------------------------------------------
            // 3. HYDRATE cartDocs + productsMap → cartItems
        // -----------------------------------------------------------
        
            const hydrateCart = useCallback(() => 
            {
                if (!cartDocs.length || !Object.keys(productsMap).length)
                {
                    setCartItems([]);
                
                    setCartQuantity(0);

                    setCartTotal(0);

                    return;
                }


                const enriched = cartDocs.map(
                    
                    (item) =>
                    {
                        const product = productsMap[item.product_id];
                    
                        if (!product) return null;


                        const safeDiscount = formatDiscount(product.discount_tag);
                        
                        const discountedPrice = formatPrice(product.price, product.currency, safeDiscount);

                        // extract numeric part from formatted price
                        
                            const numericUnitPrice = parseFloat(discountedPrice.replace(/[^0-9.]/g, ""));
                        
                            const subtotal = numericUnitPrice * item.quantity;


                        return {
                        
                            ...item, // includes: $id, product_id, quantity. Basically, the cart doc
                        
                            product, // full product object (name, price, image, discount).  The full product doc.

                            unitPrice: numericUnitPrice,
                        
                            subtotal,
                        };
                    }
                
                ).filter(Boolean);


                setCartItems(enriched);


                // Total quantity
                
                    const qty = enriched.reduce((s, i) => s + i.quantity, 0);
                
                    setCartQuantity(qty);

                
                // Total price
                
                    const total = enriched.reduce((s, i) => s + i.subtotal, 0);
                
                    setCartTotal(total.toFixed(2));

            }, [cartDocs, productsMap]);

        
        // -----------------------------------------------------------
            // 4. Refresh function used everywhere (Navbar, ProductCard, Drawer)
        // -----------------------------------------------------------
        
            const refreshCart = useCallback(async () => 
            {
                await fetchCartDocs();

            }, [fetchCartDocs]);

        
        // -----------------------------------------------------------
            // 5. Add item to cart
        // -----------------------------------------------------------
        
            const addItem = async (productId, qty = 1) => 
            {
                if (!user) return;


                const product = productsMap[productId];

                if (!product) return;


                // Find existing cart item
                
                    const existing = cartDocs.find((c) => c.product_id === productId);

                const currentQty = existing ? existing.quantity : 0;
                
                const newQty = currentQty + qty;

                // Prevent exceeding stock
                
                    if (newQty > product.stock) 
                    {
                        alert(`Only ${product.stock} unit(s) available in stock.`);
                        
                        return;
                    }


                await addOrUpdateCartItem(user.$id, productId, qty);
            
                await refreshCart();
            };

        
        // -----------------------------------------------------------
            // 6. Update quantity (+1 or -1), same as your Drawer
        // -----------------------------------------------------------
        
            const updateItem = async (cartItemId, productId, qtyChange) => 
            {
                if (!user) return;


                const product = productsMap[productId];
                
                if (!product) return;


                const cartItem = cartDocs.find((c) => c.$id === cartItemId);
                
                if (!cartItem) return;


                const newQty = cartItem.quantity + qtyChange;

                // BLOCK below 1
                
                    if (newQty < 1) return;

                // BLOCK above stock
                
                    if (newQty > product.stock) return;


                await addOrUpdateCartItem(user.$id, productId, qtyChange);
            
                await refreshCart();
            };

        
        // -----------------------------------------------------------
            // 7. Remove item completely
        // -----------------------------------------------------------
        
            const removeItem = async (cartItemId) => 
            {
                await removeCartItem(cartItemId);
            
                await refreshCart();
            };

        
        // -----------------------------------------------------------
            // 8. Clear entire cart
        // -----------------------------------------------------------
        
            const clearCart = async () => 
            {
                if (!user) return;

                await clearUserCart(user.$id);
            
                await refreshCart();
            };


        // -----------------------------------------------------------
            // INITIAL LOAD: products + cart
        // -----------------------------------------------------------
    
            useEffect(() => 
            {
                (async () =>
                {
                    setLoading(true);
                
                    await fetchProducts();
                
                    await fetchCartDocs();
                
                    setLoading(false);

                })();
            
            }, [user, fetchProducts, fetchCartDocs]);

        
        // -----------------------------------------------------------
            // Whenever cartDocs or productsMap updates → hydrate enriched cart
        // -----------------------------------------------------------
        
            useEffect(() => 
            {
                hydrateCart();
            
            }, [cartDocs, productsMap, hydrateCart]);

        
        // -----------------------------------------------------------
            // PROVIDER VALUE
                // Everything the app can access
        // -----------------------------------------------------------
        
            const value = 
            {
                loading,
            
                cartItems, // enriched objects (product + quantity + subtotal)
            
                cartQuantity, // for navbar badge
            
                cartTotal, // formatted string total
            
                refreshCart,
            
                addItem,
            
                updateItem,
            
                removeItem,
            
                clearCart,
            };

        
        
        return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
    }