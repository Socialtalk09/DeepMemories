import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window exists (client-side rendering)
    if (typeof window !== "undefined") {
      // Set initial state
      setIsMobile(window.innerWidth < 768);
      
      // Function to handle window resize
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Clean up on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return isMobile;
}