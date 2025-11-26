import React, { useRef, useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";


import "swiper/css";

import "swiper/css/navigation";


import ProductCard from "./ProductCard";

import { getTrendingProducts } from "../../appwrite/db";

import Loader from "../Loader";



export default function TrendingCarousel()
{
    // local state
  
        const [products, setProducts] = useState([]);
    
        const [loading, setLoading] = useState(true);
    
        const [error, setError] = useState(null);
  
  
    // swiper navigation refs
  
        const prevRef = useRef(null);
    
        const nextRef = useRef(null);
  

      const [isBeginning, setIsBeginning] = useState(true);

      const [isEnd, setIsEnd] = useState(false);

      const [isLocked, setIsLocked] = useState(false);

  
  
    // fallback data (used if Appwrite fails)
  
        const fallbackProducts = 
        [
            {
            $id: "local_heinz",
            name: "Heinz Tomato Ketchup",
            slug: "heinz-tomato-ketchup",
            price: 18,
            currency: "USD",
            stock: 5,
            image_url: "/images/products/heinz_tomato_ketchup.png",
            rating: 4.6,
            discount_tag: "-30%",
            },
            {
            $id: "local_orange",
            name: "Fruita Vitals Orange Juice",
            slug: "fruita-vitals-orange-juice",
            price: 21,
            currency: "USD",
            stock: 40,
            image_url: "/images/products/orange_juice.png",
            rating: 5,
            discount_tag: "-15%",
            },
        ];

    
  
    // 🟢 Fetch new arrival products
  
        useEffect(() =>
        {
            let mounted = true;


            async function loadProducts()
            {
                setLoading(true);
            
                setError(null);
        
    
                try
                {
                    const docs = await getTrendingProducts();


                    if (mounted)
                    {
                        if (docs && docs.length > 0)
                        {
                            setProducts(docs);
                        } 
            
                        else
                        {
                            setProducts(fallbackProducts);
                        }
                    }
                }
                
                catch (err)
                {
                    console.error("Failed to load trending products:", err);
            
            
                    if (mounted)
                    {
                        setError(err.message || "Failed to fetch trending products");
            
                        setProducts(fallbackProducts);
                    }
                }
                
                finally
                {
                    if (mounted) setLoading(false);
                }
            }
        

            loadProducts();


            return () => (mounted = false);
        },
            
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        
        );



    if (loading)
      
      return (
      
        <div className="py-10 flex w-full gap-2 items-center justify-center">
        
          <span className="text-yellow-500 text-2xl font-extrabold"> Loading Trending Products </span>

          <Loader size="xl" color="border-yellow-500" />
        
        </div>
      
      );
  
    
    if (error) console.warn("Trending products fetch error:", error);






  return (
    <section className="container mx-auto px-5 py-6 overflow-hidden">
      {/* 🟩 HEADER ROW */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Trending Products</h2>

        {/* 🟩 RIGHT SIDE: 'View All' + arrows */}
        <div className="flex items-center gap-3">
          
          {
            !isLocked && 
           
              (<a
                href="/products/trending-products"
                className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 mr-2"
              >
                View All →
              </a>)
          }
            
          <button
            ref={prevRef}
            disabled={isBeginning}
            className={`text-3xl rounded-md w-12 h-9 flex items-center justify-center shadow-sm transition-all duration-200 
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
            className={`text-3xl rounded-md w-12 h-9 flex items-center justify-center shadow-sm transition-all duration-200 
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

      {/* 🟩 SWIPER SECTION */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        style={{ overflow: "visible" }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 4, spaceBetween: 30 },
          1536: { slidesPerView: 5, spaceBetween: 30 },
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();

          // update arrow states on slide change
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
          setIsLocked(swiper.isLocked);

          swiper.on("slideChange", () => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            setIsLocked(swiper.isLocked)
          });

          swiper.on("resize", () => {
            setIsLocked(swiper.isLocked);
          });
        }}
      >
        
        
        {products.map((prod) => (
          
            <SwiperSlide key={prod.$id}>
            
                <ProductCard Product={prod} />
          
            </SwiperSlide>
        ))}
        
              
      </Swiper>
    </section>
  );
}