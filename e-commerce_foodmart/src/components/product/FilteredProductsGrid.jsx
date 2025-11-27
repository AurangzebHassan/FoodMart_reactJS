import { useState, useEffect } from "react";

import { getAllProducts, getAllCategories } from "../../appwrite/db"; // your DB calls

import ProductCard from "./ProductCard";



export default function FilteredProductsGrid()
{
    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);
  
    const [selectedCategory, setSelectedCategory] = useState("all");



  // fetch products and categories
  
        useEffect(() =>
        {
            async function loadData()
            {
                const prods = await getAllProducts();
        
                const cats = await getAllCategories();
        
        
                setProducts(prods);
        
                setCategories(cats);
            }
        
            loadData();

        }, []);

    
    
    // filtered products
  
    const filteredProducts = selectedCategory === "all" ? products : products.filter((p) => p.category_id === selectedCategory);






  return (
    
    <div className="container mx-auto px-3 py-10">
    
        {/* Category Filters */}
    
        <div className="flex justify-between mb-6">
        
            <h2 className="text-3xl font-bold text-gray-800">Products</h2>


            <div className="flex gap-3 lg:gap-6 xl:gap-10 2xl:gap-17 border-b border-gray-100 pl-10 md:pl-15 pr-5 lg:mt-2">

                <button
            
                    className={`text-gray-400 md:text-sm lg:text-md xl:text-lg font-semibold border-b-3 border-gray-100 hover:border-yellow-500 pb-2 transition-all duration-200 ease-in-out ${selectedCategory === "all" ? "text-gray-800 font-bold border-yellow-500" : ""}`}
            
                    onClick={() => setSelectedCategory("all")}
                >
            
                    All
            
                </button>

        
                {categories.map((cat) => (
            
                    <button
                
                        key={cat.$id}
                
                        className={`text-gray-400 md:text-sm lg:text-md xl:text-lg pb-2 font-semibold border-b-3 border-gray-100 hover:border-yellow-500 transition-all duration-200 ease-in-out ${selectedCategory === cat.$id ? "text-gray-800 font-bold border-yellow-500" : ""}`}
                
                        onClick={() => setSelectedCategory(cat.$id)}
                    >
                
                        {cat.name}
            
                    </button>
            
                ))}
            
            </div>  

        </div>

          
        {/* Products Grid */}
      
            {filteredProducts.length > 0 ?
                
                (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                
                        {filteredProducts.map((product) => (
                                    
                            <ProductCard key={product.$id} Product={product} />

                        ))}
            
                    </div>
                )      
                
                :
                
                (
                    <div className="flex w-full h-100 mt-25 justify-center text-yellow-500 font-bold text-xl">

                        No Products in Category

                    </div>
                )
            }      
          
    </div>
  
  );
}