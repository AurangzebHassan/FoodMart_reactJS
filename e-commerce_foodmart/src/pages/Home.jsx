import Navbar from "../components/Navbar";

import HeroSection from "../components/HeroSection";

import CategoryCarousel from "../components/category/CategoryCarousel";

import NewArrivalsCarousel from "../components/product/NewArrivalsCarousel";

import TrendingCarousel from "../components/product/TrendingCarousel";

import MostSearchedCarousel from "../components/product/MostSearchedCarousel";

import MostAddedToCartCarousel from "../components/product/MostAddedToCartCarousel";



export default function Home( /*{ loggedInUser }*/ )
{
  return (

        <>
        
            <Navbar />

            <HeroSection />


            <div className="mt-10 mb-30">
            
                <CategoryCarousel />
                
                <NewArrivalsCarousel />
                
                <TrendingCarousel />
                
                <MostSearchedCarousel />
                
                <MostAddedToCartCarousel />
                
            </div>

        </>

    );
}