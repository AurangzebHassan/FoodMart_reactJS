import React from "react";

import { useNavigate } from "react-router-dom"; // 🟢 For navigation between routes



/*
  ✅ A simple reusable card that displays one category.
  
    It receives prop for:
        
        -Category(object)
*/



export default function CategoryCard({ Category })
{
    const navigate = useNavigate();



    // 🟢 Handle click → navigate to /category/{slug}
    
        const handleClick = () =>
        {
            if (!Category.slug) return; // safety check
        
            navigate(`/category/${Category.slug}`);
        };






    return (

        // wrapper div with hover and shadow

            <div

                className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-60 h-48 mx-auto cursor-pointer"
                
            onClick={handleClick}
            >
        
                {/* Icon section */}
        
                    <div className="text-5xl mb-3">
                
                        <img src={Category.image_url} alt={Category.name} className="w-10 h-10 mb-3" />
            
                    </div>

        
                {/* Category name */}
        
                    <p className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition">{Category.name}</p>
            
        </div>
        
  );
}