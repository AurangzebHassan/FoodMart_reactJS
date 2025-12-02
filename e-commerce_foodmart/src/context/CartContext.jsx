import { createContext, useContext, useState, useEffect, useCallback } from "react";

import { useAuth } from "./AuthContext"; // you already have this

import { getAllProducts, getCartItems, addOrUpdateCartItem, removeCartItem, clearUserCart, decreaseProductStock, increaseProductStock } from "../appwrite/db";

import { getUserFavourites, addFavourite, removeFavourite, getDiscountValue } from "../appwrite/db";

import { createOrder, createOrderItem } from "../appwrite/db";

import { DATABASE_ID, database,ORDERS_TABLE_ID, ORDER_ITEMS_TABLE_ID, Query } from "../appwrite/appwrite";



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



        // State Variables

            //      State	        Purpose	                                                            Example
            //      -----           -------                                                             -------

                // cartDocs	        Raw cart items from DB                                              ($id, user_id, product_id, quantity)[{ $id: 'c1', user_id: 'u1', product_id: 'p1', quantity: 2 }]

                // productsMap	    All products fetched from DB as an object keyed by product ID	    { p1: { name: "Apple", price: 2, stock: 10, discount_tag: "-10%" } }

                // cartItems	    Hydrated / enriched cart items combining cartDocs + productsMap     [{ $id: 'c1', quantity: 2, product: { name: "Apple", price: 2 }, unitPrice: 1.8, subtotal: 3.6 }]

                // cartQuantity	    Total number of items in cart	                                    2

                // cartTotal	    Total price of cart	                                                3.60

                // loading	        True while fetching cart / products	                                true / false

        
                    // Raw cart items from Appwrite: [$id, user_id, product_id, quantity]
                
                        const [cartDocs, setCartDocs] = useState([]);
            
                    // Full product table for hydration
                
                        const [productsMap, setProductsMap] = useState({});
                        
                    // store which products this user added to wishlist    
                    
                        const [favouritesMap, setFavouritesMap] = useState({});
                        
                     // store the favourites order for correct protrayal of wishlist
                    
                        const [favouritesOrder, setFavouritesOrder] = useState([]);
                        
                    // state to know if the cart is in checkout so the cart icon in navbar can be changed to checkout icon. Initialize from localStorage

                        const [isCheckoutPage, setIsCheckoutPage] = useState(() =>
                        {
                            return localStorage.getItem("isCheckoutPage") === "true";
                        });
        
                    // state to hold user orders
                    
                        const [orders, setOrders] = useState([]); // new state for user orders

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
                // Creates productsMap for quick lookup when hydrating cart.
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
            // 3. Fetch orders and order_tems docs for this user
        // -----------------------------------------------------------

        const fetchUserOrders = useCallback(async () =>
        {
            if (!user)
            {
                setOrders([]);
                
                return;
            }

          
            try
            {
                const res = await database.listDocuments(
              DATABASE_ID,
              ORDERS_TABLE_ID,
              [Query.equal("user_id", user.$id), Query.orderDesc("$createdAt")]
            );

            const ordersWithItems = await Promise.all(
              res.documents.map(async (order) => {
                const itemsRes = await database.listDocuments(
                  DATABASE_ID,
                  ORDER_ITEMS_TABLE_ID,
                  [Query.equal("order_id", order.$id)]
                );

                return {
                  ...order,
                  items: itemsRes.documents,
                };
              })
            );

            setOrders(ordersWithItems);
          } catch (err) {
            console.error("Error fetching user orders:", err);
            setOrders([]);
          }
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


                const enrichedCart = cartDocs.map(
                    
                    (item) =>
                    {
                        const product = productsMap[item.product_id];
                    
                    
                        if (!product) return null;


                        const discount_value = getDiscountValue(product.discount_tag);

                        const basePrice = product.price;

                        const unitPrice = discount_value > 0 ? +(basePrice * (1 - discount_value / 100)).toFixed(2) : basePrice;

                        const subtotal = +(unitPrice * item.quantity).toFixed(2);


                        return { ...item, product, unitPrice, subtotal, discount_value, };
                    }

                ).filter(Boolean);

                    
                setCartItems(enrichedCart);
                
                setCartQuantity(enrichedCart.reduce((sum, i) => sum + i.quantity, 0));
                
                setCartTotal(enrichedCart.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));

            }, [cartDocs, productsMap]);

        
        // -----------------------------------------------------------
            // 4. Refresh function used everywhere (Navbar, ProductCard, Drawer)
        // -----------------------------------------------------------
        
            const refreshCartDocsAndProducts = useCallback(async () => 
            {
                await fetchProducts();   // refresh product prices
            
                await fetchCartDocs();   // refresh cart rows

            }, [fetchProducts, fetchCartDocs]);
            
        
            const refreshCartDocsOnly = useCallback(async () => 
            {
                await fetchCartDocs(); // fetch only cart collection
            
            }, [fetchCartDocs]);
        
        
        
        // -----------------------------------------------------------
            // 5. Update the products' changed field in the products map.
            
                // Adding this for the isfavourite flag reflection/updation in UI
        // -----------------------------------------------------------
        
            const toggleProductFavourite = async (productId) => 
            {
                if (!user) return;

              
                const currentFavId = favouritesMap[productId];

              
                // Case 1: product is currently a favourite → remove it
              
                    if (currentFavId)
                    {
                        await removeFavourite(currentFavId);

                    
                        setFavouritesMap((prev) =>
                        {
                            const copy = { ...prev };
                    
                            delete copy[productId];
                    
                            return copy;
                        });


                        setFavouritesOrder((prev) => prev.filter((id) => id !== productId));


                        return false;
                    }

              
                // Case 2: product is not favourite → add it
              
                    const newFav = await addFavourite(user.$id, productId);

                
                    if (newFav?.$id)
                    {
                        setFavouritesMap((prev) => ({ ...prev, [productId]: newFav.$id }));
                        
                        setFavouritesOrder((prev) => [productId, ...prev]); // newest at top
                    }

              
                return true;
            };


            
        // -----------------------------------------------------
            
            // 5. addItem(productId, qty)
        
                // Purpose:
                            // - Add a product to cart OR increase its quantity.
                            // - Reserve stock by decreasing it IN THE DATABASE.
                            // - Update local productsMap so UI stays in sync.
                            
        // -----------------------------------------------------
 
            const addItem = async (productId, qty = 1) => 
            {
                try
                {
                    if (!user) return;


                    // const cartItem = cartItems.find(i => i.productId === productId);

                    const product = productsMap[productId];


                    if (!product)
                    {
                        console.error("Product not found in productsMap");
                        
                        return;
                    }

                
                    // Since stock is already DB-reflecting available units,
                
                    // we ONLY check if the *incoming qty* exceeds remaining stock.
                
                        if (qty > product.stock)
                        {
                            alert(`Only ${product.stock} unit(s) available`);
                    
                            return;
                        }

                
                    // Add item OR increase quantity in the cart
                
                        await addOrUpdateCartItem( user.$id, productId, qty );

                
                    // Decrease stock in DB and get updated product back
                
                        const updatedProduct = await decreaseProductStock(productId, qty);

                
                    // Update local productsMap so UI shows new stock instantly
                
                        if (updatedProduct?.$id)
                        {
                            setProductsMap(prev => ({ ...prev, [productId]: updatedProduct}));
                        }

                
                    await refreshCartDocsOnly(); // Re-hydrate cart with updated prices + quantities
                }
                
                catch (error)
                {
                    console.error("Error in addItem:", error);
                }
            };



        // -----------------------------------------------------
        
            // updateItem(cartItemId, productId, qtyChange)
            
                // Purpose:
            
                            // - Increase/decrease quantity of an item ALREADY in cart.
                            // - Adjust stock in DB accordingly (increase or decrease).
                            // - Update productsMap so UI updates instantly.

        // -----------------------------------------------------
        
            const updateItem = async (cartItemId, productId, qtyChange) => 
            {
                try
                {
                    if (!user) return;

                
                    const cartItem = cartItems.find(i => i.$id === cartItemId);
                
                    const product = productsMap[productId];

                
                    if (!cartItem || !product) return;

                
                    // If user tries to INCREASE quantity
                
                        if (qtyChange > 0)
                        {
                    
                            // quantity change must not exceed DB remaining stock
                    
                                if (qtyChange > product.stock) return;

                    
                            const updatedProduct = await decreaseProductStock(productId, qtyChange);

                    
                            if (updatedProduct?.$id)
                            {
                                setProductsMap(prev => ({ ...prev, [productId]: updatedProduct }));
                            }
                        }

                
                    // If user DECREASES cart item quantity
                
                        if (qtyChange < 0)
                        {
                            const updatedProduct = await increaseProductStock( productId, Math.abs(qtyChange) );

                
                            if (updatedProduct?.$id)
                            {
                                setProductsMap(prev => ({ ...prev, [productId]: updatedProduct }));
                            }
                        }

               
                    // Finally update the cart record
                
                        await addOrUpdateCartItem( user.$id, productId, qtyChange );

                
                    await refreshCartDocsOnly();
                } 
            
                catch (error)
                {
                    console.error("Error in updateItem:", error);
                }
            };



        // -----------------------------------------------------
       
            // removeItem(cartItemId, productId)
            
                // Purpose:
            
                            // - Remove item completely from cart.
                            // - Restore all reserved units back to stock in the DB.
                            // - Sync productsMap so UI stays correct.
                            
        // -----------------------------------------------------
        
            const removeItem = async (cartItemId, productId) => 
            {
                try
                {
                    if (!user) return;

                
                    // Find the cart item to know how many units to restore
                
                        const cartItem = cartItems.find((i) => i.$id === cartItemId);
                
                
                    if (!cartItem) return;

                
                    // Get the product document from productsMap to obtain its Appwrite $id
                
                        const productDoc = productsMap[productId];
                
                    
                        if (!productDoc || !productDoc.$id)
                        {
                            console.error( "Product document not found for stock restoration", productId );
                    
                            return;
                        }

                
                    // Restore all reserved stock in the DB
                
                        const updatedProduct = await increaseProductStock( productDoc.$id, cartItem.quantity );

                
                    // Update local productsMap so UI reflects live stock
                
                        if (updatedProduct?.$id)
                        {
                            setProductsMap((prev) => ({ ...prev, [productId]: updatedProduct }));
                        }

                
                    // Remove the cart item from the DB
                
                        await removeCartItem(cartItemId);

                
                    // Refresh the cart to update cartItems, cartQuantity, cartTotal
                
                        await refreshCartDocsOnly();
                }
                
                catch (error)
                {
                    console.error("Error in removeItem:", error);
                }
            };



        // -----------------------------------------------------
        
            // clearCart()
            
                // Purpose:
            
                            // - Empty the entire cart.
                            // - Return ALL reserved stock to inventory in DB.
                            // - Update productsMap for each returned product.

        // -----------------------------------------------------
        
            const clearCart = async () => 
            {
               try
               {
                   if (!user) return;

               
                   // Iterate over all cart items
               
                        for (const item of cartItems)
                        {
                            const productDoc = productsMap[item.product_id];
                        

                            if (!productDoc || !productDoc.$id)
                            {
                                console.error( "Product document not found for stock restoration", item.product_id );
                        
                                continue;
                            }

                        
                            // Restore each product's stock
                        
                                const updatedProduct = await increaseProductStock( productDoc.$id, item.quantity );

                        
                            // Update productsMap locally
                        
                                if (updatedProduct?.$id)
                                {
                                    setProductsMap((prev) => ({ ...prev, [item.product_id]: updatedProduct }));
                                }
                        }

               
                   // Remove all cart items from DB
               
                        await clearUserCart(user.$id);

               
                   // Refresh cart to update totals and UI
               
                       await refreshCartDocsAndProducts();
                } 
             
                catch (error)
                {
                    console.error("Error clearing cart:", error);
                }
            };
        
        
        
        // -----------------------------------------------------
        
            // clearCartWithoutRestoringStock()
            
                // Purpose:
            
                    //   - Used only AFTER a successful order.
                    //   - Deletes cart docs but DOES NOT restore stock.
            
        // -----------------------------------------------------

        const clearCartWithoutRestoringStock = async () =>
        {
            try
            {
                if (!user) return;

        
                // remove docs directly
        
                    await clearUserCart(user.$id);

        
                // refresh cart + products
        
                    await refreshCartDocsAndProducts();
            } 
    
            catch (error)
            {
                console.error("Error clearing cart without restoring stock:", error);
            }
        };






        const placeOrder = async (shippingAddress, shippingMethod = "standard") =>
        {
            try
            {
                if (!user) return null;
            
                if (!cartItems.length) return null;

            
                // ------------------------------------------
                    // 1. Compute expected delivery date
                // ------------------------------------------
            
                    const now = new Date();
                
                    const deliveryRanges =
                    {
                        standard: [4, 6],
                        fast: [2, 3],
                        express: [1, 1],
                    };

                
                    const [minDays, maxDays] = deliveryRanges[shippingMethod] || [4, 6];
                
                    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;

                
                    const expectedDate = new Date();
                
                    expectedDate.setDate(now.getDate() + randomDays);



                // 2. Subtotal
        
                    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

                
        
                // 3. Shipping cost
        
                    const shippingCost = shippingMethod === "express"
                    
                        ? 19.99
                    
                        : shippingMethod === "fast"
                    
                            ? 9.99
                    
                            : 4.99;

        
                
                // 4. Tax
            
                    const tax = subtotal * 0.1;

        
        
                // 5. Final total
        
                    const finalTotal = subtotal + shippingCost + tax;



                // ------------------------------------------
                    // 3. Create order document
                // ------------------------------------------
            
                    const order = await createOrder(
                    {
                        user_id: user.$id,
                        shipping_address: shippingAddress,
                        shipping_method: shippingMethod,
                        total_amount: finalTotal,
                        shipping_cost: shippingCost,
                        tax_amount: tax,
                        payment_method: "Cash on Delivery (COD)",
                        shipping_status: "processing",
                        expected_delivery_date: expectedDate.toISOString(),
                    });

                
                    if (!order?.$id) throw new Error("Order creation failed");


                
                // ------------------------------------------
                    // 4. Create each order item
                // ------------------------------------------
            
                    for (const item of cartItems)
                    {
                        await createOrderItem(
                        {
                            order_id: order.$id,
                            product_id: item.product_id,
                            product_name_snapshot: item.product.name,
                            product_slug_snapshot: item.product.slug,
                            product_image_snapshot: item.product.image_url,
                            original_price_snapshot: item.product.price,
                            unit_price_snapshot: item.unitPrice,
                            product_discount_snapshot: item.product.discount_tag || null,
                            quantity: item.quantity,
                            subtotal: item.subtotal,
                        });
                    }



                // ------------------------------------------
                    // 5. Clear the cart completely
                // ------------------------------------------
            
                    await clearCartWithoutRestoringStock();
                    
                    
                    
                // refresh orders immediately

                    await fetchUserOrders();


                            
                // ------------------------------------------
                    // 6. Return order id
                // ------------------------------------------
            
                    return order.$id;
            } 
          
            catch (err)
            {
                console.error("Error placing order:", err);
            
                return null;
            }
        };



        const cancelOrder = async (orderId) => {
          try {
            const orderToCancel = orders.find((o) => o.$id === orderId);
            if (!orderToCancel) return;

            // 1. Increase stock for each product
            await Promise.all(
              orderToCancel.items.map((item) =>
                increaseProductStock(item.product_id, item.quantity)
              )
            );

            // 2. Delete order items
            await Promise.all(
              orderToCancel.items.map((item) =>
                database.deleteDocument(
                  DATABASE_ID,
                  ORDER_ITEMS_TABLE_ID,
                  item.$id
                )
              )
            );

            // 3. Delete the order itself
            await database.deleteDocument(
              DATABASE_ID,
              ORDERS_TABLE_ID,
              orderId
            );

            // 4. Update local orders state to remove cancelled order
            setOrders((prev) => prev.filter((order) => order.$id !== orderId));

            // 5. Refresh productsMap to reflect updated stock
            await fetchProducts();
          } catch (err) {
            console.error("Error cancelling order:", err);
            alert("Failed to cancel order. Please try again.");
          }
        };


           
        


        
        
        // Helper to mark checkout started

            const markCheckout = () =>
            {
                setIsCheckoutPage(true);
        
                localStorage.setItem("isCheckoutPage", "true");
            };

        
        
        // Helper to clear checkout state

            const clearCheckoutFlag = () =>
            {
                setIsCheckoutPage(false);
        
                localStorage.removeItem("isCheckoutPage");
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


                    // Load user favourites
        
                        if (user)
                        {
                            const favDocs = await getUserFavourites(user.$id);
                

                            const favMap = {};
                            
                            const favOrder = [];


                           // favDocs already sorted DESC by createdAt from DB
                           
                            favDocs.forEach((f) =>
                            {
                                favMap[f.product_id] = f.$id;
                                
                                favOrder.push(f.product_id);
                            });

                           
                            setFavouritesMap(favMap);
                           
                            setFavouritesOrder(favOrder);
                        }
                    
                    
                    await fetchUserOrders();
                
                    setLoading(false);

                })();
            
            }, [user, fetchProducts, fetchCartDocs, fetchUserOrders]);

        
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

                productsMap,

                favouritesMap,

                favouritesOrder,

                wishlistQuantity: favouritesOrder.length, // ← add this

                isProductFavourite: (pid) => Boolean(favouritesMap[pid]),
    
                toggleProductFavourite,

                isCheckoutPage,

                setIsCheckoutPage,

                markCheckout,

                clearCheckoutFlag,

                orders,

                ordersQuantity: orders.length,

                fetchUserOrders,

                placeOrder,

                cancelOrder,
            
                cartQuantity, // for navbar badge
            
                cartTotal, // formatted string total
            
                refreshCartDocsOnly,

                refreshCartDocsAndProducts,
            
                addItem,
            
                updateItem,
            
                removeItem,
            
                clearCart,

                clearCartWithoutRestoringStock
            };

        
        
        return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
    }