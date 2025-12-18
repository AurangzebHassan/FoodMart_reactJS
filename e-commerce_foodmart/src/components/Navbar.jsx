import { useState, useRef, useEffect } from "react";

import { useAuth } from "../context/AuthContext";

import { logout } from "../appwrite/appwrite";

// import { getStoredProfilePic } from "../appwrite/db";

import { getAllProducts, getAllCategories } from "../appwrite/db";

import { incrementProductSearchCount, incrementCategorySearchCount } from "../appwrite/db";

import CartDrawer from "./CartDrawer";

import MobileMenuDrawer from "./MenuDrawer";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import { Link } from "react-router-dom";

import DarkModeToggle from "./DarkModeToggle";



export default function Navbar()
{
    const { user,/* profile, */setUser, setProfile } = useAuth();

    const { cartQuantity, cartTotal, wishlistQuantity, isCheckoutPage, ordersQuantity } = useCart();



    // opening of the cart drawer is dependent on this state

        const [openCart, setOpenCart] = useState(false);
    
    
    let [selectedDepartment, setSelectedDepartment] = useState('shopbydepartments');

    let [selectedPage, setSelectedPage] = useState('Pages');


    // opening of the mobile menu drawer is dependent on this state

        const [openMobileMenu, setOpenMobileMenu] = useState(false);
        
    
    // state to handle the opening of the mobile profile dropdown:
    
        const [showMobileProfileDropdown, setShowMobileProfileDropdown] = useState(false);
        
    
    // use a ref object to manipulate the DOM node using ref

    // we'll focus on the text input when the search button is clicked

        const searchRef = useRef(null);
        

    // state to hold the search input

        const [searchInput, setSearchInput] = useState("");
        
    
    // we need all products and categories beforehand to then filter using search term

        const [allProducts, setAllProducts] = useState([]);

        const [allCategories, setAllCategories] = useState([]);
        
    
    // This detects matches and creates the dropdown list as you type.

        const [searchResults, setSearchResults] = useState([]);
        
    
    // state to set the visiblity of search dropdown bar

        const [showDropdown, setShowDropdown] = useState(false);
        
    
    // state used to make the dropdown search items tabbale

        const [highlightedIndex, setHighlightedIndex] = useState(-1);
        
    
    // state to handle the visibility of the search modal at md or lower sizes

        const [showSearchModal, setShowSearchModal] = useState(false);



            
    const navigate = useNavigate();



    const handleDepartmentChange = (e) =>
    {
        setSelectedDepartment(e.target.value);


        // Navigate if not the default option
    
            if (e.target.value !== "shopbydepartments")
            {
                navigate(`/${e.target.value.toLowerCase()}`);
            }
    };



    const handleCategoryChange = (e) =>
    {
        setSelectedDepartment(e.target.value);


        // Navigate if not the default option
    
            if (e.target.value !== "shopbydepartments")
            {
                navigate(`/category/${e.target.value.toLowerCase()}`);
            }
    };



    const handlePageChange = (e) =>
    {
        setSelectedPage(e.target.value);

        navigate(`/${e.target.value.toLowerCase()}`);
    };



    const handleSearchIconClick = () =>
    {
        searchRef.current.focus();

        searchRef.current?.select();

        
        if (searchInput.trim().length > 0)
        {
            setShowDropdown(!showDropdown);

            setShowSearchModal(!showSearchModal);
        }
    };



    const handleSearchChange = async (e) =>
    {
        const value = e.target.value;
        
        setSearchInput(value);


        if (!value.trim())
        {
            setSearchResults([]);

            setShowDropdown(false);
        
            return;
        }


        const q = value.toLowerCase();


        // Find matching categories
        
            const catMatches = allCategories
          
                .filter((c) => c.name.toLowerCase().includes(q))
          
                .slice(0, 5)
          
                .map((item) => ({ type: "category", item }));

        
        // Find matching products
        
            const prodMatches = allProducts
          
                .filter((p) => p.name.toLowerCase().includes(q))
          
                .slice(0, 5)
          
                .map((item) => ({ type: "product", item }));

        
        
        setSearchResults([...catMatches, ...prodMatches]);

        setShowDropdown(true);



        // Increment search stats for each matching result

        // Each match gets counted as "was searched"

            [...catMatches, ...prodMatches].forEach(
                
                res =>
                {
                    if (res.type === "product")
                    {
                        // Count product search event
                
                            incrementProductSearchCount(res.item.$id);
                    }
                    
                    else
                    {
                        // Count category search event
                
                            incrementCategorySearchCount(res.item.$id);
                    }
                }
            );
    };



    // ===================== Highlight matched text =====================
  
        const highlightMatch = (text, term) =>
        {
            const lower = term.toLowerCase();
            
            const index = text.toLowerCase().indexOf(lower);
        
        
            if (index === -1) return text;

        
            return (
        
                <div className="-ml-5">
            
                    {text.slice(0, index)}
            
                    <span className="bg-yellow-500 dark:bg-yellow-600 font-mono font-bold">{text.slice(index, index + term.length)}</span>
            
                    {text.slice(index + term.length)}
        
                </div>
        
            );
        };



    // ===================== Close dropdown when clicking outside =====================
  
        const wrapperRef = useRef(null);

        useEffect(() =>
        {
            const handleClickOutside = (e) =>
            {
                if (wrapperRef.current && !wrapperRef.current.contains(e.target))
                {
                    setShowDropdown(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);


            return () => document.removeEventListener("mousedown", handleClickOutside);
    
        }, []);



    // ENTER to navigate to the best match
    
        const handleSearchSubmit = () =>
        {
            if (searchResults.length === 0) return;


            const first = searchResults[0];


            if (first.type === "product")
            {
                incrementProductSearchCount(first.item.$id);

                navigate(`/product/${first.item.slug}`);
            }
            
            if (first.type === "category")
            {
                incrementCategorySearchCount(first.item.$id);

                navigate(`/category/${first.item.slug}`);
            }


            setSearchResults([]);
            
            setSearchInput("");
        };



    // Logs the user out (via Appwrite) and redirects to login.

        const handleLogout = async () =>
        {
            await logout();     // clear appwrite session


            setUser(null);       // clear AuthContext user
    
            setProfile(null);    // clear AuthContext profile


            navigate('/login');
        };
    
    
    
    useEffect(() =>
    {
        if (showSearchModal || showDropdown)
        {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [showSearchModal, showDropdown]);


    
    
    
        
    // load all the products and categories at initial mount and fill states

        useEffect(() => 
        {
            async function loadData()
            {
                const prods = await getAllProducts();
            
                const cats = await getAllCategories();


                setAllProducts(prods);

                setAllCategories(cats);
            }
          
            loadData();

        }, []);


 


        
  return (
    <>
      
        {/* Navbar */}
        
                
            {/* Background blur overlay */}
                    
                {((showDropdown && searchResults.length > 0) || showSearchModal || openMobileMenu) && (
                
                    <div
                    
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    
                        onClick={() => {setShowDropdown(false); setShowSearchModal(false); setOpenMobileMenu(false);}}
                    >
                
                    </div>
                )} 
          





            <header className="bg-white dark:bg-gray-600 sticky top-0 z-50 drop-shadow-sm transition-all duration-200">
        
                
                <div className="container mx-auto flex items-center justify-between py-4 sm:py-6 px-3 sm:px-5 overflow-hidden">
            
                    
                    {/* Logo */}
                    
                    {/* Left section of the navbar */}
            
                        <div className="flex max-md:max-w-[30%] md:max-w-[33%] lg:max-w-none shrink-0 grow-0 items-center transition-all duration-200">
                        
                            <Link to="/" tabIndex={-1} className="hidden dark:hidden md:flex">
                            
                                <img src="/images/logo.png" alt="FoodMart" />

                            </Link>
                            
                            
                            <Link to="/" tabIndex={-1} className="hidden dark:md:flex">
                            
                                <img src="/images/lightened_logo.png" alt="FoodMart" />

                            </Link>
                            


                            <Link to="/" tabIndex={-1} className="flex md:hidden">
                            
                                <img src="/images/mobile_logo_no_bg.png" alt="FoodMart" className="w-8" />

                            </Link>
                
                        </div>
                        
                        

                    {/* Central Search and catgories/departments dropdown. */}
                    
                    {/* should be visible only from the large(lg) breakpoint */}

                        <div 
                        
                            className="lg:flex lg:shrink lg:max-2xl:ml-3 2xl:w-3xl items-center justify-center transition-all duration-200"
                            
                            ref={wrapperRef}    
                        >
                                
                            {/* departments dropdown */}
                            
                            <div className="text-[12px] md:text-[16px] lg:text-lg text-yellow-600 dark:text-yellow-300 font-semibold rounded-l-full bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700 hover:bg-gray-200 focus:bg-gray-200 cursor-pointer">
                                    
                                <select name="departments" id="departments" value={selectedDepartment} onChange={handleCategoryChange} className="dark:bg-gray-500 dark:hover:bg-gray-700 rounded-l-full focus:border-none p-1.25 md:p-3 md:max-lg:pb-3.25 lg:p-3.25 xl:pb-3.25 md:max-lg:px-6 text-center">

                                    <option value="shopbydepartments"> Categories </option>
                                    
                                    <option value="fruits-veggies"> Fruits </option>
                                    
                                    <option value="bread-sweets"> Sweets </option>

                                    <option value="drinks-juices"> Drinks </option>
                                    
                                    <option value="herbs-condiments"> Condiments </option>
                                    
                                    <option value="meat-poultry"> Meat </option>

                                    <option value="wine"> Wine </option>

                                </select>

                            </div>
                        
                            
                            {/* search input box + icon */}
                            
                            <div className="hidden lg:flex bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700 hover:bg-gray-200 focus:bg-gray-200 rounded-r-full">
                                
                                <input 
                                
                                    type="text"
                                    
                                    placeholder="Search"

                                    value={searchInput}

                                    onChange={handleSearchChange}

                                    // onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                                    
                                    onKeyDown={(e) => 
                                    {
                                        if (showDropdown && searchResults.length > 0)
                                        {
                                            // Move DOWN: Tab or ArrowDown
                                            
                                                if ((e.key === "Tab" && !e.shiftKey) || (e.key === "ArrowDown"))
                                                {
                                                    e.preventDefault();
                                                
                                                    setHighlightedIndex((prev) => (prev < searchResults.length - 1) ? (prev + 1) : 0);
                                                    
                                                    return;
                                                }

                                            // Move UP: Shift+Tab or ArrowUp
        
                                                if ((e.key === "Tab" && e.shiftKey) || (e.key === "ArrowUp"))
                                                {
                                                    e.preventDefault();
                                                
                                                    setHighlightedIndex((prev) => (prev > 0) ? (prev - 1) : (searchResults.length - 1));
                                                    
                                                    return;
                                                }

                                            // Enter selects highlighted item
                                            
                                                if ((e.key === "Enter") && (highlightedIndex >= 0))
                                                {
                                                    const picked = searchResults[highlightedIndex];

                                                
                                                    setShowDropdown(false);

                                                    if (picked.type === "product")
                                                        navigate(`/product/${picked.item.slug}`);

                                                    if (picked.type === "category")
                                                        navigate(`/category/${picked.item.slug}`);

                                                    setSearchResults([]);
                                                
                                                    setSearchInput("");
                                                
                                                    return;
                                                }

                                            // Escape closes dropdown
                                            
                                                if (e.key === "Escape")
                                                {
                                                    setShowDropdown(false);
                                                    return;
                                                }
                                        }

                                        if (e.key === "Enter") handleSearchSubmit();
                                    }}

                                    
                                    ref={searchRef}
                                    
                                    className={`relative ${user?.name.length > 9 ? `lg:w-20 xl:w-42 2xl:w-73` : `lg:w-36 xl:w-63 2xl:w-93`} p-3 text-yellow-600 dark:text-yellow-300 placeholder:text-xl placeholder:font-semibold font-extrabold`}
                                
                                />

                                
                                <img src="/icons/search.png" alt="search" tabIndex={0} className="dark:hidden flex h-12 p-3" onClick={handleSearchIconClick} />
                                
                                <img src="/icons/dark_search.png" alt="search" tabIndex={0} className="hidden dark:flex h-12 p-3" onClick={handleSearchIconClick} />
                                
                            
                                
                                {/* ====================== START: SEARCH FEATURE CHANGES ====================== */}
                                    
                                    {(showDropdown && searchResults.length > 0) && (
                                        
                                        <div className="absolute left-[5%] lg:left-[22%] top-24 xl:top-29.75 xl:w-[53%] 2xl:w-[40%] 2xl:left-[22%] xl:left-[17.5%] w-[55%] bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-xl mt-1 z-300">
                                            
                                            {searchResults.map((res, index) => (
                                                
                                                <div
                                                    
                                                    key={res.item.$id}

                                                    tabIndex={0}    // make HTML element focusable.
                                                    
                                                    // className="p-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-0 border-b border-gray-200 cursor-pointer text-black"

                                                    className={`p-3 border-b border-gray-200 dark:border-gray-500 cursor-pointer text-black dark:text-white ${highlightedIndex === index ? "bg-gray-200 dark:bg-gray-500" : "hover:bg-gray-100 dark:hover:bg-gray-500"}`}

                                                    onMouseEnter={() => setHighlightedIndex(index)}

                                                    onClick={() =>
                                                    {
                                                        setShowDropdown(false);

                                                        if (res.type === "product")
                                                        {
                                                            incrementProductSearchCount(res.item.$id);
                                                        
                                                            navigate(`/product/${res.item.slug}`);
                                                        }
                                                        
                                                        if (res.type === "category")
                                                        {
                                                            incrementCategorySearchCount(res.item.$id);

                                                            navigate(`/category/${res.item.slug}`);
                                                        }

                                                        setSearchResults([]);
                                                        setSearchInput("");
                                                    }}
                                                >
                                                    
                                                    <div className="flex justify-between items-center gap-2">

                                                        <span className="text-yellow-500 dark:text-yellow-300 font-extrabold text-lg">
                                                            
                                                            {res.type === "category" ? "Category: " : "Product: "}

                                                        </span>
                                                        

                                                        <span className={`font-mono flex items-center ${(res.type === "category") ? `gap-5.5` : `gap-4`}`}>
                                                            
                                                            {/* {res.item.name} */}

                                                            {highlightMatch(res.item.name, searchInput)}

                                                            {/*{console.log(res.item.image_url)}*/}

                                                            <img 
                                                            
                                                                src={res.item.image_url} alt="icon" 
                                                            
                                                                // className={`${(res.type === "product") ? `w-14` : `w-10 mr-2.5`}`}
                                                            
                                                                className={`${res.type === "product" ? (res.item.slug === "fruita-vitals-orange-juice" || res.item.slug === "heinz-tomato-ketchup") ? `max-md:w-10 max-md:h-11 max-md:ml-0.5 md:w-14 md:h-16` : `max-md:w-10 max-md:ml-0.5 md:w-14` : "max-md:w-5.5 md:w-10 max-md:ml-2 mr-2.75"}`}
                                                            />


                                                        </span>

                                                    </div>

                                                </div>

                                            ))}
                                        
                                        </div>
                                        
                                    )}
                                
                            </div>           
                
                        </div>
                    
                        
                        
                    {/* Right side icons. Right side of the navbar */}

                        <div className={`flex shrink-0 justify-end items-center ${cartTotal <= 9.99 ? `max-md:gap-6` : (cartTotal <= 99.99) ? `max-md:gap-5` : `max-md:gap-4.5` } ${user?.name.length > 9 ? `lg:gap-3.5` : `xl:-ml-2 max-md:gap-3 lg:gap-5`} md:max-lg:gap-5 transition-all duration-200`}>
                            
                            {/* Search modal search icon. Only for mobile and tablet view */}
                            
                                <div className={`${(cartTotal <= 9.99) ? `max-md:-ml-7.5` : (cartTotal <= 99.99) ? `max-md:-ml-7.75` : `max-md:-ml-7`} lg:hidden md:max-lg:-ml-16.25`} onClick={() => { !showMobileProfileDropdown && setShowSearchModal(true); setTimeout(() => searchRef.current?.focus(), 50); }}>
                            
                                    <img src="/icons/search.png" alt="FoodMart" className="dark:hidden flex h-6.5 max-md:px-2 p-1.25 md:h-11 md:p-2 rounded-r-full lg:rounded-full bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer" />

                                    <img src="/icons/dark_search.png" alt="FoodMart" className="hidden dark:flex h-6.5 max-md:px-2 p-1.25 md:h-11 md:p-2 rounded-r-full lg:rounded-full bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer" />
                    
                                </div>
                            
                        
                            {/* Orders button only for tablets and desktop. */}
                            
                                <Link 
                                
                                    to="/orders"
                                
                                    className="hidden lg:flex relative bg-gray-100 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-700 rounded-full p-1.25 md:p-2"
                                    
                                    onClick={(e) => { e.preventDefault(); navigate("/orders"); }}
                                >
                                    
                                    <img

                                        src={ordersQuantity > 0 ? `/icons/order-delivery.png` : `/icons/shopping-bag.png`}

                                        title="orders"
                                        
                                        className="h-4 md:h-7 cursor-pointer"
                                    />
                                    
                                    
                                    <span className={`absolute ${ordersQuantity > 9 ? `-top-3 -right-1.5 md:-top-3.75 md:-right-3.75 xl:-top-4 xl:-right-3 2xl:-top-4 2xl:-right-3.5` : `-top-2.5 -right-1 md:-top-3.25 md:-right-2 xl:-top-4 xl:-right-1.25 2xl:-top-4 2xl:-right-1.5`} font-bold bg-yellow-500 dark:bg-yellow-300 dark:text-gray-600 dark:hover:bg-orange-400 hover:bg-orange-600 text-white text-md rounded-full max-md:text-[10px] px-1.25 md:px-2 hover:-translate-y-1 transition-all duration-200`}>
                                
                                            {ordersQuantity}
                            
                                    </span>

                                </Link>
                    
                        
                            {/* Wishlist button only for tablets and desktop */}
                            
                                <Link to="/wishlist" className="hidden lg:flex relative bg-gray-100 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-700 rounded-full p-1.25 md:p-2" onClick={(e) => { e.preventDefault(); navigate("/wishlist"); }}>

                                    <img
                        
                                        src="/icons/heart.svg"
                            
                                        alt="Wishlist"
                            
                                        className="dark:hidden flex h-4 sm:h-7 cursor-pointer"
                                        
                                        title="wishlist"
                            
                                    />


                                    <img
                        
                                        src="/icons/dark_heart.png"
                            
                                        alt="Wishlist"
                            
                                        className="hidden dark:flex h-4 sm:h-7 cursor-pointer"
                                        
                                        title="wishlist"
                            
                                    />
                                    
                                        
                                    <span className={`absolute ${wishlistQuantity > 9 ? `-top-3 -right-1.5 sm:-top-3.75 sm:-right-3.75 xl:-top-4 xl:-right-3 2xl:-top-4 2xl:-right-3.5` : `-top-2.5 -right-1 sm:-top-3.25 sm:-right-2 xl:-top-4 xl:-right-1.25 2xl:-top-4 2xl:-right-1.5`} font-bold bg-yellow-500 dark:bg-yellow-300 dark:text-gray-600 dark:hover:bg-orange-400 hover:bg-orange-600 text-white text-md rounded-full max-sm:text-[10px] px-1.25 sm:px-2 hover:-translate-y-1 transition-all duration-200`}>
                                
                                            {wishlistQuantity}
                            
                                    </span>
                                    
                                </Link>
                    
                        
                            {/* Cart drawer button. Full version only for mobile and desktop view. Not for tablets i.e md */}
                            
                                <div
                        
                                    // setting openCart to true measn that the cart drawer should be opened now.
                                    
                                        onClick={() => setOpenCart(true)}
                                    
                                    className="xl:mr-13 xl:ml-11 2xl:mr-20 2xl:ml-18 relative cursor-pointer flex flex-row justify-between"
                                    
                                    tabIndex={0}
                                    
                                    title="cart"
                                >
                                    
                                
                                    <div className="flex flex-row bg-gray-100 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-700 rounded-full p-1.25 max-md:px-2 md:p-2 2xl:w-50">
                                        
                                        <div className="md:max-xl:hidden flex flex-col items-center xl:mx-1 2xl:mr-0.5 cursor-pointer px-1 xl:px-3 2xl:px-4">
                                            
                                            <span className="hidden xl:flex text-2xl font-bold dark:text-white"> Your Cart </span>

                                            <span className="text-[12px] xl:text-xl font-bold text-yellow-600 dark:text-yellow-300 dark:hover:text-orange-400 hover:text-orange-600"> {cartTotal ? `$${cartTotal}` : "$0.00"} </span>    
                                        
                                        </div>                
                        
                                        {
                                            isCheckoutPage ?
                                            
                                            (
                                                <img
                                
                                                    src={`/icons/checkout.png`}
                                        
                                                    alt="Cart"

                                                    className="xl:mt-3 xl:mr-2 2xl:mt-3.5 h-4.25 md:h-7 cursor-pointer"

                                                />
                                            )
                                            
                                            :
                                            
                                            (
                                                <>
                                                
                                                     <img
                                        
                                                        src={`/icons/shopping-cart.png`}
                                            
                                                        alt="Cart"

                                                        className="dark:hidden flex xl:mt-3 xl:mr-2 2xl:mt-3.5 h-4.25 md:h-7 cursor-pointer"

                                                    />


                                                    <img
                                        
                                                        src={`/icons/dark_cart.png`}
                                            
                                                        alt="Cart"

                                                        className="hidden dark:flex xl:mt-3 xl:mr-2 2xl:mt-3.5 h-4.25 md:h-7 cursor-pointer"

                                                    />
                                                
                                                </>
                                            )
                                        }
                                        
                            
                                        <span className={`absolute ${cartQuantity > 9 ? `-top-2 -right-2.5 md:-top-3.5 md:-right-4 xl:top-px xl:-right-2.5 2xl:top-px 2xl:-right-0.5` : `-top-2 -right-1 md:-top-3 md:-right-2 xl:-top-0.5 xl:right-1 2xl:top-px 2xl:right-1.5`} font-bold bg-yellow-500 dark:bg-yellow-300 dark:text-gray-600 dark:hover:bg-orange-400 hover:bg-orange-600 text-white text-md rounded-full max-md:text-[10px] px-1.25 md:px-2`}>
                                
                                            {cartQuantity}
                            
                                        </span>

                                    </div>
                                    
                        
                                </div>
                            
                        
                            {/* Mobile Profile button. Mobile only. */}
                            
                                <Link 
                                
                                    // className="flex md:hidden bg-gray-100 hover:bg-gray-200 rounded-full p-1.25"
                                    
                                    onClick={() => !showSearchModal && setShowMobileProfileDropdown(!showMobileProfileDropdown)}
                                    
                                    
                                    className={`flex md:hidden bg-gray-100 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-700 rounded-full p-1.25`}

                                >
                                    
                                    <img
                                        
                                        src="/icons/user.svg"

                                        // src={(profile || user) ? (profile.profile_pic) : "/icons/user.svg"}

                                        className={`dark:hidden flex cursor-pointer h-4.25`}                                    
                                    />
                                    

                                    <img
                                        
                                        src="/icons/dark_user.png"

                                        // src={(profile || user) ? (profile.profile_pic) : "/icons/user.svg"}

                                        className={`hidden dark:flex cursor-pointer h-4.25`}                                    
                                    />
                                
                                </Link>

                            
                            {/* Profile dropdown + logout button */}
                            
                                <div className={`hidden md:flex items-center gap-1 md:gap-3 lg:max-xl:gap-5 xl:gap-5 md:max-lg:ml-11.5 lg:ml-13 ${user?.name.length > 9 ? `ml-1 /*md:ml-10*/ /*lg:ml-7*/ xl:ml-0 2xl:ml-3` : `ml-3.5 /*md:ml-20*/ /*lg:ml-7*/ xl:ml-0 2xl:ml-3`}`}>
                                    
                                    {/* USERNAME IN MD BREAKPOINT */}
                                    
                                        {/* <span className="flex lg:hidden text-lg font-extrabold font-mono text-red-600 " title={user?.name || "Guest"}> */}
                                        
                                            {/* {(user && user?.name.length > 9) ? user?.name.slice(0, 8) + "..." : user?.name} */}
                                            {/* Guest */}

                                        {/* </span> */}
                                    
                            
                                    {/* USERNAME IN LG BREAKPOINT */}
                                    
                                        {/* <span className="hidden lg:max-xl:flex text-lg font-extrabold font-mono text-red-600 " title={user?.name || "Guest"}> */}
                                        
                                            {/* {(user && user?.name.length > 11) ? user?.name.slice(0, 10) + "..." : user?.name} */}
                                            {/* Guest */}

                                        {/* </span> */}
                                    
                            
                                    {/* USERNAME IN XL + @XL BREAKPOINTS */}
                                    
                                        {/* <span className="hidden xl:flex text-lg font-extrabold font-mono text-red-600 " title={user?.name || "Guest"}> */}
                                        
                                            {/* {(user && user?.name.length > 13) ? user?.name.slice(0, 12) : user?.name} */}
                                            {/* Guest */}

                                        {/* </span> */}
                                    
                            

                                    {/* Mobile Profile button */}
                            
                                        <Link 
                                        
                                            // className="flex md:hidden bg-gray-100 hover:bg-gray-200 rounded-full p-1.25"
                                            
                                            onClick={() => !showSearchModal && setShowMobileProfileDropdown(!showMobileProfileDropdown)}
                                            
                                            
                                            className={`hidden md:flex bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700 hover:bg-gray-200 rounded-full p-2`}

                                            title="Profile"
                                        >
                                            
                                            <img
                                                
                                                src="/icons/user.svg"

                                                // src={(profile || user) ? (profile.profile_pic) : "/icons/user.svg"}

                                                className={`dark:hidden flex cursor-pointer h-7`}                                    
                                            />

                                            <img
                                        
                                                src="/icons/dark_user.png"

                                                // src={(profile || user) ? (profile.profile_pic) : "/icons/user.svg"}

                                                className={`hidden dark:flex cursor-pointer h-7`}                                    
                                            />
                                        
                                        </Link>
                                    
                                    {/* Logout button */}
                                    
                                        <button 
                                        
                                            // className="mt-1 px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                                            
                                            // className="mt-1 md:ml-5 lg:ml-10 xl:ml-5 transition-all duration-200 rounded-full"
                                    
                                            onClick={handleLogout}
                                        >
                                            
                                            <img src="/icons/logout.png" title="logout" alt="logout" className="dark:hidden flex w-9 hover:w-10 rounded-full transition-all duration-75" />

                                            <img src="/icons/dark_logout.png" title="logout" alt="logout" className="hidden dark:flex w-9 hover:w-10 rounded-full transition-all duration-75" />

                                        </button>

                                </div>
                            
                        
                        </div>

                    
                </div>

                
            </header>

          

        {/* Cart Drawer */}
      
            {/* if cart is allowed to open, open it and pass the function to close the drawer to the drawer component. */}

                {!showMobileProfileDropdown && !showSearchModal && openCart && <CartDrawer onClose={() => setTimeout(() => setOpenCart(false), 0)} />}
                
          

        {/* Mobile menu drawer */}

            <MobileMenuDrawer

                openMenuDrawer={openMobileMenu}

                onClose={() => setOpenMobileMenu(false)}

            />
          


        {/* Menu & dropdown placeholders */}

            <section className="container mx-auto flex items-center justify-start pt-3 lg:pt-12 px-3 sm:px-5 transition-all duration-200">

                {/* Hamburger menu for menu and dropdowns */}
                
                {/* Only shown until large(lg) breakpoint */}
                    
                    <button className="lg:hidden" onClick={() => setOpenMobileMenu(true)}>
                    
                        <img src="/icons/hamburger_menu.png" alt="hamburger_menu_icon" 
                            
                        className="h-7 p-1 md:h-10 md:p-1.5 cursor-pointer border border-gray-400 dark:bg-gray-500 dark:hover:bg-gray-700 hover:bg-gray-100 rounded-lg"
                    
                        />

                    </button>
                

                
                {/* menu and dropdown bar */}
                
                {/* shown from the large(lg) breakpoint to above */}
                    
                    {/* departments dropdown */}
                        
                        <div className="hidden lg:flex text-xl text-gray-700 dark:text-white">
                            
                            <select name="departments" id="departments" value={selectedDepartment} onChange={handleDepartmentChange} className="justify-start lg:mr-22 xl:mr-21 2xl:mr-27 focus:border hover:text-gray-900 dark:hover:text-gray-200 py-2 bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-700 text-center rounded-lg">

                                <option value="shopbydepartments"> Shop by Departments </option>
                                
                                <option value="Groceries"> Groceries </option>
                                
                                <option value="Drinks"> Drinks </option>

                                <option value="Chocolates"> Chocolates </option>
                                
                            </select>

                        </div>

                
                    {/* menu bar */}
                    
                        <div className="text-gray-700 dark:text-white text-xl">
                            
                            <ul className="hidden lg:flex lg:flex-row  items-center gap-6">

                                <Link to="/women" onClick={(e) => { e.preventDefault(); navigate("/women"); }}> <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">Women</li> </Link>

                                <Link to="/men" onClick={(e) => { e.preventDefault(); navigate("/men"); }}> <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" value="men" onClick={handlePageChange}>Men</li> </Link>

                                <Link to="/kids" onClick={(e) => { e.preventDefault(); navigate("/kids"); }}> <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" value="kids" onClick={handlePageChange}>Kids</li> </Link>

                                <Link to="/accessories" onClick={(e) => { e.preventDefault(); navigate("/accessories"); }}> <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" value="accessories" onClick={handlePageChange}>Accessories</li> </Link>
                                
                                    
                                <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 relative flex items-center">
                                    
                                    <label
                                        htmlFor="pages"
                                        className="cursor-pointer text-xl text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 flex items-center"
                                    >
                                        Pages
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 ml-1 dark:hover:text-gray-200"
                                        tabIndex={0}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </label>
                                        
                                    <select name="pages" id="pages" value={selectedPage} onChange={handlePageChange} className="absolute opacity-0 inset-0 cursor-pointer dark:bg-gray-400 dark:text-white dark:hover:text-gray-200">

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

                                    
                                <Link to="/brand" tabIndex={0} onClick={(e) => { e.preventDefault(); navigate("/brand"); }}> <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" value="brand" onClick={handlePageChange}>Brand</li> </Link>

                                <Link to="/sale" tabIndex={0} onClick={(e) => { e.preventDefault(); navigate("/sale"); }}> <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" value="sale" onClick={handlePageChange}>Sale</li> </Link>

                                <Link to="/blog" tabIndex={0} onClick={(e) => { e.preventDefault(); navigate("/blog"); }}> <li className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" value="blog" onClick={handlePageChange}>Blog</li> </Link>

                            </ul>

                        </div>
                    
            </section>
            
          

        {/* Mobile Search Modal */}
        
            {/* Mobile search modal for md and below */}

               {/* ================= MOBILE SEARCH MODAL ================= */}

                    {showSearchModal && (
                        <>
                            
                            {/* Modal */}
                            
                                <div className="lg:hidden fixed top-14.5 md:top-25.5 left-1/2 -translate-x-1/2 max-md:w-full md:max-lg:w-[72%] lg:w-[70%] bg-white dark:bg-gray-600 md:rounded-b-xl shadow-xl p-3 z-50">

                                        
                                    {/* Search Input */}
                                    
                                        <div className="flex bg-gray-100 dark:bg-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full max-md:py-1 max-md:px-1.75 md:p-2 mb-1 md:mb-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchInput}
                                                ref={searchRef}
                                                onChange={handleSearchChange}
                                                onKeyDown={(e) => {
                                                    if (!showDropdown || searchResults.length === 0) {
                                                        if (e.key === "Enter") handleSearchSubmit();
                                                        return;
                                                    }

                                                    if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
                                                        e.preventDefault();
                                                        setHighlightedIndex((prev) =>
                                                            prev < searchResults.length - 1 ? prev + 1 : 0
                                                        );
                                                    }

                                                    if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
                                                        e.preventDefault();
                                                        setHighlightedIndex((prev) =>
                                                            prev > 0 ? prev - 1 : searchResults.length - 1
                                                        );
                                                    }

                                                    if (e.key === "Enter" && highlightedIndex >= 0) {
                                                        const res = searchResults[highlightedIndex];

                                                        if (res.type === "category") {
                                                            navigate(`/category/${res.item.slug}`);
                                                        } else {
                                                            navigate(`/product/${res.item.slug}`);
                                                        }

                                                        setShowSearchModal(false);
                                                        setSearchInput("");
                                                    }

                                                    if (e.key === "Escape") {
                                                        setShowSearchModal(false);
                                                    }
                                                }}
                                                className="w-full bg-transparent outline-none max-md:p-0.75 md:p-2 text-yellow-600 dark:text-yellow-300 font-bold md:font-extrabold max-md:text-[12px] text-lg placeholder:text-sm md:placeholder:text-xl"
                                            />

                                            <img
                                                src="/icons/search.png"
                                                className="dark:hidden flex h-8 md:h-10 p-2 cursor-pointer"
                                                onClick={handleSearchSubmit}
                                            />
                                            
                                            <img
                                                src="/icons/dark_search.png"
                                                className="hidden dark:flex h-8 md:h-10 p-2 cursor-pointer"
                                                onClick={handleSearchSubmit}
                                            />
                                            
                                        </div>

                                            
                                    {/* Results */}
                                    
                                        {searchResults.length > 0 && (
                                            <div className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-xl overflow-y-auto">

                                                {searchResults.map((res, index) => (
                                                    <div
                                                        key={res.item.$id}
                                                        tabIndex={0}
                                                        onMouseEnter={() => setHighlightedIndex(index)}
                                                        onClick={() => {
                                                            if (res.type === "category") {
                                                                incrementCategorySearchCount(res.item.$id);
                                                                navigate(`/category/${res.item.slug}`);
                                                            } else {
                                                                incrementProductSearchCount(res.item.$id);
                                                                navigate(`/product/${res.item.slug}`);
                                                            }

                                                            setShowSearchModal(false);
                                                            setSearchInput("");
                                                        }}
                                                        className={`p-2 ${(res.type === "category") ? `max-md:py-4 md:py-5` : ``} dark:text-white md:p-3 border-b border-gray-200 dark:border-gray-500 cursor-pointer flex justify-between items-center gap-3
                                                            ${highlightedIndex === index ? "bg-gray-200 dark:bg-gray-500" : "hover:bg-gray-100 dark:bg-gray-600"}
                                                        `}
                                                    >
                                                        <span className={`text-yellow-500 dark:text-yellow-300 font-extrabold max-md:text-[11px] md:text-lg`}>
                                                            {res.type === "category" ? "Category: " : "Product: "}
                                                        </span>

                                                        <span className="flex items-center gap-1 md:gap-4 max-md:text-[9px] font-mono">
                                                            {highlightMatch(res.item.name, searchInput)}
                                                            <img
                                                                src={res.item.image_url}
                                                                className={`${res.type === "product" ? (res.item.slug === "fruita-vitals-orange-juice" || res.item.slug === "heinz-tomato-ketchup") ? `max-md:w-10 max-md:h-11 max-md:ml-0.5 md:w-14 md:h-16` : `max-md:w-10 max-md:ml-0.5 md:w-14` : "max-md:w-5.5 md:w-10 max-md:ml-2 mr-2.75"}`}
                                                            />
                                                        </span>
                                                    </div>
                                                ))}

                                            </div>
                                        )}
                            
                                </div>
                        </>
                    )}
                    
          


        {/* Mobile Profile Dropdown */}
        
          
            {/* Mobile Profile Dropdown */}

                {showMobileProfileDropdown && (
        
                    <>
                
                        {/* Backdrop */}
                
                            <div
                    
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                                
                                onClick={() => setShowMobileProfileDropdown(false)}
                            />
                
                
                        {/* Dropdown Menu */}
                
                            <div className="transition-all duration-200 max-md:p-2 md:p-4 2xl:p-8 fixed max-md:top-16 md:top-25.25 xl:top-30.75 right-0 bg-white dark:bg-gray-600 rounded-bl-lg shadow-2xl border border-gray-200 dark:border-gray-500 z-40">

                      
                                {/* User Info */}
                                
                                    <div>
                                        
                                        <div className="flex md:mt-1 max-md:px-2 md:px-4 2xl:px-6">
                                            
                                            <div>
                                            
                                                <p className="max-md:text-[14px] md:text-2xl 2xl:text-3xl font-bold md:font-extrabold text-yellow-500 dark:text-yellow-300 truncate">
                                                    {user?.name || "Guest"}
                                                </p>
                                                
                                                <p className="max-md:text-[10px] md:text-md 2xl:text-lg text-gray-500 dark:text-gray-100 truncate md:mt-1 2xl:mt-2">
                                                    {user?.email || "guest@example.com"}
                                                </p>
                                                
                                            </div>
                                            
                                        </div>
                                        
                          
                                        {/* Divider */}
                                
                                        <div className="lg:hidden border-t border-gray-200 dark:border-gray-500 md:border-gray-300 max-md:mt-2 md:mt-5"></div>
                                        
                                    </div>
                                
                      
                                {/* Menu Items */}
                                
                                    <div className="lg:hidden mt-1 md:mt-2">
                                        
                                        {/* Orders */}
                                        
                                            <button
                                                
                                                onClick={() => {navigate("/orders"); setShowMobileProfileDropdown(false);}}
                                                
                                                className="md:max-lg:hover:bg-gray-100 dark:md:max-lg:hover:bg-gray-500 w-full flex items-center justify-between max-md:p-2 p-4 rounded-lg cursor-pointer"
                                            >
                                                <div className="flex items-center max-md:gap-1.5 gap-3">
                                                
                                                    <img
                                                        src={ordersQuantity > 0 ? `/icons/order-delivery.png` : `/icons/shopping-bag.png`}
                                                        alt="Orders"
                                                        className="max-md:w-4.25 w-7 md:hover:-translate-y-1 md:duration-200"
                                                    />
                                                
                                                    <span className="max-md:text-[11px] text-md font-mono font-medium text-gray-700 dark:text-white">Orders</span>
                                                    
                                                </div>
                                                
                                                
                                                <span className={`bg-yellow-500 dark:bg-yellow-300 dark:md:hover:bg-orange-400 md:hover:bg-orange-600 md:hover:-translate-y-1 md:transition-all md:duration-200 text-white dark:text-gray-600 max-md:text-[10px] text-lg font-extrabold rounded-full max-md:px-2 py-0.75 ${(ordersQuantity > 9) ? `px-3` : `px-4.5`}`}>
                                                    {ordersQuantity}
                                                </span>
                                                
                                            </button>
                                        
                                    
                                        {/* Wishlist */}
                                    
                                            <button
                                                onClick={() => {navigate("/wishlist"); setShowMobileProfileDropdown(false);}}
                                                
                                                className="md:max-lg:hover:bg-gray-100 dark:md:max-lg:hover:bg-gray-500 w-full flex items-center justify-between max-md:p-2 p-4 rounded-lg cursor-pointer"
                                            >
                                                <div className="flex items-center max-md:gap-1.75 gap-3.25">
                                                
                                                    <img
                                                        src="/icons/heart.svg"
                                                        alt="Wishlist"
                                                        className="dark:hidden flex max-md:w-4 w-6.75 md:hover:-translate-y-1 md:duration-200"
                                                    />


                                                    <img
                                                        src="/icons/dark_heart.png"
                                                        alt="Wishlist"
                                                        className="hidden dark:flex max-md:w-4 w-6.75 md:hover:-translate-y-1 md:duration-200"
                                                    />
                                                    
                                                    <span className="max-md:text-[11px] text-md font-mono font-medium text-gray-700 dark:text-white">Wishlist</span>
                                                    
                                                </div>
                                                
                                                
                                                <span className={`bg-yellow-500 dark:bg-yellow-300 dark:md:hover:bg-orange-400 md:hover:bg-orange-600 md:hover:-translate-y-1 md:transition-all md:duration-200 text-white dark:text-gray-600 max-md:text-[10px] text-lg font-extrabold rounded-full max-md:px-2 py-0.75 ${(wishlistQuantity > 9) ? `px-3` : `px-4.5`}`}>
                                                    {wishlistQuantity}
                                                </span>
                                                
                                            </button>

                                    
                                        {/* Divider */}
                                    
                                            <div className="md:hidden border-t border-gray-200 dark:border-gray-500 md:border-gray-300 max-md:mb-2 max-md:mt-1 md:mt-3 md:mb-4"></div>

                      
                                        {/* Dark Mode Toggle */}
                                            
                                            <div className="md:hidden"> 
                                                
                                                <DarkModeToggle />
                                                
                                            </div>
                                            

                                        {/* Divider */}
                                    
                                            <div className="md:hidden border-t border-gray-200 dark:border-gray-500 md:border-gray-300 mb-1"></div>

                                        
                                        {/* Logout */}
                                
                                            <button
                                                
                                                onClick={() => {handleLogout(); setShowMobileProfileDropdown(false);}}
                                                
                                                className="md:hidden cursor-pointer w-full flex items-center max-md:gap-1.5 gap-3 max-md:p-2 p-4 rounded-lg  text-red-600 dark:text-red-500 max-md:text-[13px] md:text-lg font-bold font-mono"
                                            >
                                                <img
                                                    src="/icons/logout.png"
                                                    alt="Logout"
                                                    className="max-md:w-4 w-7 md:hover:-translate-y-1 md:duration-200" 
                                                />

                                                Logout
                                                
                                            </button>
                                        
                                    </div>
                                    
                      

                                    {/* Divider */}
                                    
                                        <div className="hidden md:flex border-t border-gray-200 dark:border-gray-500 md:border-gray-300 md:mt-2 md:mb-5.5 2xl:mt-6 2xl:mb-6"></div>

                      
                                    {/* Dark Mode Toggle */}
                                        
                                        <div className="hidden md:flex mb-1.5 px-2 2xl:px-4"> 
                                                
                                            <DarkModeToggle />
                                            
                                        </div>
                        

                      
                            </div>
                            
                    </>
                
                )
            }
    
    </>
    
  );
}
