import React from "react";
import { cn } from "../../utlis/cn";


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}


export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "py-2.5 px-4", 
          "border border-gray-300 dark:border-gray-600",
          "rounded-lg", 
          "w-full",
          "bg-white dark:bg-gray-700",
          "text-gray-900 dark:text-white",
          "placeholder-gray-400 dark:placeholder-gray-500",
          
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
          "hover:border-purple-400 dark:hover:border-purple-500",
          "transition-all duration-200",
          
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
