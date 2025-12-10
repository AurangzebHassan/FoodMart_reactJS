import { useNavigate } from "react-router-dom";



export default function HeroSection()
{
    const navigate = useNavigate();



  return (

      <section className="container mx-auto mt-3 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 px-3 sm:px-5 sm:mb-6">
      
        {/* Left main banner */}
      
            <div className={`relative bg-blue-100 hover:-translate-y-3 hover:translate-x-1 rounded-2xl p-4 sm:p-8 overflow-hidden w-full h-fit lg:w-[510px] lg:h-[750px] xl:w-[600px] xl:h-[750px] 2xl:w-[680px] 2xl:h-[750px] transition-all duration-200`}>
            
                <div className="ml-2 sm:ml-6">
            
                    <p className="text-yellow-600 font-serif text-lg sm:text-4xl mt-1 sm:mt-12">100% Natural</p>
            
                    <h2 className="text-2xl sm:text-6xl font-semibold text-gray-800 mt-2 sm:mt-6 mr-[100px] md:mr-[350px] 2xl:mr-[250px] leading-snug">
                
                        Fresh Smoothie &amp; Summer Juice
            
                    </h2>
            
                    
                    <p className="text-gray-500 mt-1 sm:mt-4 mr-[130px] md:mr-[300px] lg:mr-[100px] 2xl:mr-[300px] text-[10.5px] sm:text-[17px]">
                
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim
                
                        massa diam elementum.
            
                    </p>
            
                    
                    <button 
                    
                        className="mt-4 md:mt-8 2xl:mt-10 text-[12px] sm:text-xl border border-gray-700 text-gray-700 lg:max-xl:px-6 px-3 sm:px-8 lg:max-xl:py-3 lg:max-xl:mt-5 py-2 sm:py-5 rounded hover:bg-gray-700 hover:text-white transition"
                        
                        onClick={() => navigate(`/category/drinks-juices`)}    
                    >
                
                        Shop Now
            
                    </button>
            
                </div>

            
                <img
            
                    src="/images/hero/smoothie.png"
            
                    alt="Smoothie"

                    className="absolute hover:-translate-10 w-35 bottom-3 max-sm:left-48 sm:right-8 sm:bottom-70 sm:w-65 md:max-lg:left-93 md:bottom-20 md:w-90 lg:-right-3 lg:bottom-45 lg:w-60 xl:right-2 xl:bottom-50 xl:w-70 2xl:-right-3 2xl:bottom-30 2xl:w-85 drop-shadow-lg transition-all duration-200"

                />
        
            </div>


          
      
        {/* Right side small promos */}
      
            <div className="lg:col-span-2 lg:ml-[200px] md:mr-0 flex flex-col gap-3 md:gap-6 transition-all duration-200">
        
              <div className="bg-[url('/images/hero/veggie_border.png')] bg-cover hover:bg-center hover:-translate-y-3 hover:translate-x-1 rounded-2xl flex items-center justify-between p-4 md:p-6 w-full max-sm:h-fit h-90 transition-all duration-200">
          
                <div className="ml-2 md:ml-8">
            
                    <p className="text-black text-lg md:text-4xl font-serif md:mb-2 mt-6 md:mt-4">20% Off</p>
                    
                    <div className="flex flex-row mb-1 md:mb-2 max-sm:text-[14px]">一一一一一 <pre> 𝑺𝑨𝑳𝑬 </pre></div>
                    
            
                    <h3 className="text-xl md:text-4xl font-semibold mb-2 md:mb-6 md:mr-[150px]">Fruits &amp; Vegetables</h3>
            
                    <button 
                        
                        className="text-orange-500 hover:text-orange-700 hover:underline max-sm:text-[11px] md:text-md"
                        
                        onClick={() => navigate(`/category/fruits-veggies`)}    
                    >
                            

              
                        Shop Collection →
            
                    </button>
          
                </div>
        
              </div>


              <div className="bg-[url('/images/hero/bread_border.png')] bg-top-right bg-cover bg-no-repeat hover:bg-center hover:-translate-y-3 hover:translate-x-1 rounded-2xl flex items-center justify-between p-4 md:p-6 w-full max-sm:h-fit h-92 transition-all duration-200">

                    <div className="ml-2 md:ml-8">

                        <p className="text-black text-lg md:text-4xl font-serif md:mb-2 mt-2 md:mt-4">15% Off</p>

                        <div className="flex flex-row mb-1 md:mb-2 max-sm:text-[14px]">一一一一一 <pre> 𝑺𝑨𝑳𝑬 </pre></div>


                        <h3 className="text-xl md:text-4xl font-semibold mb-2 md:mb-6">Baked Products</h3>

                        <button 
                            
                            className="text-orange-500 hover:text-orange-700 hover:underline max-sm:text-[11px] md:text-md"
                            
                            onClick={() => navigate(`/category/bread-sweets`)}    
                        >

                            Shop Collection →

                        </button>

                    </div>

              </div>

          </div>

      </section>
  );
}