import React from "react";



/*
  ✅ A simple reusable card that displays one category.
  
    It receives props for:
        - icon (image or emoji)
        - name (category name)
        - color (icon color)
*/



export default function CategoryCard({ icon, name, color })
{
    return (

        // wrapper div with hover and shadow

            <div

                className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-60 h-48 mx-auto cursor-pointer"
            >
        
                {/* Icon section */}
        
                    <div
            
                        className="text-5xl mb-3"
                
                        style={{ color }}
                    >
                
                        {icon}
            
                    </div>

        
                {/* Category name */}
        
                    <p className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition">{name}</p>
            
        </div>
        
  );
}