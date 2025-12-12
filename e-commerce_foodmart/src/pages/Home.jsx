import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";

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
    const { user } = useAuth();



    useEffect(() =>
    {
        if (!user) return; // Only disable when logged in

  
        // Prevent the user from going back
  
            history.pushState(null, "", window.location.href);

            const handleBack = () =>
            {
                history.pushState(null, "", window.location.href);
            };

            window.addEventListener("popstate", handleBack);

  
        return () => window.removeEventListener("popstate", handleBack);
    
    }, [user]);





    
    return (

        <>
        
            <Navbar />

            <HeroSection />


            <div className="md:mt-10 mb-20">
            
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