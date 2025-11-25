import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { getAllCategories, getProductsByCategory, incrementCategoryViewCount } from "../appwrite/db";

import Navbar from "../components/Navbar";

import ProductCard from "../components/product/ProductCard";



export default function CategoryPage()
{
    const { slug } = useParams();

    const [category, setCategory] = useState(null);

    const [products, setProducts] = useState([]);

    const navigate = useNavigate();



    useEffect(() =>
    {
        async function fetchData()
        {
            const categories = await getAllCategories();
        
            const cat = categories.find(c => c.slug === slug);
        
            if (!cat) return; // optional: handle 404


            setCategory(cat);


            // Increment view count here (page load)
            
                await incrementCategoryViewCount(cat.$id);

            
            const catProducts = await getProductsByCategory(cat.$id);
            
            setProducts(catProducts);
        }

        fetchData();

    }, [slug]);



    if (!products || !category)
    {
        return (
      
            <div className="flex w-full h-screen items-center justify-center bg-yellow-500">
        
                <p className="text-3xl font-bold text-white text-center">
          
                    Loading Category...
                </p>
                
      
            </div>
    
        );
    }






    return (
    
        <>
    
            <Navbar />
    
            <div className="container mx-auto mt-3 py-6 px-5 flex-col">

                <div className="flex mb-10">

                    <button 
        
                        className="flex items-center justify-center w-25 px-4 py-1 text-black font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                    
                        onClick={() => navigate(-1)}
                    >
                
                        ← Back
                
                    </button>

                    <div className="w-full flex items-center justify-center gap-2">

                        {category && (
                            
                            <>
                            
                                <img src={category.image_url} alt={category.name} className="w-10" />

                                <h1 className="text-3xl text-yellow-500 font-bold">{category?.name}</h1> 
                            
                            </>
                                
                        )}

                    </div>

                </div>
                
    
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:pl-20 md:pr-8 gap-x-10">
    
                    {products.map(p => (
    
                        <ProductCard key={p.$id} Product={p} />
                        
                    ))}
                
                </div>
            
            </div>
        
        </>

    );
}