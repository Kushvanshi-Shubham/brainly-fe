import React from "react";

import type { IconProps } from "../IconProps";

const iconSizeVariants = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
  custom: "",
};

export const PlusIcon: React.FC<IconProps> = ({ className, size = "md" }) => {
  const finalClassName = className || iconSizeVariants[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={finalClassName} 
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};
