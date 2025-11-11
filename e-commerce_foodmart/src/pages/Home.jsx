import Navbar from "../components/Navbar";

import HeroSection from "../components/HeroSection";

import CategoryCarousel from "../components/CategoryCarousel";

import ProductCard from "../components/ProductCard";



export default function Home()
{
  const product = {
    $id: "6911f09b0018b147c00d",
    name: "Heinz Tomato Ketchup",
    slug: "heinz-tomato-ketchup",
    category_id: "691189e5001ef8ef64d8",
    price: 18,
    currency: "USD",
    stock: 5,
    image_url: "/images/products/heinz_tomato_ketchup.png",
    description: null,
    isTrending: false,
    rating: 4.6,
    discount_tag: "-30%",
    $createdAt: "2025-11-10T19:03:00.000Z",
    $updatedAt: "2025-11-10T19:03:00.000Z",
  };

  const product2 = {
    $id: "6912ca38002352fcf67d",
    name: "Fruita Vitals Orange Juice",
    slug: "fruita-vitals-orange-juice",
    category_id: "691189a10037e7f41aa2",
    price: 21.45,
    currency: "USD",
    stock: 40,
    image_url: "/images/products/orange_juice.png",
    description: null,
    isTrending: true,
    rating: 5,
    discount_tag: "-15%",
    $createdAt: "2025-11-11T10:31:00.000Z",
    $updatedAt: "2025-11-11T10:31:00.000Z",
  };



  return (

      <>
      
          <Navbar />
      
          <HeroSection />
          
      
          <div className="mt-10 mb-30">
          
            <CategoryCarousel />
            
          </div>
          

          <div className="flex">
            
            <ProductCard Product={product} />
          <ProductCard Product={product2} />

          </div>
          
      </>

  );
}