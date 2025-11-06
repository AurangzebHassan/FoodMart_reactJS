// import React from "react";



// // Swiper imports — main component + subcomponents for navigation

//     import { Swiper, SwiperSlide } from "swiper/react";

//     import { Navigation } from "swiper/modules";


// // Import Swiper styles (important!)

//     import "swiper/css";

//     import "swiper/css/navigation";


// // Import your CategoryCard

//     import CategoryCard from "./CategoryCard";



// /*
//   ✅ This component shows multiple CategoryCards in a carousel.
//   You can click left/right arrows to slide through them.
// */



// export default function CategoryCarousel()
// {
//   // Step 1 — Define your category data (array of objects)

//     const categories = 
//     [
//         {
//             name: "Fruits & Veggies",
        
//             icon: <img src="/icons/categories/veggies_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        
//             color: "green",
//         },
        
//         {
//             name: "Bread & Sweets",
        
//             icon: <img src="/icons/categories/bread_baguette_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        
//             color: "orange",
//         },
        
//         {
//             name: "Drinks & Juices",
        
//             icon: <img src="/icons/categories/soft_drinks_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        
//             color: "#EAB308", // yellowish
//         },
        
//         {
//             name: "Herbs & Ingredients",
        
//             icon: <img src="/icons/categories/herb_flour_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        
//             color: "dark-green",
//         },
        
//         {
//             name: "Meat & Poultry",
        
//             icon: <img src="/icons/categories/animal_products_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        
//             color: "red",
//         },
        
//         {
//             name: "Wine",
        
//             icon: <img src="/icons/categories/wine_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        
//             color: "dark-red",
//         },
//     ];






//   return (
    
//     <section className="container mx-auto px-5 py-10">
    
//           {/* Top bar with heading + link */}
    
//             <div className="flex justify-between items-center mb-6">
        
//                 {/* Left side heading */}
        
//                     <h2 className="text-3xl font-bold text-gray-800">Category</h2>

        
//                 {/* Right side link */}

//                     <a
                
//                         href="/categories"
                
//                         className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1"
            
//                     >
                
//                         View All Categories →
            
//                     </a>
                        
//             </div>

          
    
//           {/* Swiper Carousel */}

//           {/* The forward and backward buttons and the mechanism that makes it work */}
    
//             <Swiper
        
//                 // modules used
        
//                     modules={[Navigation]}
        

//                 // space between slides
        
//                     spaceBetween={20}
        
        
//                 // how many slides to show at once
        
//                     slidesPerView={3}
        
        
//                 // enable navigation arrows
        
//                     navigation={true}
        
        
//                 // responsive breakpoints
            
//                     breakpoints=
//                     {{
                
//                         320: { slidesPerView: 1 }, // small screen
                
//                         640: { slidesPerView: 2 }, // medium
                
//                         1024: { slidesPerView: 3 }, // large
                
//                         1280: { slidesPerView: 4 }, // extra large
            
//                     }}
        
        
//                 // Tailwind margin-top for spacing
        
//                     className="mySwiper"
        
//             >
        
                
//                 {/* Map through each category and render inside a SwiperSlide */}
        
//                     {categories.map((cat, index) => (
                
//                         <SwiperSlide key={index}>
                
//                             <CategoryCard icon={cat.icon} name={cat.name} color={cat.color} />
                
//                         </SwiperSlide>
            
//                     ))}
            
//             </Swiper>
            
          

//             {/* 🟢 Extra styling for arrows */}
        
//                 <style jsx>
                    
//                 {`
//                     /* Target Swiper built-in navigation buttons */
//                     .swiper-button-next,
//                     .swiper-button-prev {
//                     color: #333; /* dark gray arrows */
//                     background: #f9fafb; /* light gray background */
//                     padding: 5px;
//                     border-radius: 8px;
//                     width: 40px;
//                     height: 40px;
//                     top: -55px; /* 🟢 move arrows up near the heading */
//                     }

//                     /* 🟢 Hover effect for arrows */
//                     .swiper-button-next:hover,
//                     .swiper-button-prev:hover {
//                     background: #e5e7eb; /* darker hover */
//                     padding: 5px;
//                     color: black;
//                     }

//                     /* 🟢 Adjust arrow positions (right side near heading) */
//                     .swiper-button-prev {
//                     right: 60px;
//                     left: auto;
//                     }
//                     .swiper-button-next {
//                     right: 20px;
//                     }

//                     /* 🟢 Remove default arrow text content */
//                     .swiper-button-next::after,
//                     .swiper-button-prev::after {
//                     font-size: 14px;
//                     font-weight: bold;
//                     }
//             `   }
                
//                 </style>
    
//       </section>
      
//   );
// }










import React, { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";


import "swiper/css";

import "swiper/css/navigation";


import CategoryCard from "./CategoryCard";



export default function CategoryCarousel()
{
//   const categories = [
//     { name: "Fruits & Veges", icon: "🥦" },
//     { name: "Breads & Sweets", icon: "🍞" },
//     { name: "Drinks & Juices", icon: "🧃" },
//     { name: "Snacks", icon: "🍪" },
//     { name: "Frozen Foods", icon: "❄️" },
//   ];
    
    
    const categories = 
    [
        {
            name: "Fruits & Veggies",
        
            icon: <img src="/icons/categories/veggies_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        },
        
        {
            name: "Bread & Sweets",
        
            icon: <img src="/icons/categories/bread_baguette_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        },
        
        {
            name: "Drinks & Juices",
        
            icon: <img src="/icons/categories/soft_drinks_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        },
        
        {
            name: "Herbs & Ingredients",
        
            icon: <img src="/icons/categories/herb_flour_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        },
        
        {
            name: "Meat & Poultry",
        
            icon: <img src="/icons/categories/animal_products_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        },
        
        {
            name: "Wine",
        
            icon: <img src="/icons/categories/wine_category.png" alt="fruit" className="w-10 h-10 mb-3" />,
        },
    ];



  // 🟢 NEW: create refs to link Swiper to custom buttons
  
    const prevRef = useRef(null);
  
    const nextRef = useRef(null);





  return (
    <section className="container mx-auto px-5 py-10 overflow-hidden">
      {/* 🟢 HEADER ROW */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Category</h2>

        {/* 🟢 RIGHT SIDE: 'View All' + arrows */}
        <div className="flex items-center gap-3">
          <a
            href="/categories"
            className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 mr-2"
          >
            View All Categories →
          </a>

          {/* 🟢 Custom Swiper navigation buttons */}
          <button
            ref={prevRef}
            className="swiper-button-prev-custom bg-gray-200 hover:bg-yellow-500 text-gray-900 text-2xl rounded-md w-12 h-9 flex items-center justify-center shadow-sm"
          >
            ‹
          </button>
          <button
            ref={nextRef}
            className="swiper-button-next-custom bg-gray-200 hover:bg-yellow-500 text-gray-900 text-2xl rounded-md w-12 h-9 flex items-center justify-center shadow-sm"
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
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 4, spaceBetween: 30 },
          1536: { slidesPerView: 5, spaceBetween: 30 },
        }}
        // 🟢 Assign navigation buttons AFTER Swiper initializes
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {categories.map((cat, i) => (
          <SwiperSlide key={i}>
            <CategoryCard icon={cat.icon} name={cat.name} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
