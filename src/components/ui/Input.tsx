import React from "react";
import { cn } from "../../utlis/cn";


export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;


export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "py-3 px-4", 
          "border border-gray-200 dark:border-gray-600",
          "rounded-xl", 
          "w-full",
          "bg-white/80 dark:bg-gray-800/80",
          "backdrop-blur-sm",
          "text-gray-900 dark:text-white",
          "placeholder-gray-400 dark:placeholder-gray-500",
          
          // Focus states
          "focus:outline-none",
          "focus:ring-2 focus:ring-purple-500/50",
          "focus:border-purple-500",
          "focus:bg-white dark:focus:bg-gray-800",
          
          // Hover states
          "hover:border-purple-300 dark:hover:border-purple-600",
          "hover:shadow-sm",
          
          "transition-all duration-200 ease-out",
          
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);


Input.displayName = "Input";
