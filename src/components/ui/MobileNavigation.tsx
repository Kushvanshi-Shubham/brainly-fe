import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../utlis/cn";
import { useNotifications } from "../../hooks/useNotifications";
import {
  HomeIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  FolderIcon,
  BellIcon,
  UserIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  FolderIcon as FolderIconSolid,
  BellIcon as BellIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

interface MobileNavigationProps {
  onAddContent: () => void;
}

const navItems = [
  { to: "/feed", label: "Feed", Icon: HomeIcon, IconActive: HomeIconSolid },
  { to: "/dashboard", label: "Home", Icon: Squares2X2Icon, IconActive: Squares2X2IconSolid },
  { to: "add", label: "Add", Icon: PlusIcon, IconActive: PlusIcon, isAdd: true },
  { to: "/explore", label: "Explore", Icon: MagnifyingGlassIcon, IconActive: MagnifyingGlassIconSolid },
  { to: "/activity", label: "Activity", Icon: BellIcon, IconActive: BellIconSolid, hasBadge: true },
];

export const MobileNavigation = ({ onAddContent }: MobileNavigationProps) => {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl",
      "border-t border-gray-200/50 dark:border-gray-700/50",
      "safe-area-inset-bottom",
      "md:hidden" // Only show on mobile
    )}>
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          
          // Special handling for Add button
          if (item.isAdd) {
            return (
              <button
                key={item.to}
                onClick={onAddContent}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "-mt-6" // Lift the add button up
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center",
                    "bg-gradient-to-r from-purple-500 to-pink-500",
                    "shadow-lg shadow-purple-500/30",
                    "text-white"
                  )}
                >
                  <PlusIcon className="w-7 h-7" />
                </motion.div>
              </button>
            );
          }

          const Icon = isActive ? item.IconActive : item.Icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px]"
            >
              {({ isActive: navIsActive }) => (
                <>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 transition-colors duration-200",
                        navIsActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    {/* Badge for Activity */}
                    {item.hasBadge && unreadCount > 0 && (
                      <span className={cn(
                        "absolute -top-1 -right-1",
                        "bg-gradient-to-r from-pink-500 to-rose-500",
                        "text-white text-[10px] font-bold rounded-full",
                        "min-w-[16px] h-[16px] flex items-center justify-center px-1",
                        "animate-pulse"
                      )}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </motion.div>
                  
                  <span className={cn(
                    "text-[10px] mt-1 font-medium transition-colors duration-200",
                    navIsActive
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-500 dark:text-gray-400"
                  )}>
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {navIsActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-0 w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
