import { useState, useEffect } from "react";

import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { formatPrice } from "../utils/formatPrice";

import { useLocation } from "react-router-dom";

import Loader from "./Loader.jsx"

import DarkModeToggle from "./DarkModeToggle.jsx";



export default function CartDrawer({ onClose })
{
	const { user } = useAuth();
	const {
	cartItems,
	cartQuantity,
	cartTotal,
	refreshCartDocsAndProducts,
	isCheckoutPage,
	clearCheckoutFlag,
	updateItem,
	removeItem,
	clearCart,
	productsMap,
	isProductFavourite,
	toggleProductFavourite
	} = useCart();



	const navigate = useNavigate();



	const location = useLocation();
  	
	const isOnCheckoutPage = location.pathname === "/checkout";
	


	const [removingItemId, setRemovingItemId] = useState(null);
  	
	const [updatingItemId, setUpdatingItemId] = useState(null);

	const [clearCartLoading, setClearCartLoading] = useState(false);

	const [refreshCartLoading, setRefreshCartLoading] = useState(false);



	const [isVisible, setIsVisible] = useState(false);



	const [localCart, setLocalCart] = useState(cartItems); // local copy remapped from productsMap



	// let cartItemCount = 0;




	useEffect(() =>
	{
		document.body.style.overflow = "hidden";
		
		setTimeout(() => setIsVisible(true), 10);
		
		return () =>
		{
			document.body.style.overflow = "";
		};

	}, []);



	 // --- Sync localCart with latest cartItems + productsMap ---
	
		useEffect(() =>
		{
			const remapped = cartItems.map((item) =>
			{
				const prodFromMap = productsMap[item.product?.$id];
			
				if (!prodFromMap) return item; // fallback to original
			
				return { ...item, product: { ...prodFromMap } };
			});
		
			setLocalCart(remapped);
			
		}, [cartItems, productsMap]);




	const handleClose = () =>
	{
		setIsVisible(false);
	
		setTimeout(() => onClose(), 200);
	};



	const handleOverlayClick = (e) =>
	{
		if (e.target === e.currentTarget) handleClose();
	};



	const handleClick = (product) =>
	{
		if (!product.slug) return;
	
		navigate(`/product/${product.slug}`);
	};



	// --- Toggle favourite handler ---
		
			const handleFavouriteClick = async (productId) => 
			{
				if (!user) return alert("You need to log in to favourite items.");

		
				try
				{
					await toggleProductFavourite(productId);
			
					// localCart will auto-update because productsMap / favouritesMap are reactive
			
					// Optionally, we can force a re-map to include the latest product from productsMap:
			
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





	if (!localCart)
	
		return (
	
			<div
	
				className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
	
				onClick={handleOverlayClick}
			>
		
				<div

					className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}
				>
			
					<div className="flex h-screen justify-center items-center text-4xl text-yellow-500 font-bold">
			
						Loading...
			
					</div>
		
				</div>
		
			</div>
	
		);






	return (

		<div className="transiiton-all duration-200">
			{/* Background blur overlay */}
						
					{(isVisible) && (
					
						<div
						
							className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40"
						
							onClick={() => setIsVisible(false)}
						>
					
						</div>
					)}

			

			<div
				className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
				isVisible ? "opacity-100" : "opacity-0"
				}`}
				onClick={handleOverlayClick}
			>
				<div
				className={`bg-white dark:bg-gray-600 w-full md:w-120 h-full shadow-xl p-3 md:p-6 flex flex-col transform transition-transform duration-300 ${
					isVisible ? "translate-x-0" : "translate-x-full"
				}`}
				>
				{/* Close + Refresh button */}
					
						<div className="flex justify-between items-center">


							<div className="mt-2 md:mt-3.5">

								<DarkModeToggle />
							
							</div>
							
						
							<button
						
								onClick={handleClose}
						
								className="text-gray-600 dark:text-white dark:hover:text-gray-300 hover:text-gray-900 text-4xl md:text-6xl /*mr-29 md:mr-33*/"
							>
						
								&times;
					
							</button>		
							
							
							<button 
								
								onClick=
								{
									async () => 
									{
										setRefreshCartLoading(true);

										await refreshCartDocsAndProducts();

										setRefreshCartLoading(false);
									}
								}
								
								title="Refresh Cart" 
								
								className={`md:mt-2.25 mr-2.5 md:mr-2 ${(!cartQuantity || clearCartLoading || removingItemId || updatingItemId) ? `invisible` : `active:-translate-y-1 hover:-translate-y-1 transition-all duration-200`}`}
								
								disabled={!cartQuantity || clearCartLoading || removingItemId || updatingItemId}
							>
							
								<img src="/icons/refresh.png" alt="refresh" className="w-6 md:w-9" />
							
							</button>
						
						</div>


				{/* Header */}
				
					<div className="flex justify-between items-center mb-1 md:mb-6 mt-2 md:mt-6">

						<h1 className="text-2xl md:text-3xl font-extrabold text-yellow-500 dark:text-yellow-300">Your Cart</h1>
						
						<span
						className={`text-white text-[17px] md:text-[25px] active:-translate-y-1 hover:-translate-y-1 dark:bg-yellow-300 dark:active:bg-orange-400 dark:hover:bg-orange-400 dark:text-gray-600 bg-yellow-500 active:bg-orange-600 hover:bg-orange-600 ${
							cartQuantity > 9 ? "px-3" : "px-4.5"
						} rounded-full font-bold transition-all duration-200`}
						>
						{
							((updatingItemId) || (removingItemId) || clearCartLoading || refreshCartLoading) ?
							
							(
								<>
									<div className={`dark:hidden flex items-center justify-center py-1.25 md:py-2.75 ${cartQuantity > 9 ? `px-0.5 md:px-1.25`: ``}`}>

										<Loader size="small" color="border-white" />

									</div>
									
											
									<div className={`hidden dark:flex items-center justify-center py-1.25 md:py-2.75 ${cartQuantity > 9 ? `px-0.5 md:px-1.25`: ``}`}>

										<Loader size="small" color="border-gray-600" />

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

						
				{/* Cart Items */}
				
					<div className="flex-1 [&::-webkit-scrollbar]:hidden overflow-y-scroll md:space-y-2">
						

						{
							localCart.map((item) =>
							{
								const product = item.product;
							

								if (!product) return null;


								// ++cartItemCount;


									// use this class inside the div below to not get a bottom border for the last cart item:

										//	${(cartItemCount === localCart.length) ? `` : `border-b`}
							

								return (
									
									<div key={item.$id} className={`relative flex gap-3 max-md:border-gray-500 border-b py-2 md:py-3`}>
									
										{/* Discount badge */}
										
											{item.discount_value > 0 && (
												<div
												className={`absolute top-17.5 md:top-30 ${
													product.price > 9.99
													? "px-0.75 md:px-1"
													: "px-1.5 md:px-1.75"
												} bg-green-700 text-white font-extrabold text-[7px] md:text-[11px] active:-translate-y-1  hover:-translate-y-1 p-0.5 md:p-0.75 rounded-full transition-all duration-200`}
												>
												{product.discount_tag}
												</div>
											)}
											
										
										{/* wishlist heart */}
					
											<div
										
												className={`absolute cursor-pointer left-14 top-15.75 md:top-28 active:-translate-y-0.5 hover:-translate-y-0.5 p-2 rounded-full transition-all duration-200`}
										
												onClick={() => {handleFavouriteClick(item.product.$id)}}
											>

												<img
										
													src={isProductFavourite(product.$id) ? `/icons/heart.png` : `/icons/heart.svg`}
											
													alt="wishlist"
													
													className="w-3.5 md:w-6"
												/>
											
											</div>

										
										{/* Product image */}
										
											<img
												src={product.image_url}
												alt={product.name}
												className="cursor-pointer w-20 h-15.75 md:w-22 md:h-26 rounded-lg object-scale-down"
												onClick={() => {!((updatingItemId) || (removingItemId) || clearCartLoading || refreshCartLoading) && handleClick(product);}}
											/>

										
										{/* Product details */}
										
											<div className="flex-1">
												<div className="flex justify-between">
												
													{/* PRODUCT NAME */}
													
														<p
															className="font-mono max-md:text-[11px] md:text-[17px]  text-black dark:text-white dark:md:text-gray-100 dark:md:hover:text-gray-300  md:text-gray-700 cursor-pointer md:hover:text-gray-900 font-bold md:font-semibold mt-1 md:mt-2.5"
															onClick={() => {!((updatingItemId) || (removingItemId) || clearCartLoading || refreshCartLoading) && handleClick(product);}}
														>
															{product.name}
														</p>
												
												<div className="flex items-center gap-2 ml-3 mt-1">
													
													{/* PRODUCT QUANTITY */}
														
														<span
														className={`text-white text-[17px] md:text-[25px] active:-translate-y-1 hover:-translate-y-1 dark:bg-yellow-300 dark:active:bg-orange-400 dark:hover:bg-orange-400 dark:text-gray-600 bg-yellow-500 active:bg-orange-600 hover:bg-orange-600 ${
															item.quantity > 9 ? "px-3" : "px-4.5"
														} rounded-full font-bold transition-all duration-200`}
														>
														{
															((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading || refreshCartLoading) ?
															
															(
																<>	
																	<div className={`dark:hidden flex items-center justify-center py-1.25 md:py-2.75 ${item.quantity > 9 ? `px-0.5 md:px-1.5` : ``}`}>
											
																		<Loader size="small" color="border-white" />
											
																	</div>
																	
																	
																	<div className={`hidden dark:flex items-center justify-center py-1.25 md:py-2.75 ${item.quantity > 9 ? `px-0.5 md:px-1.5` : ``}`}>
											
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

											</div>


												{/* PRODUCT UPDATION BUTTONS */}
												
													<div className="flex md: mt-0.75 md:mt-4 gap-5 md:gap-6">
															
														<button
															className={`flex mb-1 ${
															((product.stock === 0) || clearCartLoading || refreshCartLoading)
																? "bg-gray-300"
																: "bg-yellow-500 dark:bg-yellow-300 dark:hover:bg-yellow-400 hover:bg-orange-600"
															} cursor-pointer justify-center items-center w-4.5 h-4.5 md:w-7 md:h-6 font-bold md:font-extrabold rounded-md max-md:text-[12px] md:text-md`}
															onClick=
															{
																async () =>
																{
																	setUpdatingItemId(item.$id);

																	await updateItem(item.$id, product.$id, 1)

																	setUpdatingItemId(null);
																}
															}
															disabled={(product.stock === 0) || (updatingItemId !== null) || clearCartLoading || refreshCartLoading || removingItemId !== null}
														>
															+
														</button>
														
														<button
															className={`flex mb-1 ${
															((item.quantity === 1) || clearCartLoading || refreshCartLoading)
																? "bg-gray-300"
																: "bg-yellow-500 dark:bg-yellow-300 dark:hover:bg-yellow-400 hover:bg-orange-600"
															} cursor-pointer justify-center items-center w-4.5 h-4.5 md:w-7 md:h-6 font-bold md:font-extrabold rounded-md text-sm max-md:text-[12px] md:text-md`}
															onClick=
															{
																async () =>
																{
																	setUpdatingItemId(item.$id);

																	await updateItem(item.$id, product.$id, -1)

																	setUpdatingItemId(null);
																}
															}
															disabled={(item.quantity === 1) || updatingItemId !== null || clearCartLoading || refreshCartLoading || removingItemId !== null}
														>
															−
														</button>
														
														<button
															className={`flex justify-center items-center rounded-md w-4.5 h-4.5 md:w-7 md:h-6 md:p-1 cursor-pointer ${(clearCartLoading || refreshCartLoading) ? `bg-gray-300` : `bg-red-400 hover:bg-red-500`}`}
															onClick={async() => {setRemovingItemId(item.$id); await removeItem(item.$id, product.$id); setRemovingItemId(null);}}
															disabled={removingItemId !== null || clearCartLoading || refreshCartLoading || updatingItemId !== null}
														>
															<img src="/icons/delete.png" alt="delete" />
														</button>
															
													</div>


												{/* Price + Subtotal */}
											
													<div className="flex justify-between mt-2 max-md:mb-px md:mb-1 md:mt-6">
													<div className="flex gap-1 md:gap-2">
														{item.discount_value > 0 && (
														<p className="text-gray-500 dark:text-gray-300 max-md:text-[10px] md:text-md font-mono">
															{formatPrice(product.price, product.currency, item.discount_value)}
														</p>
														)}
														<p
														className={`text-gray-500 md:text-md font-mono ${
															item.discount_value
															? "line-through max-md:text-[8px] md:text-sm dark:text-gray-400"
															: "max-md:text-[10px] dark:text-gray-300"
														}`}
														>
														{formatPrice(product.price, product.currency)}
														</p>
													</div>
													<p className={`text-gray-700 dark:text-white dark:md:text-gray-100 max-sm:text-[10px] font-mono */${(item.subtotal <= 9.99) ? `max-md:mr-2.5` :  (item.subtotal <= 99.99) ? `max-md:mr-1.75` : `max-md:mr-1.25`}*/`}>
														{formatPrice(item.subtotal, product.currency)}
													</p>
													</div>
											
											</div>
									
									</div>
								);
							
							})
						}
					
						
					</div>

						
				{/* Footer / Checkout */}
				
					<div className="border-t-3 dark:max-md:border-gray-500 pt-2 md:pt-5">
						
						<p className="flex justify-between items-center font-extrabold dark:text-orange-400 text-orange-500 max-md:mb-0.5">
						
							<span className="text-black dark:text-white text-[15px] md:text-[23px]">Total (USD):</span>
							
							<span className="text-[21px] md:text-[32px]">{formatPrice(cartTotal, "USD")}</span>
						
						</p>
						

						<div className="grid grid-cols-3 gap-2">

							<button
						
								className={`w-full ${(!cartQuantity || isOnCheckoutPage || clearCartLoading || refreshCartLoading || removingItemId !== null || updatingItemId !== null) ? `bg-gray-400 text-black` : `${isCheckoutPage ? `bg-orange-600 dark:bg-orange-500` : `bg-yellow-500 dark:bg-yellow-300 dark:hover:bg-orange-400 hover:bg-orange-600`} text-white dark:text-gray-600 hover:-translate-y-1 transition-all duration-200`} col-span-2 py-1 md:py-2 rounded-full mt-1 md:mt-3 md:text-2xl font-bold md:font-extrabold`}
								
								onClick={() => navigate("/checkout")}
					
								disabled={isOnCheckoutPage || clearCartLoading || refreshCartLoading || !cartQuantity || removingItemId !== null || updatingItemId !== null}
							>
	
								{isCheckoutPage ? "Continue to Checkout" : "Checkout"}
						
							</button>

									
							<button 
						
								className={`${(!cartQuantity || refreshCartLoading || removingItemId !== null || updatingItemId !== null) ? `bg-gray-400 text-black` : `bg-red-600 text-white hover:-translate-y-1 transition-all duration-200`} rounded-full mt-1 md:mt-3 py-1 md:py-2 font-bold max-md:text-sm md:text-xl md:font-extrabold`}
								
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
					
								disabled={clearCartLoading || refreshCartLoading || !cartQuantity || removingItemId !== null || updatingItemId !== null}
							>
										
								{clearCartLoading ? 
								
									(
										<div className="flex items-center justify-center">
				
											<Loader size="medium" color="border-white border-5" />
				
										</div>
									) 
									
									: 
									
									(
										"Clear Cart"
									)
								}
							
							</button>

						</div>

					</div>
				
				</div>

			</div>
		
		</div>

	);
}