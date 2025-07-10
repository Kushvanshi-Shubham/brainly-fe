import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utlis/cn";

interface SidebarItemProps {
  text: string;
  icon?: ReactNode;
  to: string;
  collapsed: boolean;
}

export function SidebarItem({ text, icon, to, collapsed }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end 
      className={({ isActive }) =>
        cn(
          "flex items-center py-2 px-3 rounded-md transition-all duration-200 ease-in-out whitespace-nowrap",
          "text-gray-700 dark:text-gray-300",
          "hover:bg-purple-100 dark:hover:bg-gray-700",
          "hover:text-purple-600 dark:hover:text-purple-400",
          
          isActive && "bg-purple-100 dark:bg-purple-900/50 font-semibold text-purple-700 dark:text-purple-300",
          collapsed ? "justify-center" : "gap-3"
        )
      }
      title={collapsed ? text : undefined}
    >
      {icon && (
        <div className="flex-shrink-0 flex items-center justify-center">
          {icon}
        </div>
      )}
      {!collapsed && <span className="flex-grow">{text}</span>}
    </NavLink>
  );
}
