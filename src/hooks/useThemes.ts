import { useEffect, useState, useCallback } from "react";


export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
   
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== null) {
      return storedTheme === "dark";
    }


    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }


    return false;
  });


  useEffect(() => {
    
    document.documentElement.classList.toggle("dark", isDark);
    
 
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]); 
  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  return { isDark, toggleTheme };
}
