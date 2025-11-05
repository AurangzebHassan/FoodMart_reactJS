



export default function HeroSection()
{
  return (

      <section className="container mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 px-5">
      
        {/* Left main banner */}
      
            <div className="relative bg-blue-100 rounded-2xl p-8 overflow-hidden w-[700px] h-[750px]">
            
                <div className="ml-6 mt-1">
            
                    <p className="text-yellow-600 font-serif text-4xl mt-12">100% Natural</p>
            
                    <h2 className="text-6xl font-semibold text-gray-800 mt-6 mr-[250px] leading-snug">
                
                        Fresh Smoothie &amp; Summer Juice
            
                    </h2>
            
                    
                    <p className="text-gray-500 text-md mt-4 mr-[250px] text-[17px]">
                
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim
                
                        massa diam elementum.
            
                    </p>
            
                    
                    <button className="mt-8 text-xl border border-gray-700 text-gray-700 px-8 py-5 rounded hover:bg-gray-700 hover:text-white transition">
                
                        Shop Now
            
                    </button>
            
                </div>

            
                <img
            
                    src="/images/hero/smoothie.png"
            
                    alt="Smoothie"

                    className="absolute right-10 bottom-60 w-70 drop-shadow-lg"

                />
        
            </div>


          
      
        {/* Right side small promos */}
      
            <div className="lg:col-span-2 ml-[300px] flex flex-col gap-6">
        
              <div className="bg-[url('./images/hero/veggie_border.png')] bg-cover rounded-2xl flex items-center justify-between p-6 h-90">
          
                <div className="ml-8">
            
                    <p className="text-black text-4xl font-serif mb-2 mt-4">20% Off</p>
                    
                    <p className="flex flex-row mb-2">一一一一一 <pre> 𝑺𝑨𝑳𝑬 </pre></p>
                    
            
                    <h3 className="text-4xl font-semibold mb-6 mr-[150px]">Fruits &amp; Vegetables</h3>
            
                    <a href="#" className="text-orange-500 text-md">
              
                        Shop Collection →
            
                    </a>
          
                </div>
        
            </div>


              <div className="bg-[url('./images/hero/bread_border.png')] bg-cover bg-no-repeat rounded-2xl flex items-center justify-between p-6 h-92">

                  <div className="ml-8">

                      <p className="text-black text-4xl font-serif mb-2">15% Off</p>

                        <p className="flex flex-row mb-2">一一一一一 <pre> 𝑺𝑨𝑳𝑬 </pre></p>


                      <h3 className="text-4xl font-semibold mb-6 mr-[250px]">Baked Products</h3>

                      <a href="#" className="text-orange-500 text-md">

                          Shop Collection →

                      </a>

                  </div>

              </div>

          </div>

      </section>
  );
    
}