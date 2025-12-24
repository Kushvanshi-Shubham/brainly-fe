import { type ReactNode, memo } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utlis/cn";

interface SidebarItemProps {
  readonly text: string;
  readonly icon?: ReactNode;
  readonly to: string;
  readonly collapsed: boolean;
}

function SidebarItemComponent({ text, icon, to, collapsed }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end 
      className={({ isActive }) =>
        cn(
          "group relative flex items-center py-2.5 px-3 rounded-xl transition-all duration-200 ease-out whitespace-nowrap",
          "text-gray-600 dark:text-gray-400",
          
          // Hover states
          "hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50",
          "dark:hover:from-purple-900/20 dark:hover:to-pink-900/20",
          "hover:text-purple-600 dark:hover:text-purple-400",
          
          // Active states with gradient background
          isActive && "bg-gradient-to-r from-purple-100 to-pink-100",
          isActive && "dark:from-purple-900/40 dark:to-pink-900/40",
          isActive && "text-purple-700 dark:text-purple-300",
          isActive && "font-semibold",
          isActive && "shadow-sm shadow-purple-200/50 dark:shadow-purple-900/30",
          
          collapsed ? "justify-center" : "gap-3"
        )
      }
      title={collapsed ? text : undefined}
    >
      {/* Active indicator line */}
      {!collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full transition-all duration-300 group-[.active]:h-6" />
      )}
      
      {icon && (
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center transition-transform duration-200",
          "group-hover:scale-110"
        )}>
          {icon}
        </div>
      )}
      {!collapsed && (
        <span className="flex-grow transition-colors duration-200">
          {text}
        </span>
      )}
    </NavLink>
  );
}

export const SidebarItem = memo(SidebarItemComponent);
SidebarItem.displayName = "SidebarItem";
