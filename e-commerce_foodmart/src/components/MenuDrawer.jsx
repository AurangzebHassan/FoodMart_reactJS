import React, { useEffect, useState } from "react";



export default function MobileMenuDrawer({ openMenuDrawer, onClose, onNavigate })
{
    // local animation flag to play slide-in/out
  
        const [isVisible, setIsVisible] = useState(false);


    // when `openMenuDrawer` changes to true, show with animation.
  
    // here, 'openMenuDrawer' is equivalent to the openCart variable.
    
    // it tells us when we're allowed to open the hamburger menu drawer

        useEffect(() =>
        {
            if (openMenuDrawer)
            {
                // disable body scroll when drawer is open
        
                document.body.style.overflow = "hidden";

                
                // added slight delay for smooth slide-in (same as CartDrawer)
        
                setTimeout(() => setIsVisible(true), 10);
            }
            
            else
            {
                // when drawer closes, start slide-out animation
        
                setIsVisible(false);

                
                // restore body scroll AFTER animation finishes
        
                    const t = setTimeout(() => document.body.style.overflow = "", 300);

        
                // cleanup timeout
        
                return () => clearTimeout(t);
            }
        },
            [openMenuDrawer]
        
        );
 

    // close handler that animates then calls onClose
  
        const handleClose = () =>
        {
            // step 1 — trigger CSS slide-out animation
        
                setIsVisible(false);

            
            // step 2 — after animation completes, remove component from DOM
        
                setTimeout(() => onClose(), 200);
        };


    // Helper to navigate (keeps behavior consistent with your Navbar)
  
        const navigateTo = (path) =>
        {
            // close drawer first so UI feels snappy
        
                handleClose();

            
            // small delay to allow drawer to start closing
        
            setTimeout(() =>
            {
                window.location.href = path;

        
                if (onNavigate) onNavigate(path);
            },
                250
            
            );
        };

    
    // Render nothing if not mounted (open or in transition)
  
    // do nothing if the drawer is closed or it is in the animation
  
      if (!openMenuDrawer && !isVisible) return null;

    
    
    
    
    
  return (
    // overlay with fade

    // ✅ CHANGED: use `justify-end` (slide from right) instead of `justify-start`

    // ✅ matches CartDrawer’s fade + layout behavior exactly

    <div
      className={`fixed inset-0 bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* dark overlay - click closes */}

      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        role="button"
        aria-label="Close menu"
      />

      {/* ✅ CHANGED: slide-in drawer (from right, not left) */}
      {/* same transform/transition classes as CartDrawer */}

      <nav
        className={`relative bg-white w-[70%] md:w-120 max-w-full h-full transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        } shadow-xl md:p-6 flex flex-col overflow-y-auto`}
        aria-label="Mobile menu"
      >
        {/* ✅ CHANGED: centered close button for symmetry with CartDrawer */}

        <div className="flex max-md:px-4 max-md:pt-4 justify-center">
          <button
            onClick={handleClose}
            aria-label="Close menu"
            className="text-gray-600 hover:text-gray-900 text-4xl md:text-6xl"
          >
            &times;
          </button>
        </div>

        {/* <div className="p-6">

                    <h1 className="text-3xl font-extrabold text-yellow-500"> Menu </h1>
                      
                </div> */}

        {/* Departments select (vertical) */}

        <div className="mb-4 px-4 pt-4 md:mb-6 md:px-6 md:pt-6">
          <select
            id="mobile-departments"
            className="md:w-full p-3 rounded-lg bg-gray-100 hover:bg-gray-200  md:text-xl"
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              navigateTo(`/${v.toLowerCase()}`);
            }}
            defaultValue=""
          >
            <option value="">Shop by Departments</option>
            <option value="Groceries">Groceries</option>
            <option value="Drinks">Drinks</option>
            <option value="Chocolates">Chocolates</option>
          </select>
        </div>

        {/* Vertical menu links */}

        <ul className="md:space-y-4 px-4 md:px-6 md:text-xl text-gray-900">
          {["Women", "Men", "Kids", "Accessories"].map((item) => (
            <li key={item}>
              <button
                onClick={(e) => {e.preventDefault(); navigateTo(`/${item.toLowerCase()}`)}}
                className="w-full text-left px-1 py-3 rounded hover:text-yellow-600"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        {/* Pages select */}

        <div id="hamburger_pages_container" className="mb-4 px-4 pt-4 md:mb-6 md:px-6 md:pt-6">
          
          <select
            id="mobile-pages"
            className="md:w-full p-3 rounded-lg bg-gray-100 hover:bg-gray-200 md:text-xl"
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;

              navigateTo(`/${v.toLowerCase()}`);
            }}
          >
            <option value="">Pages</option>
            <option value="about_us">About Us</option>
            <option value="shop">Shop</option>
            <option value="single_product">Single Product</option>
            <option value="cart">Cart</option>
            <option value="checkout">Checkout</option>
            <option value="blog">Blog</option>
            <option value="single_post">Single Post</option>
            <option value="styles">Styles</option>
            <option value="thank_you">Thank You</option>
            <option value="my_account">My Account</option>
            <option value="404_error">404 Error</option>
          </select>
        </div>

        {/* quick links at bottom */}

        <ul className="md:space-y-4 px-4 md:px-6 md:text-xl text-gray-900">
          {["Brand", "Sale", "Blog"].map((item) => (
            <li key={item}>
              <button
                onClick={(e) => {e.preventDefault(); navigateTo(`/${item.toLowerCase()}`)}}
                className="w-full text-left px-1 py-3 rounded hover:text-yellow-600"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}