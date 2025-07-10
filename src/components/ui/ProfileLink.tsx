import React from "react";
import { NavLink } from "react-router-dom"; 
import { cn } from "../../utlis/cn";
import { UserIcon } from "../../Icons/IconsImport";

export const ProfileLink: React.FC = () => {
  const path = "/profile";

  return (
    <NavLink
      to={path}
      
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md", 
          "text-gray-700 dark:text-gray-300",
          "hover:bg-purple-100 dark:hover:bg-gray-700",
          "hover:text-purple-600 dark:hover:text-purple-400",
          "transition-all duration-200 ease-in-out",
      
          isActive
            ? "bg-purple-100 dark:bg-purple-900/50 font-semibold text-purple-700 dark:text-purple-300"
            : "font-normal"
        )
      }
      title="Go to Profile"
    >
     
      {({ isActive }) => (
        <>
          <UserIcon
            className={cn(
              "w-5 h-5",
              isActive
                ? "text-purple-600 dark:text-purple-300"
                : "text-gray-500 dark:text-gray-400"
            )}
          />
          <span>Profile</span>
        </>
      )}
    </NavLink>
  );
};
