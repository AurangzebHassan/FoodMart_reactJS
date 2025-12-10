import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";

import Navbar from "../components/Navbar";

import Loader from "../components/Loader";

import { formatPrice } from "../utils/formatPrice";

import { formatDateTime } from "../utils/formatDateTime";

import { useNavigate } from "react-router-dom";



export default function Orders()
{
    const { orders, cancelOrder } = useCart();



    const [cancelOrderLoading, setCancelOrderLoading] = useState(false);



    const navigate = useNavigate()



    // local delay state

        const [delayDone, setDelayDone] = useState(false);

    
    // ⬅️ Wait 300–500ms so spinner shows briefly
    
        useEffect(() =>
        {
            const t = setTimeout(() => setDelayDone(true), 3000);
        
            return () => clearTimeout(t);
            
        }, []);
    
    
    
    const isLoading = !delayDone || !orders;




    if (isLoading) {
        // return (
        //     <div className="flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">
        //         <p className="text-4xl font-extrabold text-white text-center">Loading Orders</p>
        //         <Loader size="xl" color="border-white border-9" />
        //         <Loader size="large" color="border-white border-7" />
        //         <Loader size="medium" color="border-white border-6" />
        //     </div>
        // );
        


        return (

				<>
		
					<div className="hidden md:flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">

						<span className="text-4xl font-extrabold text-white text-center"> Loading Orders </span>

						
						<Loader size="xl" color="border-white border-9" />

						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

					</div>


					
					<div className="flex md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-yellow-500 gap-2">

						<span className="text-xl font-extrabold text-white text-center"> Loading Orders </span>

						
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


            
            <div className="container mx-auto md:mt-10 md:mb-20 py-6 px-5">
                

                {/* PAGE HEADING */}
                        
                    <div className="flex items-center mb-5 md:mb-10 lg:mb-15">
                

                        {/* BACK BUTTON */}

                            <button
                                
                                className="flex items-center justify-center w-22 max-md:h-7 md:w-25 md:px-4 md:py-1 text-black max-md:text-[14px] font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                                
                                onClick={() => navigate(-1)}
                            >
                                
                                ← Back
                                
                            </button>

                
                        {/* ORDERS HEADING */}
                            
                            <div className="w-full flex items-center justify-center">
                                
                                <h1 className="text-3xl md:text-4xl text-yellow-500 font-extrabold">
                                    
                                    Orders
                                    
                                </h1>
                                
                            </div>
                        
                
                    </div>

                

                {/* NO ORDERS */}
                
                    {orders.length === 0 && (
                    
                        <div className="text-center md:text-2xl font-bold text-gray-400 md:mt-20 pl-20 md:pl-27">
                        
                            You have no orders yet.
                        
                        </div>
                        
                    )}


                
                {/* ORDER LIST */}
                
                    <div className={`space-y-4 md:max-xl:space-y-8 md:max-xl:pl-27 md:max-xl:pr-13 xl:grid xl:grid-cols-2 2xl:grid-cols-3 xl:gap-4 2xl:gap-2`}>

                    
                        {orders.map((order) => (
                        
                            <div 
                                
                                key={order.$id}
                                
                                className={`h-fit border-4 bg-gray-50 ${(order.shipping_status === "delivered") ? `border-green-500` : (order.shipping_status === "shipped") ? `border-blue-500` : `border-yellow-500`} rounded-2xl hover:drop-shadow-2xl hover:-translate-y-1 transition-all duration-200 p-3 md:p-6`}
                            >
                                {/* Top Section: Order ID + Status */}
                                
                                    <div className="flex justify-between mb-3 md:mb-6">
                                        
                                    
                                        <div className="flex-col">
                                            

                                            <p className="md:text-lg font-extrabold text-gray-700 md:mb-1">
                                    
                                                Order <span title={order.$id.toUpperCase()} className="hover:text-gray-600 italic font-mono text-gray-500 text-lg md:text-xl"> #{order.$id.slice(-6).toUpperCase()} </span>
                                    
                                            </p>
                                                
                                                
                                            <p title="Order Creation At" className="text-[12px] md:text-sm font-light italic text-gray-700">
                                        
                                                {formatDateTime(order.$createdAt, {withTime: true})}
                                        
                                            </p>


                                        </div>
                                        
                                    
                                        <div className="flex shrink-0 items-center gap-1 md:gap-3">
                                            
                                            
                                            <button
                                                    
                                                className={(order.shipping_status === "shipped" || order.shipping_status === "delivered") ? `hidden` : `hover:-translate-y-1 transition-all duration-200`}
                                                
                                                onClick=
                                                {
                                                    async () =>
                                                    {
                                                        setCancelOrderLoading(true);

                                                        await cancelOrder(order.$id);

                                                        setCancelOrderLoading(false);
                                                    }
                                                }
                                                
                                                title="Cancel"
                                            >
                                                
                                                <img src="/icons/cancel.png" alt="cancel" className="w-7" />
                                                
                                            </button>

                                    
                                            <span className={`hover:-translate-y-1 transition-all duration-200 px-4 py-1 text-white font-bold rounded-full
                                                ${order.shipping_status === "pending" ? "bg-yellow-500" :
                                                order.shipping_status === "shipped" ? "bg-blue-500" :
                                                order.shipping_status === "delivered" ? "bg-green-600" :
                                                "bg-gray-500"
                                                }`}
                                            >

                                                {
                                                    cancelOrderLoading ? 
                                                    
                                                    (
                                                        <div className={`flex items-center justify-center ${order.shipping_status.toLowerCase() === "processing" ? `px-9.25` : ``}`}>
                                    
                                                            <Loader size="medium" color="border-white border-4" />
                                
                                                        </div>
                                                    )

                                                    :

                                                    (
                                                        order.shipping_status.toUpperCase()
                                                    )
                                                }
                                                

                                            </span>
                                            
                                            
                                        </div>

                                    
                                    </div>

                                

                                {/* ITEMS */}
                                
                                    <div className="space-y-4 mb-6 border-t pt-6">

                                    
                                        {order.items.map((item) => (
                                        
                                            <div 
                                            
                                                key={item.product_id}
                                                
                                                className={`relative cursor-default flex justify-between items-center border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 /*${(order.shipping_status === "delivered") ? `bg-green-50 hover:bg-green-100` : (order.shipping_status === "shipped") ? `bg-blue-50 hover:bg-blue-100` : `bg-gray-50 hover:bg-gray-100`}*/ hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}

                                                onClick={() => !cancelOrderLoading && navigate(`/product/${item.product_slug_snapshot}`)}

                                                disabled={cancelOrderLoading}
                                            >
                                                

                                                <p className={`text-sm font-semibold text-gray-700`}>
                                                
                                                    {item.product_name_snapshot} × {item.quantity}
                                                
                                                </p>


                                                <p className="font-mono font-bold text-orange-600">
                                                     
                                                    {formatPrice(item.unit_price_snapshot, item.currency)} × {item.quantity} = {formatPrice(item.subtotal, item.currency)}
                                         
                                                </p>


                                            </div>

                                        ))}
                                    

                                    </div>

                                

                                {/* Shipping + PAYMENT + TAX + TOTAL */}
                                
                                    <div className="border-t pt-6">
                                        

                                        {/* SHIPPING ADDRESS */}
                                        
                                            <div className="flex justify-between font-bold">
                                            

                                                <span className="text-gray-700 2xl:mr-16">Shipping Address: </span>
                                            

                                                <span className="text-orange-600">
                                                
                                                    {order.shipping_address}
                                                
                                                </span>
                                            
                                            
                                            </div>
                                            
                                    
                                        {/* SHIPPING METHOD + COST */}
                                        
                                            <div className="flex justify-between font-bold mt-2">
                                            

                                                <span className="text-gray-700">Shipping: </span>
                                            
                                            
                                                
                                                <div className="flex gap-3">
                                                
                                                
                                                    <span className="text-orange-600">
                                                    
                                                        {(order.shipping_method === "standard") ? 
                                                        
                                                            order.shipping_method.toUpperCase() + ` (4-6 days)`
                                                            
                                                            : order.shipping_method === "fast" ?
                                                            
                                                                order.shipping_method.toUpperCase() + ` (2-3 days)`
                                                                
                                                                : order.shipping_method.toUpperCase() + ` (1 day)`
                                                        }
                                                    
                                                    </span>
                                                    
                                                    <span className="text-gray-600"> | </span>

                                                
                                                    <span className="text-orange-600">
                                                    
                                                        {formatPrice(order.shipping_cost, "USD")}
                                                    
                                                    </span>
                                                
                                                
                                                </div>
                                            
                                            
                                            </div>
                                            
                                    
                                        {/* EXPECTED DELIVERY DATE */}
                                        
                                            <div className="flex justify-between font-bold mt-2">
                                            

                                                <span className="text-gray-700">Expected Delivery: </span>
                                            

                                                <span className="text-orange-600">
                                                
                                                    {formatDateTime(order.expected_delivery_date)}
                                                
                                                </span>
                                            
                                            
                                            </div>
                                            
                                    
                                        {/* PAYMENT METHOD */}
                                        
                                            <div className="flex justify-between font-bold mt-2 mb-6">
                                            

                                                <span className="text-gray-700">Payment Method: </span>
                                            

                                                <span className="text-orange-600">
                                                
                                                    {order.payment_method}
                                                
                                                </span>
                                            
                                            
                                            </div>
                                            
                                    
                                        {/* TAX + SUBTOTAL + TOTAL AMOUNT */}
                                        
                                            <div className=" border-t pt-6">

                                        
                                                {/* SUBTOTAL */}
                                                
                                                    <div className="flex justify-between text-lg font-bold">
                                            
                                                
                                                        <span className="text-gray-700">Subtotal:</span>
                                                
                                                
                                                        <span className="text-gray-600">
                                                
                                                            {formatPrice((order.tax_amount * 10), "USD")}
                                                
                                                        </span>

                                                    
                                                    </div>
                                                    
                                                    
                                                {/* TAX AMOUNT */}
                                                
                                                    <div className="flex justify-between text-lg font-bold mt-2 mb-6">
                                            
                                                
                                                        <span className="text-gray-700">Tax (10%):</span>
                                                
                                                
                                                        <span className="text-gray-600">
                                                
                                                            {formatPrice((order.tax_amount), "USD")}
                                                
                                                        </span>

                                                    
                                                    </div>
                                                

                                                {/* TOTAL AMOUNT */}
                                                
                                                    <div className="flex justify-between text-2xl font-extrabold border-t pt-6">
                                            
                                                
                                                        <span className="text-yellow-600">Total:</span>
                                                
                                                
                                                        <span className="text-black">
                                                
                                                            {formatPrice(order.total_amount, "USD")}
                                                
                                                        </span>

                                                    
                                                    </div>


                                            </div>            
                                            
                                    
                                            
                                            
                                        
                                    </div>
                                    
                                    
                            </div>


                        ))}
                    

                    </div>

                
            </div>


        </>

    );
}