import { useState, useEffect } from "react";

import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { formatPrice } from "../utils/formatPrice";

import { formatDiscount } from "../utils/formatDiscount.js";

import Loader from "./Loader.jsx"



export default function CartDrawer({ onClose })
{
	const { user } = useAuth();
	const {
	cartItems,
	cartQuantity,
	cartTotal,
	updateItem,
	removeItem,
	clearCart,
	} = useCart();

	const navigate = useNavigate();
	


	//   const [checkoutLoading, setCheckoutLoading] = useState(false);

	const [removingItemId, setRemovingItemId] = useState(null);
  	
	const [updatingItemId, setUpdatingItemId] = useState(null);

	const [clearCartLoading, setClearCartLoading] = useState(false);



	const [isVisible, setIsVisible] = useState(false);



	useEffect(() =>
	{
		document.body.style.overflow = "hidden";
		setTimeout(() => setIsVisible(true), 10);
		return () => {
			document.body.style.overflow = "";
		};
	}, []);



	const handleClose = () => {
	setIsVisible(false);
	setTimeout(() => onClose(), 200);
	};



	const handleOverlayClick = (e) => {
	if (e.target === e.currentTarget) handleClose();
	};



	const handleClick = (product) => {
	if (!product.slug) return;
	navigate(`/product/${product.slug}`);
	};



	if (!cartItems)
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
			<div className="flex h-screen justify-center items-center text-4xl text-yellow-500 font-bold">
			Loading...
			</div>
		</div>
		</div>
	);






	return (

		<>
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
				className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${
					isVisible ? "translate-x-0" : "translate-x-full"
				}`}
				>
				{/* Close Button */}
					
						<div className="flex justify-center">

							<button
						
								onClick={handleClose}
						
								className="text-gray-600 hover:text-gray-900 text-6xl"
							>
						
								&times;
					
							</button>		
						
						</div>


				{/* Header */}
				
					<div className="flex justify-between items-center mb-10 mt-4">

						<h1 className="text-3xl font-extrabold text-yellow-500">Your Cart</h1>
						
						<span
						className={`text-white text-[25px] hover:-translate-y-1 bg-yellow-500 hover:bg-orange-600 ${
							cartQuantity > 9 ? "px-3" : "px-4.5"
						} rounded-full font-bold transition-all duration-200`}
						>
						{
							((updatingItemId) || (removingItemId) || clearCartLoading/* || checkoutLoading*/) ?
							
							(
								<div className="flex items-center justify-center py-3 px-1.5">

									<Loader size="small" color="border-white" />

								</div>
							) 
						
							: 
							
							(
								cartQuantity
							)
						}
						</span>
						
					</div>

						
				{/* Cart Items */}
				
					<div className="flex-1 [&::-webkit-scrollbar]:hidden overflow-y-scroll space-y-2">
						{cartItems.map((item) => {
						const product = item.product;
						if (!product) return null;
						
						return (
							
							<div key={item.$id} className="relative flex gap-3 border-b py-4">
							
								{/* Discount badge */}
								
									{formatDiscount(product.discount_tag) && (
										<div
										className={`absolute ${
											product.price > 9.99
											? "top-2 left-12 px-0.75"
											: "left-12 px-1.5"
										} bg-green-700 text-white font-extrabold text-sm cursor-pointer hover:-translate-y-1 p-0.5 rounded-full transition-all duration-200`}
										>
										{product.discount_tag}
										</div>
									)}
									
								
								{/* wishlist heart */}
			
									{/* <div
								
										className={`absolute top-7 right-7 bg-white hover:-translate-y-0.5 p-3 rounded-full transition-all duration-200`}
								
										onClick={() => {handleFavouriteClick()}}
									>

										<img
								
											src={isFavourite ? `/icons/heart.png` : `/icons/heart.svg`}
									
											alt="wishlist"
											
											className="w-8"
										/>
									
									</div> */}

								
								{/* Product image */}
								
									<img
										src={product.image_url}
										alt={product.name}
										className="cursor-pointer w-20 h-25 rounded-lg object-cover"
										disabled={(updatingItemId === item.$id || removingItemId === item.$id || clearCartLoading/* || checkoutLoading*/)}
										onClick={() => {!((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading)/* || !checkoutLoading*/ && handleClick(product);}}
									/>

								
								{/* Product details */}
								
									<div className="flex-1">
										<div className="flex justify-between items-center">
										
											{/* PRODUCT NAME */}
											
												<p
													className="font-mono text-lg text-gray-700 cursor-pointer hover:text-gray-900 font-semibold mt-1"
													disabled={(updatingItemId === item.$id || removingItemId === item.$id || clearCartLoading/* || checkoutLoading*/)}
													onClick={() => {!((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading)/* || !checkoutLoading*/ && handleClick(product);}}
												>
													{product.name}
												</p>
										
										<div className="flex items-center gap-2 ml-11 mt-1">
											
											{/* PRODUCT UPDATION BUTTONS */}
											
												<div className="flex-col mt-0.5">
												
													<button
														className={`flex mb-1 ${
														((product.stock === 0) || clearCartLoading || (updatingItemId === item.$id) || removingItemId === item.$id/* || checkoutLoading*/)
															? "bg-gray-300"
															: "bg-yellow-300 hover:bg-orange-600"
														} cursor-pointer justify-center items-center w-5 h-5 font-bold rounded-md text-sm`}
														onClick=
														{
															async () =>
															{
																setUpdatingItemId(item.$id);

																await updateItem(item.$id, product.$id, 1)

																setUpdatingItemId(null);
															}
														}
														disabled={(product.stock === 0) || (updatingItemId === item.$id) || clearCartLoading || removingItemId === item.$id/* || checkoutLoading*/}
													>
														+
													</button>
													
													<button
														className={`flex mb-1 ${
														((item.quantity === 1) || clearCartLoading || updatingItemId === item.$id || removingItemId === item.$id/* || checkoutLoading*/)
															? "bg-gray-300"
															: "bg-yellow-300 hover:bg-orange-600"
														} cursor-pointer justify-center items-center w-5 h-5 font-bold rounded-md text-sm`}
														onClick=
														{
															async () =>
															{
																setUpdatingItemId(item.$id);

																await updateItem(item.$id, product.$id, -1)

																setUpdatingItemId(null);
															}
														}
														disabled={(item.quantity === 1) || updatingItemId === item.$id || clearCartLoading || removingItemId === item.$id/* || checkoutLoading*/}
													>
														−
													</button>
													
													<button
														className={`flex justify-center items-center rounded-md w-5 h-5 cursor-pointer ${(clearCartLoading || (removingItemId === item.$id) || updatingItemId === item.$id/* || checkoutLoading*/) ? `bg-gray-300` : `bg-red-400 hover:bg-red-500`}`}
														onClick={async() => {setRemovingItemId(item.$id); await removeItem(item.$id, product.$id); setRemovingItemId(null);}}
														disabled={removingItemId === item.$id || clearCartLoading || updatingItemId === item.$id/* || checkoutLoading*/}
													>
														<img src="/icons/delete.png" alt="delete" />
													</button>
												
												</div>

											{/* PRODUCT QUANTITY */}
												
												<span
												className={`text-white text-[25px] hover:-translate-y-1 bg-yellow-500 hover:bg-orange-600 ${
													item.quantity > 9 ? "px-3" : "px-4.5"
												} rounded-full font-bold transition-all duration-200`}
												>
												{
													((updatingItemId === item.$id) || (removingItemId === item.$id) || clearCartLoading/* || checkoutLoading*/) ?
													
													(
														<div className={`flex items-center justify-center py-3 ${item.quantity > 9 ? `px-1.5` : ``}`}>
								
															<Loader size="small" color="border-white" />
								
														</div>
													) 
												
													: 
													
													(
														item.quantity
													)
												}
												</span>
											
										</div>
										
										
										</div>

										{/* Price + Subtotal */}
									
											<div className="flex justify-between mt-10">
											<div className="flex gap-2">
												{formatDiscount(product.discount_tag) && (
												<p className="text-gray-500 text-md font-mono">
													{formatPrice(product.price, product.currency, product.discount_tag)}
												</p>
												)}
												<p
												className={`text-gray-500 text-md font-mono ${
													formatDiscount(product.discount_tag)
													? "line-through text-sm"
													: ""
												}`}
												>
												{formatPrice(product.price, product.currency)}
												</p>
											</div>
											<p className="text-gray-700 font-mono">
												{formatPrice(item.subtotal, product.currency)}
											</p>
											</div>
									
									</div>
							
							</div>
						);
						
						})}
					
					</div>

						
				{/* Footer / Checkout */}
				
					<div className="mt-3 border-t-3 pt-5">
						
						<p className="flex justify-between font-extrabold text-orange-500">
						
						<span className="text-black text-[19px]">Total (USD):</span>
						
						<span className="text-[25px]">{formatPrice(cartTotal, "USD")}</span>
						
						</p>
						

						<div className="grid grid-cols-3 gap-2">

							<button
						
								className={`w-full ${(!cartQuantity || removingItemId !== null || updatingItemId !== null) ? `bg-gray-400 text-black` : `bg-yellow-500 text-white hover:bg-orange-600 hover:-translate-y-1 transition-all duration-200`} col-span-2 py-2 rounded-full mt-3 text-[18px] font-extrabold`}
								
								// onClick=
								// {
								// 	async () =>
								// 	{
								// 		setCheckoutLoading(true);
					
								// 		await checkout();
					
								// 		setCheckoutLoading(false);
								// 	}
								// }
					
								disabled={/*checkoutLoading || */clearCartLoading || !cartQuantity || removingItemId !== null || updatingItemId !== null}
							>
								
								{/* {checkoutLoading ? 
								
									(
										<div className="flex items-center justify-center">
				
											<Loader size="medium" color="border-white" />
				
										</div>
									) 
									
									: 
									
									(
										"Checkout"
									)
								} */}
									
									Checkout
						
							</button>

									
							<button 
						
								className={`${(!cartQuantity || removingItemId !== null || updatingItemId !== null) ? `bg-gray-400 text-black` : `bg-red-600 text-white hover:-translate-y-1 transition-all duration-200`} rounded-full mt-3 py-2 font-extrabold`}
								
								onClick=
								{
									async () =>
									{
										setClearCartLoading(true);
					
										await clearCart();
					
										setClearCartLoading(false);
									}
								}
					
								disabled={clearCartLoading || !cartQuantity || removingItemId !== null || updatingItemId !== null/* || checkoutLoading*/}
							>
										
								{clearCartLoading ? 
								
									(
										<div className="flex items-center justify-center">
				
											<Loader size="medium" color="border-white" />
				
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
		
		</>

	);
}