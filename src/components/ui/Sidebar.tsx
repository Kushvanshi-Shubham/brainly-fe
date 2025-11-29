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
        "bg-white dark:bg-gray-900 fixed top-0 left-0 h-screen border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20",
        collapsed ? "w-20 px-2" : "w-64 px-4",
        "flex flex-col"
      )}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between py-4 mb-8 h-16">
        <Link to="/feed" className="flex items-center gap-2 text-2xl font-semibold text-purple-600 dark:text-purple-400">
          <Logo className="w-8 h-8 flex-shrink-0" />
          {!collapsed && <span className="whitespace-nowrap transition-opacity duration-300">Brainly</span>}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 dark:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-md p-1"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <SideToggle className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow space-y-2 text-gray-700 dark:text-gray-300 text-base">
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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

      {/* Footer / Profile Section */}
      <div className="py-4 mt-auto">
        
        {!collapsed && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Brainly
          </div>
        )}
      </div>
    </div>
  );
}

const MemoizedSidebar = memo(SidebarComponent);
MemoizedSidebar.displayName = "Sidebar";

export { MemoizedSidebar as Sidebar };
