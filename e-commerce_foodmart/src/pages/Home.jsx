import Navbar from "../components/Navbar";

import HeroSection from "../components/HeroSection";

import CategoryCarousel from "../components/CategoryCarousel";



export default function Home()
{
  return (

      <>
      
          <Navbar />
      
          <HeroSection />
          
      
          <div className="mt-10">
          
            <CategoryCarousel />
            
          </div>
    
      </>

  );
}