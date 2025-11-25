



export default function HeroSection()
{
  return (

      <section className="container mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 px-5 sm:mb-6">
      
        {/* Left main banner */}
      
            <div className="relative bg-blue-100 hover:-translate-y-3 hover:translate-x-1 rounded-2xl p-8 overflow-hidden w-[610px] h-[805px] md:w-[740px] md:h-[805px] lg:w-[510px] lg:h-[750px] xl:w-[600px] xl:h-[750px] 2xl:w-[680px] 2xl:h-[750px] transition-all duration-200">
            
                <div className="ml-6 mt-1">
            
                    <p className="text-yellow-600 font-serif text-4xl mt-12">100% Natural</p>
            
                    <h2 className="text-6xl font-semibold text-gray-800 mt-6 sm:mr-[350px] md:mr-[350px] 2xl:mr-[250px] leading-snug">
                
                        Fresh Smoothie &amp; Summer Juice
            
                    </h2>
            
                    
                    <p className="text-gray-500 text-md mt-4 sm:mr-[100px] md:mr-[300px] lg:mr-[100px] 2xl:mr-[300px] text-[17px]">
                
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim
                
                        massa diam elementum.
            
                    </p>
            
                    
                    <button className="mt-8 2xl:mt-10 text-xl border border-gray-700 text-gray-700 lg:max-xl:px-6 px-8 lg:max-xl:py-3 lg:max-xl:mt-5 py-5 rounded hover:bg-gray-700 hover:text-white transition">
                
                        Shop Now
            
                    </button>
            
                </div>

            
                <img
            
                    src="/images/hero/smoothie.png"
            
                    alt="Smoothie"

                    className="absolute hover:-translate-10 sm:right-8 sm:bottom-70 sm:w-65 md:right-2 md:bottom-45 md:w-90 lg:-right-3 lg:bottom-45 lg:w-60 xl:right-2 xl:bottom-50 xl:w-70 2xl:-right-3 2xl:bottom-30 2xl:w-85 drop-shadow-lg transition-all duration-200"

                />
        
            </div>


          
      
        {/* Right side small promos */}
      
            <div className="lg:col-span-2 lg:ml-[200px] md:mr-0 flex flex-col gap-6 transition-all duration-200">
        
              <div className="bg-[url('/images/hero/veggie_border.png')] bg-cover hover:bg-center hover:-translate-y-3 hover:translate-x-1 rounded-2xl flex items-center justify-between p-6 sm:w-[610px] md:w-[740px] lg:w-[450px] xl:w-[620px] 2xl:w-[790px] h-90 transition-all duration-200">
          
                <div className="ml-8">
            
                    <p className="text-black text-4xl font-serif mb-2 mt-4">20% Off</p>
                    
                    <div className="flex flex-row mb-2">一一一一一 <pre> 𝑺𝑨𝑳𝑬 </pre></div>
                    
            
                    <h3 className="text-4xl font-semibold mb-6 mr-[150px]">Fruits &amp; Vegetables</h3>
            
                    <a href="#" className="text-orange-500 hover:text-orange-700 hover:underline text-md">
              
                        Shop Collection →
            
                    </a>
          
                </div>
        
              </div>


              <div className="bg-[url('/images/hero/bread_border.png')] bg-cover bg-no-repeat hover:bg-center hover:-translate-y-3 hover:translate-x-1 rounded-2xl flex items-center justify-between p-6 sm:w-[610px] md:w-[740px] lg:w-[450px] xl:w-[620px] 2xl:w-[790px] h-92 transition-all duration-200">

                  <div className="ml-8">

                      <p className="text-black text-4xl font-serif mb-2">15% Off</p>

                        <div className="flex flex-row mb-2">一一一一一 <pre> 𝑺𝑨𝑳𝑬 </pre></div>


                      <h3 className="text-4xl font-semibold mb-6 mr-[250px]">Baked Products</h3>

                      <a href="#" className="text-orange-500 hover:text-orange-700 hover:underline text-md">

                          Shop Collection →

                      </a>

                  </div>

              </div>

          </div>

      </section>
  );
}