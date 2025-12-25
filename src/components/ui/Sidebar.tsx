import { Link } from "react-router-dom";
import { memo } from "react";
import { Logo, UserIcon, ArchiveIcon, SearchIcon, FeedIcon, DiscoverIcon, BellIcon } from "../../Icons/IconsImport";
import { cn } from "../../utlis/cn";
import { SideToggle } from "../../Icons/IconsDesign/SiderbarToggle";
import { SidebarItem } from "./SiderbarItem";
import { useNotifications } from "../../hooks/useNotifications";

interface SidebarProps {
  readonly collapsed: boolean;
  readonly setCollapsed: (collapsed: boolean) => void;
}

const SidebarComponent = ({ collapsed, setCollapsed }: SidebarProps) => {
  const { unreadCount } = useNotifications();

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen z-20 transition-all duration-300 ease-out",
        "bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl",
        "border-r border-gray-200/50 dark:border-gray-700/50",
        "shadow-lg shadow-gray-200/20 dark:shadow-black/20",
        collapsed ? "w-20 px-3" : "w-64 px-4",
        "flex flex-col"
      )}
    >
      {/* Header Section with Gradient */}
      <div className="flex items-center justify-between py-5 mb-6 h-16">
        <Link 
          to="/feed" 
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <Logo className="relative w-9 h-9 flex-shrink-0 text-purple-600 dark:text-purple-400" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold gradient-text whitespace-nowrap">
              Braintox
            </span>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "text-gray-500 dark:text-gray-400",
            "hover:bg-purple-100 dark:hover:bg-purple-900/30",
            "hover:text-purple-600 dark:hover:text-purple-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          )}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <SideToggle className={cn("w-5 h-5 transition-transform duration-300", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow space-y-1.5">
        <SidebarItem
          text="Feed"
          icon={<FeedIcon className="w-5 h-5" />}
          to="/feed"
          collapsed={collapsed}
        />
        <SidebarItem
          text="Dashboard"
          icon={<ArchiveIcon className="w-5 h-5" />}
          to="/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          text="Explore"
          icon={<SearchIcon className="w-5 h-5" />}
          to="/explore"
          collapsed={collapsed}
        />
        <SidebarItem
          text="Collections"
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          }
          to="/collections"
          collapsed={collapsed}
        />
        <SidebarItem
          text="Discover"
          icon={<DiscoverIcon className="w-5 h-5" />}
          to="/discover"
          collapsed={collapsed}
        />
        <SidebarItem
          text="Activity"
          icon={
            <div className="relative">
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          }
          to="/activity"
          collapsed={collapsed}
        />
        <SidebarItem
          text="Profile"
          icon={<UserIcon className="w-5 h-5" />}
          to="/profile"
          collapsed={collapsed}
        />
      </nav>

      {/* Footer Section */}
      <div className="py-4 mt-auto">
        {!collapsed && (
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} Braintox
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const MemoizedSidebar = memo(SidebarComponent);
MemoizedSidebar.displayName = "Sidebar";

export { MemoizedSidebar as Sidebar };
