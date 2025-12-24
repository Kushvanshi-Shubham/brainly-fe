import { cn } from "../../utlis/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8"
};

export const Spinner = ({ size = "md", className }: SpinnerProps) => (
  <svg
    className={cn("animate-spin text-current", sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-20"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.002 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Gradient spinner for special loading states
export const GradientSpinner = ({ size = "md", className }: SpinnerProps) => (
  <div className={cn("relative", sizeClasses[size], className)}>
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin" 
         style={{ 
           maskImage: "conic-gradient(transparent 70%, black)", 
           WebkitMaskImage: "conic-gradient(transparent 70%, black)" 
         }} 
    />
    <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-800" />
  </div>
);
