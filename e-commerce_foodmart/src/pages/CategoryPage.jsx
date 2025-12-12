import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { getAllCategories, getProductsByCategory, incrementCategoryViewCount } from "../appwrite/db";

import Navbar from "../components/Navbar";

import ProductCard from "../components/product/ProductCard";

import Loader from "../components/Loader";



export default function CategoryPage()
{
    const { slug } = useParams();


    const navigate = useNavigate();


    const [category, setCategory] = useState(null);
    
    const [products, setProducts] = useState([]);


    const [loading, setLoading] = useState(true);



    useEffect(() =>
    {
        async function fetchData()
        {
            setLoading(true);


            const categories = await getAllCategories();
        
            const cat = categories.find(c => c.slug === slug);

            
            if (!cat)
            {
                setLoading(false);
             
                return;
            }


            setCategory(cat);

            
            await incrementCategoryViewCount(cat.$id);

            
            const catProducts = await getProductsByCategory(cat.$id);
            
            
            setProducts(catProducts);

            setLoading(false); // only stop AFTER cat + products fetched
        }

        fetchData();

    }, [slug]);


    
    if (loading)
    {
        // return (
    
        //     <div className="flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">
            
        //         <p className="text-4xl font-extrabold text-white text-center"> Loading Category </p>

                
        //         <Loader size="xl" color="border-white border-9" />

        //         <Loader size="large" color="border-white border-7" />

        //         <Loader size="medium" color="border-white border-6" />
            
        //     </div>
        
        // );


        return (

				<>
		
					<div className="hidden md:flex w-full h-screen items-center justify-center bg-yellow-500 gap-2">

						<span className="text-4xl font-extrabold text-white text-center"> Loading Category </span>

						
						<Loader size="xl" color="border-white border-9" />

						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

					</div>


					
					<div className="flex md:hidden w-full h-screen fixed inset-0 items-center justify-center bg-yellow-500 gap-2">

						<span className="text-xl font-extrabold text-white text-center"> Loading Category </span>

						
						<Loader size="large" color="border-white border-7" />

						<Loader size="medium" color="border-white border-6" />

						<Loader size="small" color="border-white border-5" />

					</div>
					
				</>
				
			);
    }






    return (
    
        <>
        
            <Navbar />

            
            <div className="container mx-auto md:mt-10 py-6 px-5 flex-col">

                <div className="flex mb-5 md:mb-10 max-md:items-center">

                    <button

                        className="flex items-center justify-center w-22 max-md:h-6 md:w-25 md:px-4 md:py-1 text-black max-md:text-[14px] font-extrabold bg-yellow-500 hover:bg-orange-600 rounded-lg"
                        
                        onClick={() => navigate(-1)}
                    >
                    
                        ← Back
                    
                    </button>

                    
                    <div className="w-full flex items-center justify-center gap-1 md:gap-2">
                    
                        {category && (
                    
                            <>
                            
                                <img src={category.image_url} alt={category.name} className="w-8 md:w-10" />

                                <h1 className="text-xl md:text-4xl text-yellow-500 font-extrabold">

                                    {category.name}

                                </h1>

                            </>

                        )}
                    
                    </div>
                
                </div>

                
                {(products.length > 0) ? 
            
                    (
                        < div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:pl-20 md:pr-8 max-md:gap-x-5 gap-y-2 md:gap-y-5">
                        
                            {products.map(p =>
                            (
                                <ProductCard key={p.$id} Product={p} />
                            ))}
                    
                        </div>
                    )

                    :

                    (
                        <div className="flex w-full md:h-100 items-center justify-center pl-20 text-gray-400 font-bold max-md:mt-10 md:text-2xl">

                            No Products in Category

                        </div>
                    )
                }

            </div>
        </>
    );
}