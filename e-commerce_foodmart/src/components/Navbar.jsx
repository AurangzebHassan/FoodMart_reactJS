import { useState, useRef } from "react";

import { useAuth } from "../context/AuthContext";

import { logout } from "../appwrite/appwrite";

// import { getStoredProfilePic } from "../appwrite/db";

import CartDrawer from "./CartDrawer";

import MobileMenuDrawer from "./MenuDrawer";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";



export default function Navbar( /*{ loggedInUser }*/ )
{
    const { user, profile, setUser, setProfile } = useAuth();

    const { cartQuantity, cartTotal } = useCart();



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
        
    
    
    const navigate = useNavigate();



    const handleDepartmentChange = (e) =>
    {
        setSelectedDepartment(e.target.value);


        // Navigate if not the default option
    
            if (e.target.value !== "shopbydepartments")
            {
                navigate(`/${e.target.value.toLowerCase()}`);
            }
    }



    const handlePageChange = (e) =>
    {
        setSelectedPage(e.target.value);

        navigate(`/${e.target.value.toLowerCase()}`);
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



    // Logs the user out (via Appwrite) and redirects to login.

        const handleLogout = async () =>
        {
            await logout();     // clear appwrite session


            setUser(null);       // clear AuthContext user
    
            setProfile(null);    // clear AuthContext profile


            navigate('/login');
        };

 



        
  return (
    <>
      
        {/* Navbar */}
          
          <header className="bg-white sticky top-0 z-50 drop-shadow-sm">
        
              
            <div className="container mx-auto flex items-center justify-between py-6 px-5">
        
                
                {/* Logo */}
                
                {/* Left section of the navbar */}
        
                    <div className="flex shrink-0 items-center gap-2 transition-all duration-200">
                    
                        <a href="/">
                        
                            <img src="/images/logo.png" alt="FoodMart" />

                        </a>
            
                    </div>
                    
                  

                {/* Central Search and catgories/departments dropdown. */}
                
                {/* should be visible only from the large(lg) breakpoint */}

                    <div className="hidden lg:flex lg:shrink lg:max-2xl:ml-3 2xl:w-3xl items-center justify-center transition-all duration-200">
                            
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
                              
                              className="lg:w-37 xl:w-61 2xl:w-93 p-3 text-yellow-600 placeholder:text-xl placeholder:font-semibold font-extrabold" />

                            <img src="/icons/search.png" alt="FoodMart" className="h-12 p-3" onClick={handleSearchIconClick} />

                        </div>
            
                    </div>
                  
                  

                {/* Right side icons. Right side of the navbar */}

                    <div className="flex shrink-0 justify-end items-center xl:-ml-4 2xl:-ml:20 gap-3 transition-all duration-200">
                        
                      
                        <div className="lg:hidden">
                      
                            <img src="/icons/search.png" alt="FoodMart" className="h-11 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer" />
            
                        </div>
                        

                        <a 
                        
                          href="/profile" 
                          
                        //   className={`bg-gray-100 hover:bg-gray-200 rounded-full ${(profile?.profile_pic !== "/icons/user.svg" || getStoredProfilePic(user?.email) !== "/icons/user.svg") ? `` : `p-2`}`}
                        
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                            
                            onClick={(e) => { e.preventDefault(); navigate("/profile"); }}
                        
                        >
                            
                            <img

                                // src={(profile || user) ? (getStoredProfilePic(user?.email) || profile.profile_pic) : "/icons/user.svg"}
                                
                                src="/icons/user.svg"
                    
                              
                                alt={(profile || user) ? "User" : "Guest"}
                                
                                title={(profile || user) ? (profile?.name || user?.name) : "Guest"}
                    
                              
                              // className={(profile?.profile_pic !== "/icons/user.svg" || getStoredProfilePic(user?.email) !== "/icons/user.svg") ? "h-10 cursor-pointer rounded-full" : "h-7 cursor-pointer"}
                              
                              className="h-7 cursor-pointer"
                                
                            />

                        </a>
                
                        
                        <a href="/wishlist" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2" onClick={(e) => { e.preventDefault(); navigate("/wishlist"); }}>

                            <img
                
                                src="/icons/heart.svg"
                    
                                alt="Wishlist"
                    
                                className="sm:h-7 cursor-pointer"
                    
                            />
                            
                        </a>
                
                        
                        <div
                
                            // setting openCart to true measn that the cart drawer should be opened now.
                          
                                onClick={() => setOpenCart(true)}
                          
                            className="xl:mx-7 2xl:mx-14 relative cursor-pointer flex flex-row justify-between"
                
                        >
                            
                        
                            <div className="flex flex-row bg-gray-100 hover:bg-gray-200 rounded-full p-2 2xl:w-50">
                                
                                <div className="hidden xl:flex xl:flex-col xl:items-center xl:mx-1 2xl:mr-0.5 cursor-pointer px-3 2xl:px-4">
                                    
                                    <span className="text-2xl font-bold"> Your Cart </span>

                                    <span className="text-xl font-bold text-yellow-600 hover:text-orange-600"> {cartTotal ? `$${cartTotal}` : "$0.00"} </span>    
                              
                                </div>                
                

                                <img
                                
                                    src="/icons/shopping-cart.png"
                        
                                    alt="Cart"

                                    className="xl:mt-3 xl:mr-2 2xl:mt-3.5 h-7 cursor-pointer"

                                />
                                
                    
                                <span className={`absolute ${cartQuantity > 9 ? `-top-3.5 -right-4 xl:top-px xl:-right-2.5 2xl:top-px 2xl:-right-0.5` : `-top-3 -right-2 xl:-top-0.5 xl:right-1 2xl:top-px 2xl:right-1.5`} font-bold bg-yellow-500 hover:bg-orange-600 text-white text-md rounded-full px-2`}>
                        
                                    {cartQuantity}
                    
                                </span>

                            </div>
                            
                
                        </div>

                      
                        <div className="flex items-center gap-2 sm:ml-5 md:ml-9 lg:ml-7 xl:ml-0 2xl:ml-3 mt-1">
                          
                            <span className="lg:hidden text-lg font-extrabold font-mono text-red-600 " title={user?.name || "Guest"}>
                            
                                {user ? user?.name.slice(0, 8) + "..." : "Guest"}
                                {/* Guest */}

                            </span>
                            
                            <span className="hidden lg:max-xl:flex text-lg font-extrabold font-mono text-red-600 " title={user?.name || "Guest"}>
                            
                                {user ? user?.name.slice(0, 10) + "..." : "Guest"}
                                {/* Guest */}

                            </span>
                            
                            <span className="hidden xl:flex text-lg font-extrabold font-mono text-red-600 " title={user?.name || "Guest"}>
                            
                                {user ? user?.name.slice(0, 12) : "Guest"}
                                {/* Guest */}

                            </span>
                        
                      
                            <button 
                            
                                // className="mt-1 px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                                
                                // className="mt-1 md:ml-5 lg:ml-10 xl:ml-5 transition-all duration-200 rounded-full"
                        
                                onClick={handleLogout}
                            >
                                
                                <img src="./icons/logout.png" alt="logout" className="w-9 hover:w-10 rounded-full transition-all duration-75" />

                            </button>

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

        <section className="container mx-auto flex items-center justify-start pt-12 px-5 transition-all duration-200">

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
                        
                        <select name="departments" id="departments" value={selectedDepartment} onChange={handleDepartmentChange} className="justify-start lg:mr-22 xl:mr-21 2xl:mr-27 focus:borde hover:text-gray-900 py-2 bg-gray-100 text-center rounded-lg">

                            <option value="shopbydepartments"> Shop by Departments </option>
                            
                            <option value="Groceries"> Groceries </option>
                            
                            <option value="Drinks"> Drinks </option>

                            <option value="Chocolates"> Chocolates </option>
                            
                        </select>

                    </div>

            
                {/* menu bar */}
                
                    <div className="text-gray-700 text-xl">
                        
                        <ul className="hidden lg:flex lg:flex-row  items-center gap-6">

                            <a href="/women" onClick={(e) => { e.preventDefault(); navigate("/women"); }}> <li className="cursor-pointer hover:text-gray-900">Women</li> </a>

                            <a href="/men" onClick={(e) => { e.preventDefault(); navigate("/men"); }}> <li className="cursor-pointer hover:text-gray-900" value="men" onClick={handlePageChange}>Men</li> </a>

                            <a href="/kids" onClick={(e) => { e.preventDefault(); navigate("/kids"); }}> <li className="cursor-pointer hover:text-gray-900" value="kids" onClick={handlePageChange}>Kids</li> </a>

                            <a href="/accessories" onClick={(e) => { e.preventDefault(); navigate("/accessories"); }}> <li className="cursor-pointer hover:text-gray-900" value="accessories" onClick={handlePageChange}>Accessories</li> </a>
                            
                                
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

                                
                            <a href="/brand" onClick={(e) => { e.preventDefault(); navigate("/brand"); }}> <li className="cursor-pointer hover:text-gray-900" value="brand" onClick={handlePageChange}>Brand</li> </a>

                            <a href="/sale" onClick={(e) => { e.preventDefault(); navigate("/sale"); }}> <li className="cursor-pointer hover:text-gray-900" value="sale" onClick={handlePageChange}>Sale</li> </a>

                            <a href="/blog" onClick={(e) => { e.preventDefault(); navigate("/blog"); }}> <li className="cursor-pointer hover:text-gray-900" value="blog" onClick={handlePageChange}>Blog</li> </a>

                        </ul>

                    </div>
                
        </section>
                
    </>
    
  );
}
