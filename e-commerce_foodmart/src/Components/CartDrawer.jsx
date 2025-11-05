import { useState, useEffect } from "react";



export default function CartDrawer({ onClose })
{
    // ⭐ state to control animation visibility
  
      const [isVisible, setIsVisible] = useState(false);

    
    // ⭐ when mounted, trigger slide-in animation
  
        useEffect(() =>
        {
            setTimeout(() => setIsVisible(true), 10);
  
        },
            
            []

        );

     
    // ⭐ handle close with animation delay
  
    const handleClose = () =>
    {
        setIsVisible(false);
    
        setTimeout(() => onClose(), 300); // wait for animation to end before removing from DOM
    };



  // simple static demo items

    const items =
    [
        {
            id: 1,
    
            name: "Heinz Tomato ketchup",
    
            price: 18,
    
            qty: 1,
    
            image: "/images/products/heinz_tomato_ketchup.png",

            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum maxime quaerat, commodi quas atque exercitationem quasi labore vitae ullam sequi voluptas, suscipit temporibus vel obcaecati asperiores nesciunt cum quos est."
        },
        
        {
            id: 2,
        
            name: "Sardine Can",
        
            price: 12,
        
            qty: 2,
        
            image: "/images/products/sardine_can.jpg",

            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, ducimus?"
        },
    ];



  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    
    
    
    
    
  return (
    
      <div
          //   className="fixed inset-0 bg-black/40 flex justify-end z-50"
          
          className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}

        >
      
          <div className={`bg-white w-120 h-full shadow-xl p-6 flex flex-col transform transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}>
        
              <div className="flex justify-between items-center mb-6">
          
                  <h1 className="text-3xl font-extrabold text-yellow-500">Your Cart</h1>
          
                  <button onClick={handleClose} className="text-gray-700 text-4xl">
            
                    &times;
          
                  </button>
        
              </div>

        
              <div className="flex-1 overflow-y-auto space-y-2">
          
                  {items.map((item) => (
            
                      <div key={item.id} className="flex gap-3 border-b py-4 ">
              
                          <img
                
                              src={item.image}
                
                              alt={item.name}
                
                              className="w-20 h-20 rounded-lg object-scale-down"
              
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
                            
                                    <span className="text-white text-[20px] bg-yellow-500 px-3 rounded-full font-bold mt-1">
                            
                                      {item.qty}
                            
                                    </span>
                            
                            </div>

                              
                                {/* ⭐ Line 2: price left, total right */}
                              
                                    <div className="flex justify-between mt-1">
                                    
                                        <p className="text-gray-500 text-sm font-mono mt-6">
                                    
                                            ${item.price}
                                    
                                        </p>
                                    
                                        <p className="text-gray-700 font-mono mt-6">
                                    
                                            ${(item.price * item.qty).toFixed(2)}
                                    
                                        </p>
                                    
                                    </div>
                            
                          </div>
            
                      </div>
          
                  ))}

        </div>

              
        
              <div className="mt-3 border-t-3 pt-5">
          
                  <p className="flex justify-between text-[19px] font-semibold">
            
                      <span>Total:</span> <span>${Math.floor(total).toFixed(2)}</span>
          
                  </p>
          
                  <button className="w-full bg-yellow-500 text-white py-2 rounded mt-3 hover:bg-orange-600 text-[18px] font-extrabold">

                      Checkout

                  </button>

              </div>

          </div>

      </div>

  );
}