import { useEffect } from "react";



export default function useBlockBack(shouldBlock)
{
    useEffect(() =>
    {
        if (!shouldBlock) return;

    
        // Add a dummy history entry
    
            history.pushState(null, "", window.location.href);

    
            const onPopState = () =>
            {
                history.pushState(null, "", window.location.href);
            };

    
        window.addEventListener("popstate", onPopState);

    
        return () =>
        {
            window.removeEventListener("popstate", onPopState);
        };
        
    }, [shouldBlock]);
}