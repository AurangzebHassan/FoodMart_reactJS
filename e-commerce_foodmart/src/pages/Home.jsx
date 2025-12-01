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
  return (

        <>
        
            <Navbar />

            <HeroSection />


            <div className="mt-10 mb-20">
            
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