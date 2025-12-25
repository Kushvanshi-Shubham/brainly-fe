import { Link, useNavigate, NavLink } from "react-router-dom";
import { Logo, PlusIcon, SearchIcon } from "../Icons/IconsImport";
import { ThemeToggle } from "./ui/ThemeToggle";
import { UserMenu } from "./ui/UserMenu";
import { useTheme } from "../hooks/useThemes";
import { Button } from "./ui/button.tsx";
import { useState, memo } from "react";
import { cn } from "../utlis/cn";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavbarProps {
  onAddContent: () => void;
}

const NavbarComponent: React.FC<NavbarProps> = ({ onAddContent }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative text-sm font-medium transition-all duration-200",
      "text-gray-600 dark:text-gray-400",
      "hover:text-purple-600 dark:hover:text-purple-400",
      isActive && "text-purple-600 dark:text-purple-400",
      isActive && "after:absolute after:bottom-[-8px] after:left-0 after:right-0",
      isActive && "after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500",
      isActive && "after:rounded-full"
    );

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
      isActive
        ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    );

  return (
    <>
      <header className={cn(
        "sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between gap-2 md:gap-4 px-3 md:px-4",
        "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl",
        "border-b border-gray-200/50 dark:border-gray-700/50",
        "shadow-sm shadow-gray-200/20 dark:shadow-black/10"
      )}>
        
        <div className="flex items-center gap-3 md:gap-6">
          <Link to="/feed" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <Logo className="relative h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="hidden sm:inline-block text-lg font-bold gradient-text">
              Braintox
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/feed" className={navLinkClass}>
              Feed
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              Explore
            </NavLink>
          </nav>
        </div>

        {/* Search Bar - Desktop */}
        {showSearch ? (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all content..."
                autoFocus
                onBlur={() => !searchQuery && setShowSearch(false)}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl",
                  "bg-gray-100/80 dark:bg-gray-800/80",
                  "border border-gray-200 dark:border-gray-700",
                  "text-gray-900 dark:text-white placeholder-gray-400",
                  "focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500",
                  "outline-none transition-all duration-200"
                )}
              />
            </div>
          </form>
        ) : null}
       
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Search Button */}
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className={cn(
                "p-2 md:p-2.5 rounded-xl transition-all duration-200",
                "text-gray-500 dark:text-gray-400",
                "hover:bg-purple-100 dark:hover:bg-purple-900/30",
                "hover:text-purple-600 dark:hover:text-purple-400"
              )}
              title="Global Search"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          )}
          
          {/* Add Button - Desktop only */}
          <Button
            variant="primary"
            size="sm"
            startIcon={<PlusIcon className="h-4 w-4" />}
            text="Add"
            onClick={onAddContent}
            className="hidden md:inline-flex btn-gradient" 
          />
          
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          <UserMenu />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-xl transition-all duration-200",
              "text-gray-500 dark:text-gray-400",
              "hover:bg-purple-100 dark:hover:bg-purple-900/30"
            )}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden fixed inset-x-0 top-14 z-20",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
          "border-b border-gray-200/50 dark:border-gray-700/50",
          "shadow-lg animate-in slide-in-from-top-2 duration-200"
        )}>
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="p-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl",
                  "bg-gray-100/80 dark:bg-gray-800/80",
                  "border border-gray-200 dark:border-gray-700",
                  "text-gray-900 dark:text-white placeholder-gray-400",
                  "focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500",
                  "outline-none text-sm"
                )}
              />
            </div>
          </form>
          
          {/* Mobile Nav Links */}
          <nav className="px-3 pb-3 space-y-1">
            <NavLink 
              to="/feed" 
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Feed
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/explore" 
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </NavLink>
            <NavLink 
              to="/collections" 
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </NavLink>
            <NavLink 
              to="/discover" 
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Discover People
            </NavLink>
            <NavLink 
              to="/profile" 
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </NavLink>
          </nav>
        </div>
      )}
    </>
  );
};

export const Navbar = memo(NavbarComponent);
Navbar.displayName = "Navbar";
