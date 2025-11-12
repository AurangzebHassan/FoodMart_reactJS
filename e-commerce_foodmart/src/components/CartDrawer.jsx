import { useState, useEffect } from "react";

import { formatPrice } from "../utils/formatPrice";



export default function CartDrawer({ onClose })
{
    // ⭐ state to control slide in/out animation visibility
  
      const [isVisible, setIsVisible] = useState(false);

    
    // ⭐ when mounted, trigger slide-in animation
  
        useEffect(() =>
        {
            // prevents the body from scrolling when drawer is open

                document.body.style.overflow = "hidden";

            
            // Added slight delay for smoother entry animation (same 10ms)

                setTimeout(() => setIsVisible(true), 10);
                
            
            // restore scroll on unmount like MenuDrawer
        
                return () => document.body.style.overflow = "";
        },
            
            []

        );

     
    // ⭐ handle close with animation delay
  
        const handleClose = () =>
        {
            setIsVisible(false);
        
            setTimeout(() => onClose(), 200); // wait for animation to end before removing from DOM
        };
    
    
    
    // Now clicking outside the drawer closes it (like MenuDrawer)

        const handleOverlayClick = (e) =>
        {
            // ensure we only close if clicking *outside* the drawer
        
                if (e.target === e.currentTarget) handleClose();
        };



  // simple static demo items

    const items =
    [
        {
            id: 1,
    
            name: "Heinz Tomato ketchup",

            slug: "heinz-tomato-ketchup",
    
            price: 18.05,
    
            qty: 1,
    
            image: "/images/products/heinz_tomato_ketchup.png",

            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum maxime quaerat, commodi quas atque exercitationem quasi labore vitae ullam sequi voluptas, suscipit temporibus vel obcaecati asperiores nesciunt cum quos est."
        },
        
        {
            id: 2,
        
            name: "Fruita Vitals Orange Juice",

            slug: "fruita-vitals-orange-juice",
        
            price: 22.69,
        
            qty: 2,
        
            image: "/images/products/orange_juice.png",

            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, ducimus?"
        },

    ]



    const total_bill = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const total_quantity = items.reduce((sum, i) => sum + i.qty, 0);


    
    
    
        
  return (
    
      <div
          //   className="fixed inset-0 bg-black/40 flex justify-end z-50"
          
          className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}

            onClick={handleOverlayClick}

        >
      
          <div className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}>
        
                <div className="flex justify-center">
                  
                    <button onClick={handleClose} className="text-gray-600 hover:text-gray-900 text-6xl">
            
                        &times;
          
                    </button>

                </div>
    
              
              <div className="flex justify-between items-center mb-8 mt-4">
          
                  <h1 className="text-3xl font-extrabold text-yellow-500">Your Cart</h1>

                    <span className="text-white text-[20px] bg-yellow-500 px-3 rounded-full font-bold mt-1">
                            
                        {total_quantity}
                            
                    </span>
        
              </div>

        
              <div className="flex-1 overflow-y-auto space-y-2">
          
                  {items.map((item) => (
            
                      <div key={item.id} className="flex gap-3 border-b py-4 ">
              
                          <img
                
                              src={item.image}
                
                              alt={item.name}
                
                              className="w-20 h-25 rounded-lg object-scale-down"
              
                          />
              
                          {/* <div className="flex-1">
                
                              <p className="flex flex-row font-mono text-lg w-full">{item.name}  <span className="ml-[80px]"> {item.qty} </span> </p>
                
                              <p className="text-gray-500 mt-7 ml-[160px] font-mono text-md">
                  
                                  ${item.price} × {item.qty} = ${ (Math.floor(item.price * item.qty)).toFixed(2) }
                
                              </p>
              
                          </div> */}


                          {/* content column */}
                            
                            <div className="flex-1">
                            
                                {/* ⭐ Line 1: name left, quantity right */}
                            
                                    <div className="flex justify-between items-center">
                            
                                    <p className="font-mono text-lg text-gray-800 font-semibold mt-1">{item.name}</p>
                            
                                    <span className="text-white text-[20px] bg-yellow-500 px-3 rounded-full font-bold mt-1 ml-8">
                            
                                      {item.qty}
                            
                                    </span>
                            
                            </div>

                              
                                {/* ⭐ Line 2: price left, total_bill right */}
                                
                                    <div className="flex justify-between mt-1">
                                    
                                        <p className="text-gray-500 text-sm font-mono mt-6">
                                    
                                            {/* ${item.price} */}
                                            
                                            {formatPrice(item.price, "USD")}
                                    
                                        </p>
                                    
                                        <p className="text-gray-700 font-mono mt-6">
                                    
                                            {/* ${(item.price * item.qty).toFixed(2)} */}
                                            
                                            {formatPrice((((item.price * 100) * item.qty) / 100), "USD")}
                                    
                                        </p>
                                    
                                    </div>
                            
                          </div>
            
                      </div>
          
                  ))}

        </div>

              
        
              <div className="mt-3 border-t-3 pt-5">
          
                  <p className="flex justify-between text-[19px] font-semibold">
            
                      <span>Total (USD):</span> <span> {/* ${Math.floor(total_bill).toFixed(2)} */} {formatPrice(total_bill, "USD")} </span>
          
                  </p>
          
                  <button className="w-full bg-yellow-500 text-white py-2 rounded mt-3 hover:bg-orange-600 text-[18px] font-extrabold">

                      Checkout

                  </button>

              </div>

          </div>

      </div>

  );
}