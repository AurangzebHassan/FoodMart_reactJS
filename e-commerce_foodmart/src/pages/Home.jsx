import { useAuth } from "../context/AuthContext";

import useBlockBack from "../hooks/useBlockBack"

import Navbar from "../components/Navbar";

import HeroSection from "../components/HeroSection";

import CategoryCarousel from "../components/category/CategoryCarousel";

import NewArrivalsCarousel from "../components/product/NewArrivalsCarousel";

import TrendingCarousel from "../components/product/TrendingCarousel";

import MostSearchedCarousel from "../components/product/MostSearchedCarousel";

import MostAddedToCartCarousel from "../components/product/MostAddedToCartCarousel";

import MostViewedCarousel from "../components/product/MostViewedCarousel";

import FilteredProductsGrid from "../components/product/FilteredProductsGrid";



export default function Home()
{
    const { user, loading } = useAuth();



    useBlockBack(!loading && !!user);





    
    return (

        <>
        
            <Navbar />

            <HeroSection />


            <div className="md:mt-10 mb-5">
            
                <CategoryCarousel />
                
                <NewArrivalsCarousel />
                
                <TrendingCarousel />
                
                <MostSearchedCarousel />
                
                <MostViewedCarousel />
                
                <MostAddedToCartCarousel />
                
                <FilteredProductsGrid />
                
            </div>

        </>

    );
}