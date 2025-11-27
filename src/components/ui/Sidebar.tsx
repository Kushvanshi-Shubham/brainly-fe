import { Link } from "react-router-dom";
import { memo } from "react";
import { Logo, UserIcon, ArchiveIcon, SearchIcon } from "../../Icons/IconsImport";
import { cn } from "../../utlis/cn";
import { SideToggle } from "../../Icons/IconsDesign/SiderbarToggle";
import { SidebarItem } from "./SiderbarItem";

interface SidebarProps {
  readonly collapsed: boolean;
  readonly setCollapsed: (collapsed: boolean) => void;
}

const SidebarComponent = ({ collapsed, setCollapsed }: SidebarProps) => {
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
          icon={<span className="text-xl">🏠</span>}
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
