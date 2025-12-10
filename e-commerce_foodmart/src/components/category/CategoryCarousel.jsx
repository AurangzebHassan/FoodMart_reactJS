import React, { useRef, useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";


import "swiper/css";

import "swiper/css/navigation";


import CategoryCard from "./CategoryCard";

import Loader from "../Loader";



// import Appwrite helpers from your db.js

	import { getAllCategories } from "../../appwrite/db";
		


/*

		CategoryCarousel (Appwrite-backend)

		- On mount, fetch categories from Appwrite collection `CATEGORIES_TABLE_ID` using db.js helper function.

		- Shows loading state while fetching.

		- If fetch fails, falls back to a small hardcoded array so UI doesn't break.

		- Keeps your custom prev/next buttons and disables them correctly at ends.

*/






export default function CategoryCarousel()
{
		// local UI state
	
				const [categories, setCategories] = useState([]); // array of category docs
		
				const [loading, setLoading] = useState(true); // true while fetching
		
				const [error, setError] = useState(null); // store fetch error (if any)


				
		// fallback local categories (used only if remote fetch fails)
		
				const fallbackCategories = 
				[
						{
								$id: "local_fruits",

								name: "Fruits & Veggies",

								slug: "fruits-veggies",

								image_url: "/icons/categories/veggies_category.png"
						
								// icon: <img src="/icons/categories/veggies_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
						},
						
						{
								$id: "local_bread",

								name: "Bread & Sweets",

								slug: "bread-sweets",

								image_url: "/icons/categories/bread_baguette_category.png"
						
								// icon: <img src="/icons/categories/bread_baguette_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
						},
						
						{
								$id: "local_drinks",

								name: "Drinks & Juices",

								slug: "drinks-juices",

								image_url: "/icons/categories/soft_drinks_category.png"
						
								// icon: <img src="/icons/categories/soft_drinks_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
						},
				];



	// 🟢 NEW: create refs to link Swiper to custom buttons
	
		const prevRef = useRef(null);
	
		const nextRef = useRef(null);


		// 🟢 State to track disabled status
	
				const [isBeginning, setIsBeginning] = useState(true);
	
				const [isEnd, setIsEnd] = useState(false);
				
		
		
		
		
		
		// fetch categories from Appwrite on mount
	
			useEffect(() =>
			{
				let mounted = true;


				async function loadCategories()
				{
						setLoading(true);
						
						setError(null);


						try
						{                  
							const docs = await getAllCategories();

							
							// Appwrite returns objects in docs
						
								if (mounted)
								{
									if (docs && docs.length > 0)
									{
										// map documents to expected shape (ensure image_url exists)
							
											const mapped = docs.map((doc) => (
													
											{
												$id: doc.$id,
						
												name: doc.name ?? "Unnamed",
						
												image_url: doc.image_url ?? "/icons/categories/placeholder.png",
						
												slug: doc.slug ?? "",
						
												description: doc.description ?? "",
											}));
								
										
											setCategories(mapped);
										} 
								
									else
									{
										// no rows found — use fallback
								
											setCategories(fallbackCategories);
									}
								}
						}
						
						catch (err)
						{
							// on error, fall back but keep the error visible in console/ state
					
								console.error("Failed to load categories from Appwrite:", err);
						

							if (mounted)
							{
								setError(err.message || "Failed to fetch categories");
								
								setCategories(fallbackCategories);
							}
						} 
						
						finally
						{
							if (mounted) setLoading(false);
						}
						
				}

					loadCategories();

			
					// cleanup
			
						return () => mounted = false;
			
			// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []); // empty deps → run once on mount
		
		
		


		
		if (loading) return (
		
			<div className="py-10 flex w-full gap-2 items-center justify-center">

				<span className="text-yellow-500 md:text-2xl font-extrabold"> Loading categories </span>
			
				<Loader size="small md:xl" color="border-yellow-500" />

			</div>
		
		);
		
		if (error) console.warn("Category fetch error:", error);






	return (   
		<section className="container mx-auto px-5 py-10 overflow-hidden">
			{/* 🟢 HEADER ROW */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl md:text-3xl font-bold text-gray-800">Category</h2>

				{/* 🟢 RIGHT SIDE: 'View All' + arrows */}
				<div className="flex items-center gap-3">
					<a
						href="/category"
						className="max-md:text-[12px] text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 mr-2"
					>
						View All →
					</a>

					{/* 🟢 Custom navigation buttons */}
					<button
						ref={prevRef}
						disabled={isBeginning}
						className={`text-3xl rounded-md w-8 md:w-12 md:h-9 flex items-center justify-center shadow-sm transition-all duration-200 
							${
								isBeginning
									? "bg-gray-200 text-gray-400"
									: "bg-gray-200 hover:bg-yellow-500 text-gray-900"
							}`}
					>
						‹
					</button>

					<button
						ref={nextRef}
						disabled={isEnd}
						className={`text-3xl rounded-md w-8 md:w-12 md:h-9 flex items-center justify-center shadow-sm transition-all duration-200 
							${
								isEnd
									? "bg-gray-200 text-gray-400"
									: "bg-gray-200 hover:bg-yellow-500 text-gray-900"
							}`}
					>
						›
					</button>
				</div>
			</div>

			{/* 🟢 SWIPER SECTION */}
			<Swiper
				modules={[Navigation]}
				spaceBetween={30}
				slidesPerView={3}
				// 🟢 Allow cards to hover and cast shadows
				style={{ overflow: "visible" }}
				breakpoints={{
					0: { slidesPerView: 2, spaceBetween: 20 },
					// 320: { slidesPerView: 2, spaceBetween: 20 },
					640: { slidesPerView: 2, spaceBetween: 20 },
					1024: { slidesPerView: 3, spaceBetween: 30 },
					1280: { slidesPerView: 4, spaceBetween: 30 },
					1536: { slidesPerView: 5, spaceBetween: 30 },
				}}
				// 🟢 Assign navigation buttons AFTER Swiper initializes
			 // 🟢 Connect Swiper navigation buttons after init
				onInit={(swiper) => {
					swiper.params.navigation.prevEl = prevRef.current;
					swiper.params.navigation.nextEl = nextRef.current;
					swiper.navigation.init();
					swiper.navigation.update();

					// initial state setup
					setIsBeginning(swiper.isBeginning);
					setIsEnd(swiper.isEnd);

					// listen for slide change
					swiper.on("slideChange", () => {
						setIsBeginning(swiper.isBeginning);
						setIsEnd(swiper.isEnd);
					});
				}}
			>
				
				{/* {categories.map((cat, i) => (
					<SwiperSlide key={i}>
						<CategoryCard icon={cat.icon} name={cat.name} />
					</SwiperSlide>
				))} */}
							


				{/* Render slides from categories (use $id as key) */}
						
							{categories.map((cat) => (
						
									<SwiperSlide key={cat.$id}>
								
											
										{/* CategoryCard expects icon + name; we pass an <img> for icon */}
								
											<CategoryCard
								
												Category={cat}
													
												//   icon={<img src={cat.image_url} alt={cat.name} className="w-10 h-10 mb-3" />}
								
												//   name={cat.name}
											/>
						
									</SwiperSlide>
							))}
							
			</Swiper>
		</section>
	);
}
