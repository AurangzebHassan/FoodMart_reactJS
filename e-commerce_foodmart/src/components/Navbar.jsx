import React, { useState, useRef } from "react";

import CartDrawer from "./CartDrawer";

import MobileMenuDrawer from "./MenuDrawer";



export default function Navbar()
{
    // opening of the cart drawer is dependent on this state

        const [openCart, setOpenCart] = useState(false);
    
    
    let [selectedDepartment, setSelectedDepartment] = useState('shopbydepartments');

    let [selectedPage, setSelectedPage] = useState('Pages');


    // opening of the mobile menu drawer is dependent on this state

        const [openMobileMenu, setOpenMobileMenu] = useState(false);
        
    
    // use a ref object to manipulate the DOM node using ref

    // we'll focus on the text input when the search button is clicked

        const searchRef = useRef(null);

        
        
    
    // state to hold the search input

        const [searchInput, setSearchInput] = useState("");



    const handleDepartmentChange = (e) =>
    {
        setSelectedDepartment(e.target.value);


        // Navigate if not the default option
    
            if (e.target.value !== "shopbydepartments")
            {
                window.location.href = `/${e.target.value.toLowerCase()}`;
            }
    }



    const handlePageChange = (e) =>
    {
        setSelectedPage(e.target.value);

        window.location.href = `/${e.target.value.toLowerCase()}`;
    }



    const handleSearchIconClick = () =>
    {
        searchRef.current.focus();

        searchRef.current?.select();
    }



    const handleSearchChange = (e) =>
    {
        setSearchInput(e.target.value);

        // console.log("User typed: ", e.target.value);
    }


    
    


  return (
    <>
      
        {/* Navbar */}
          
          <header className="bg-white drop-shadow-sm">
        
              
            <div className="container mx-auto flex items-center justify-between py-6 px-5">
        
                
                {/* Logo */}
                
                {/* Left section of the navbar */}
        
                    <div className="flex shrink-0 items-center gap-2">
                    
                        <a href="/">
                        
                            <img src="/images/logo.png" alt="FoodMart" />

                        </a>
            
                    </div>
                    
                  

                {/* Central Search and catgories/departments dropdown. */}
                
                {/* should be visible only from the large(lg) breakpoint */}

                    <div className="hidden lg:flex lg:shrink-0 items-center justify-center">
                            
                      {/* departments dropdown */}
                        
                        <div className="text-lg text-yellow-600 font-semibold rounded-l-full focus:border-0 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 cursor-pointer">
                                
                            <select name="departments" id="departments" value={selectedDepartment} onChange={handleDepartmentChange} className="focus:border-none p-3 text-center">

                                <option value="shopbydepartments"> Categories </option>
                                
                                <option value="Groceries"> Groceries </option>
                                
                                <option value="Drinks"> Drinks </option>

                                <option value="Chocolates"> Chocolates </option>
                                
                            </select>

                        </div>
                    
                      
                      {/* search input box + icon */}
                        
                        <div className="flex bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-r-full">
                          
                            <input 
                            
                              type="text"
                              
                              placeholder="Search"

                              value={searchInput}

                              onChange={handleSearchChange}
                              
                              ref={searchRef}
                              
                              className="lg:w-50 xl:w-80 2xl:w-120 p-3 text-yellow-600 placeholder:text-xl placeholder:font-semibold font-extrabold" />

                            <img src="/icons/search.png" alt="FoodMart" className="h-12 p-3" onClick={handleSearchIconClick} />

                        </div>
            
                    </div>
                  
                  

                {/* Right side icons. Right side of the navbar */}

                    <div className="flex shrink-0 justify-end items-center gap-3">
                        
                      
                        <div className="lg:hidden cursor-pointer">
                      
                            <img src="/icons/search.png" alt="FoodMart" className="h-11 justify-end bg-gray-100 hover:bg-gray-200 rounded-full p-2" />
            
                        </div>

                      
                        <a href="/profile" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                            
                            <img

                                src="/icons/user.svg"
                    
                                alt="User"
                    
                                className="sm:h-7 cursor-pointer"
                                
                            />

                        </a>
                
                        
                        <a href="/wishlist" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2">

                            <img
                
                                src="/icons/heart.svg"
                    
                                alt="Wishlist"
                    
                                className="sm:h-7 cursor-pointer"
                    
                            />
                            
                        </a>
                
                        
                        <div
                
                            // setting openCart to true measn that the cart drawer should be opened now.
                          
                                onClick={() => setOpenCart(true)}
                          
                            className="xl:ml-10 2xl:ml-12 relative cursor-pointer flex flex-row justify-between"
                
                        >
                            
                        
                            <div className="flex flex-row bg-gray-100 hover:bg-gray-200 rounded-full p-2">
                                
                                <span className="hidden xl:flex text-xl font-bold cursor-pointer mr-2 ml-4 hover:text-yellow-600"> Your Cart </span>
                

                                <img
                                
                                    src="/icons/shopping-cart.png"
                        
                                    alt="Cart"

                                    className="h-7 cursor-pointer"

                                />
                                
                    
                                <span className="absolute -top-4 -right-3 font-bold bg-yellow-500 hover:bg-yellow-600 text-white text-md rounded-full px-2">
                        
                                    3
                    
                                </span>

                            </div>
                            
                
                        </div>
                   
                    </div>

                
            </div>

              
          </header>

          

      {/* Cart Drawer */}
      
          {/* if cart is allowed to open, open it and pass the function to close the drawer to the drawer component. */}

            {openCart && <CartDrawer onClose={() => setTimeout(() => setOpenCart(false), 0)} />}
                
          

      {/* Mobile menu drawer */}

          <MobileMenuDrawer

              openMenuDrawer={openMobileMenu}

              onClose={() => setOpenMobileMenu(false)}

          />
          


    {/* Menu & dropdown placeholders */}

        <section className="container mx-auto flex items-center justify-start pt-12 px-5">

            {/* Hamburger menu for menu and dropdowns */}
            
            {/* Only shown until large(lg) breakpoint */}
                
                <button className="lg:hidden" onClick={() => setOpenMobileMenu(true)}>
                
                    <img src="./icons/hamburger_menu.png" alt="hamburger_menu_icon" 
                        
                    className="h-13 p-2 cursor-pointer border border-gray-400 hover:bg-gray-100 rounded-lg"
                
                    />

                </button>
            

            
            {/* menu and dropdown bar */}
            
            {/* shown from the large(lg) breakpoint to above */}
                
                {/* departments dropdown */}
                    
                    <div className="hidden lg:flex text-xl text-gray-700">
                        
                        <select name="departments" id="departments" value={selectedDepartment} onChange={handleDepartmentChange} className="justify-start mr-20 focus:borde hover:text-gray-900 py-2 bg-gray-100 text-center rounded-lg">

                                <option value="shopbydepartments"> Shop by Departments </option>
                            
                            <option value="Groceries"> Groceries </option>
                            
                            <option value="Drinks"> Drinks </option>

                            <option value="Chocolates"> Chocolates </option>
                            
                        </select>

                    </div>

            
                {/* menu bar */}
                
                    <div className="text-gray-700 text-xl">
                        
                        <ul className="hidden lg:flex lg:flex-row  items-center gap-6">

                            <a href="/women"> <li className="cursor-pointer hover:text-gray-900">Women</li> </a>

                            <a href="/men"> <li className="cursor-pointer hover:text-gray-900" value="men" onClick={handlePageChange}>Men</li> </a>

                            <a href="/kids"> <li className="cursor-pointer hover:text-gray-900" value="kids" onClick={handlePageChange}>Kids</li> </a>

                            <a href="/accessories"> <li className="cursor-pointer hover:text-gray-900" value="accessories" onClick={handlePageChange}>Accessories</li> </a>
                            
                                
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
                                    
                                <select name="pages" id="pages" value={selectedPage} onChange={handlePageChange} className="absolute opacity-0 inset-0 cursor-pointer">

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

                                
                            <a href="/brand"> <li className="cursor-pointer hover:text-gray-900" value="brand" onClick={handlePageChange}>Brand</li> </a>

                            <a href="/sale"> <li className="cursor-pointer hover:text-gray-900" value="sale" onClick={handlePageChange}>Sale</li> </a>

                            <a href="/blog"> <li className="cursor-pointer hover:text-gray-900" value="blog" onClick={handlePageChange}>Blog</li> </a>

                        </ul>

                    </div>
                
        </section>
                
    </>
    
  );
}
