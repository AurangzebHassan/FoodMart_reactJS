import React, { useState } from "react";

import CartDrawer from "./CartDrawer";



export default function Navbar()
{
    const [openCart, setOpenCart] = useState(false);
    
    let [selectedDepartment, setSelectedDepartment] = useState('shopbydepartments');

    let [selectedPage, setSelectedPage] = useState('Pages');



    const handleDepartmentChange = (e) =>
    {
        setSelectedDepartment(e.target.value);


        // Navigate if not the default option
    
            // if (e.target.value !== "shopbydepartments")
            // {
            //     window.location.href = `/${e.target.value.toLowerCase()}`;
            // }
    }



    const handlePageChange = (e) =>
    {
        setSelectedPage(e.target.value);

        window.location.href = `/${e.target.value.toLowerCase()}`;
    }

    
    



  return (
    <>
      
          <header className="bg-white drop-shadow-sm">
        
              
            <div className="container mx-auto flex items-center justify-between py-6 px-5">
        
                
                {/* Logo */}
        
                    <div className="flex shrink-0 items-center gap-2">
                    
                        <a href="/">
                        
                            <img src="/images/logo.png" alt="FoodMart" />

                        </a>
            
                    </div>
                    
                  

                {/* Centre Search */}

                    {/* <div className="flex shrink-0 lg:hidden cursor-pointer items-center gap-5">
                            
                      <input type="text"/>  
                      
                      <img src="/icons/search.png" alt="FoodMart" className="h-11 justify-end bg-gray-100 hover:bg-gray-200 rounded-full p-2" />
            
                    </div> */}
                  
                  

                {/* Right side icons */}

                    <div className="flex shrink-0 justify-end items-center gap-3">
                        
                      
                        <div className="lg:hidden cursor-pointer">
                      
                            <img src="/icons/search.png" alt="FoodMart" className="h-11 justify-end bg-gray-100 hover:bg-gray-200 rounded-full p-2" />
            
                        </div>

                      
                        <a href="#" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                            
                            <img

                                src="/icons/user.svg"
                    
                                alt="User"
                    
                                className="sm:h-7 cursor-pointer"
                                
                            />

                        </a>
                
                        
                        <a href="#" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2">

                            <img
                
                                src="/icons/heart.svg"
                    
                                alt="Wishlist"
                    
                                className="sm:h-7 cursor-pointer"
                    
                            />
                            
                        </a>
                
                        
                        <div
                
                            onClick={() => setOpenCart(true)}
                
                            className="relative cursor-pointer flex flex-row justify-between"
                
                        >
                            
                        
                            <a href="#" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 xl:bg-white xl:hover:bg-white xl:rounded-none xl:p-0">
                                
                                <span className="hidden xl:flex xl:flex-row text-xl font-bold cursor-pointer mr-2 ml-4 hover:text-yellow-600"> Your Cart </span>
                

                                <img
                                
                                    src="/icons/shopping-cart.png"
                        
                                    alt="Cart"

                                    className="xl:hidden h-7 cursor-pointer"

                                />
                                
                    
                                <span className="absolute -top-4 -right-3 font-bold bg-yellow-500 hover:bg-yellow-600 text-white text-md rounded-full px-2">
                        
                                    2
                    
                                </span>

                            </a>
                            
                
                        </div>
                   
                    </div>

                
            </div>

              
          </header>

          
      {/* Cart panel */}
      
        {openCart && <CartDrawer onClose={() => setTimeout(() => setOpenCart(false), 0)} />}
          


          {/* Menu & dropdown placeholders */}

            <section className="container mx-auto flex items-center justify-start pt-12 px-5">

                <div className="hidden lg:flex text-xl text-gray-700">
                    
                    <select name="departments" id="departments" value={selectedDepartment} onChange={handleDepartmentChange} className="justify-start mr-20 focus:borde hover:text-gray-900 py-2 bg-gray-100 text-center rounded-lg">

                            <option value="shopbydepartments"> Shop by Departments </option>
                        
                        <option value="Groceries"> Groceries </option>
                        
                        <option value="Drinks"> Drinks </option>

                        <option value="Chocolates"> Chocolates </option>
                        
                    </select>

                </div>

                <div className="text-gray-700 text-xl">
                    
                    <ul className="hidden lg:flex lg:flex-row  items-center gap-6">

                        <li className="cursor-pointer hover:text-gray-900">Women</li>

                        <li className="cursor-pointer hover:text-gray-900">Men</li>

                        <li className="cursor-pointer hover:text-gray-900">Kids</li>

                        <li className="cursor-pointer hover:text-gray-900">Accessories</li>
                        
                            
                        <li className="cursor-pointer hover:text-gray-900 relative flex items-center">
                            
                            <label
                                htmlFor="pages"
                                className="cursor-pointer text-xl text-gray-700 hover:text-gray-900 flex items-center"
                            >
                                Pages
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </label>
                                
                            <select name="pages" id="pages" value={selectedPage} onChange={handlePageChange} className="absolute opacity-0 cursor-pointer w-32 h-8 mb-1">

                                <option value="about_us"> About Us </option>
                            
                                <option value="shop"> Shop </option>
                            
                                <option value="single_product"> Single Product </option>

                                <option value="cart"> Cart </option>
                                
                                <option value="checkout"> Checkout </option>
                                
                                <option value="blog"> Blog </option>

                                <option value="single_post"> Single Post </option>
                                
                                <option value="styles"> Styles </option>

                                <option value="thank_you"> Thank You </option>

                                <option value="my_account"> My Account </option>
                                
                                <option value="404_error"> 404 Error  </option>
                        
                            </select>

                        </li>

                            
                        <li className="cursor-pointer hover:text-gray-900">Brand</li>

                        <li className="cursor-pointer hover:text-gray-900">Sale</li>

                        <li className="cursor-pointer hover:text-gray-900">Blog</li>

                    </ul>

                </div>
                    
            </section>
                
        </>
    );
}
