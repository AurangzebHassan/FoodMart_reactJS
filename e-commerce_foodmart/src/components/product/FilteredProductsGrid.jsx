import { useState, useEffect } from "react";

import { getAllProducts, getAllCategories } from "../../appwrite/db"; // your DB calls

import ProductCard from "./ProductCard";

import Loader from "../Loader";



export default function FilteredProductsGrid()
{
    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);
  
    const [selectedCategory, setSelectedCategory] = useState("all");


    const [loading, setLoading] = useState(true);
        
    const [error, setError] = useState(null);



  // fetch products and categories
  
        useEffect(() =>
        {
            async function loadData()
            {
                setLoading(true);

                setError(null);


                const prods = await getAllProducts();
        
                const cats = await getAllCategories();
        
        
                setProducts(prods);
        
                setCategories(cats);

                setLoading(false);
            }
        
            loadData();

        }, []);

    
    
    // filtered products
  
        const filteredProducts = selectedCategory === "all" ? products : products.filter((p) => p.category_id === selectedCategory);


    
    if (loading)
      
      return (
      
        <div className="py-10 flex w-full gap-2 items-center justify-center">
        
          <span className="text-yellow-500 text-2xl font-extrabold"> Loading Filtered Products Grid </span>

          <Loader size="xl" color="border-yellow-500" />
        
        </div>
      
      );
  
    
    if (error) console.warn("Filtered products grid fetch error:", error);






  return (
    
    <div className="container mx-auto px-3 py-10">
    
        {/* Category Filters */}
    
        <div className="flex justify-between gap-15 md:gap-30 mb-6">
        
            <h2 className="text-3xl font-bold text-gray-800">Products</h2>
              

            <div className="flex gap-3 lg:gap-6 xl:gap-10 2xl:gap-17 border-b border-gray-100 pr-5 mt-2 overflow-x-auto lg:overflow-x-visible">

                <button
            
                    className={`text-gray-400 text-nowrap text-[10px] md:text-sm lg:text-md xl:text-lg font-semibold border-b-3 border-gray-100 hover:border-yellow-500 pb-2 transition-all duration-200 ease-in-out ${selectedCategory === "all" ? "text-gray-800 font-bold border-yellow-500" : ""}`}
            
                    onClick={() => setSelectedCategory("all")}
                >
            
                    All
            
                </button>

        
                {categories.map((cat) => (
            
                    <button
                
                        key={cat.$id}
                
                        className={`text-gray-400 text-nowrap text-[10px] md:text-sm lg:text-md xl:text-lg pb-2 font-semibold border-b-3 border-gray-100 hover:border-yellow-500 transition-all duration-200 ease-in-out ${selectedCategory === cat.$id ? "text-gray-800 font-bold border-yellow-500" : ""}`}
                
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
                    <div className="gap-y-2 md:gap-y-5 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                
                        {filteredProducts.map((product) => (
                                    
                            <ProductCard key={product.$id} Product={product} />

                        ))}
            
                    </div>
                )      
                
                :
                
                (
                    <div className="flex w-full h-100 mt-10 md:mt-25 justify-center text-yellow-500 font-bold md:text-xl">

                        No Products in Category

                    </div>
                )
            }      
          
    </div>
  
  );
}