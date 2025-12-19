// DarkModeToggle.jsx
import { Moon, Sun } from 'lucide-react';

import { useState } from 'react';



export default function DarkModeToggle()
{
    // Just sync with the current state, don't initialize it
  
        const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  
    const toggleTheme = () =>
    {
        const newTheme = !isDark;
    
        setIsDark(newTheme);

    
        if (newTheme)
        {
            document.documentElement.classList.add('dark');
      
            localStorage.setItem('color-theme', 'dark');
        }
        
        else
        {
            document.documentElement.classList.remove('dark');
      
            localStorage.setItem('color-theme', 'light');
        }
    };


  



    return (
    
        <button
      
            onClick={toggleTheme}
      
            className="relative w-8.25 h-7 cursor-pointer hover:-translate-y-1 transition-all md:duration-200 /*rounded-lg*/ 
                 
                /*text-gray-500*/ /*dark:text-gray-400*/ 
                
                /*hover:bg-gray-100 /*dark:hover:bg-gray-700*/ 
                
                /*focus:outline-none*/ /*focus:ring-4*/ /*focus:ring-gray-200*/ /*dark:focus:ring-gray-700*/ focus:outline-0 focus:ring-0
                
                /*transition-colors*/"
      
            aria-label="Toggle dark mode"
        >
      
            {/* Moon icon - shown in light mode */}
      
            <Moon 
        
                className={`absolute inset-0 m-auto max-md:w-5 max-md:h-5 md:w-8 md:h-8 2xl:w-10 2xl:h-10 transition-all duration-300 
                    ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
            />
      
      
            {/* Sun icon - shown in dark mode */}
      
            <Sun 
        
                className={`absolute inset-0 m-auto max-md:w-5 max-md:h-5 md:w-8 md:h-8 2xl:w-10 2xl:h-10 transition-all duration-300 
                    ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
            />
    
        </button>
  
    );
}