import React from "react";



// Tailwind-safe mapping of sizes

  const sizeMap =
  {
    small: "h-4 w-4",

    medium: "h-6 w-6",

    large: "h-8 w-8",
	
	xl: "h-10 w-10"
};



const Loader = ({ size = "medium", color = "border-blue-500" }) =>
{
  // size: 'small', 'medium', 'large'

  // color: any Tailwind border color class

  return (

    <div

		className=
		{`
			animate-spin          /* Makes the loader spin */
			
			rounded-full          /* Circular shape */
			
			border-4              /* Thickness of the spinner border */
			
			${color}              /* Main border color */
			
			border-t-transparent  /* Top part is transparent for spinning effect */
			
			${sizeMap[size] || sizeMap.medium} /* Tailwind-safe size */
      `}
    
    />
  
  );
};



export default Loader;