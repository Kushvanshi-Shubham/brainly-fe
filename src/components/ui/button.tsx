import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../../utlis/cn";
import { Spinner } from "./Spinner";

const baseStyle = cn(
  "inline-flex items-center justify-center font-semibold",
  "transition-all duration-200 ease-in-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400",
  "dark:focus-visible:ring-offset-gray-900"
);

const variantStyles = {
  primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-md",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
  ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-md",
};

const sizeStyles = {
  sm: "py-1.5 px-3 text-sm rounded-md",
  md: "py-2.5 px-5 text-base rounded-md",
  lg: "py-3.5 px-7 text-lg rounded-lg",
};



export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  text?: string;
  children?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingText?: string; 
  fullWidth?: boolean;
}



export const Button = ({
  className,
  variant,
  size = "md",
  text,
  children,
  startIcon,
  endIcon,
  loading = false,
  loadingText = "Loading...",
  fullWidth,
  disabled, 
  ...props
}: ButtonProps) => {
  const content = children || text;
  const isDisabled = loading || disabled;

  return (
    <button
      className={cn(
        baseStyle,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        isDisabled && "opacity-60 cursor-not-allowed",
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center" aria-live="polite">
          <Spinner />
          {content && <span className="ml-2">{loadingText}</span>}
        </span>
      ) : (
        <>
          {startIcon && <span className="mr-2 flex items-center">{startIcon}</span>}
          {content}
          {endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
};
