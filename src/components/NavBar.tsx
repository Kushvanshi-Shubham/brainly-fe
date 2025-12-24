import { Link, useNavigate, NavLink } from "react-router-dom";
import { Logo, PlusIcon, SearchIcon } from "../Icons/IconsImport";
import { ThemeToggle } from "./ui/ThemeToggle";
import { UserMenu } from "./ui/UserMenu";
import { useTheme } from "../hooks/useThemes";
import { Button } from "./ui/button.tsx";
import { useState, memo } from "react";
import { cn } from "../utlis/cn";

interface NavbarProps {
  onAddContent: () => void;
}

const NavbarComponent: React.FC<NavbarProps> = ({ onAddContent }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <header className={cn(
      "sticky top-0 z-10 flex h-16 items-center justify-between gap-4 px-4",
      "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl",
      "border-b border-gray-200/50 dark:border-gray-700/50",
      "shadow-sm shadow-gray-200/20 dark:shadow-black/10"
    )}>
      
      <div className="flex items-center gap-6">
        <Link to="/feed" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <Logo className="relative h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="hidden sm:inline-block text-lg font-bold gradient-text">
            Brainly
          </span>
        </Link>
        
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

      {/* Search Bar */}
      {showSearch ? (
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
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
     
      <div className="flex items-center gap-3">
        {!showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200",
              "text-gray-500 dark:text-gray-400",
              "hover:bg-purple-100 dark:hover:bg-purple-900/30",
              "hover:text-purple-600 dark:hover:text-purple-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            )}
            title="Global Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        )}
        <Button
          variant="primary"
          size="sm"
          startIcon={<PlusIcon className="h-4 w-4" />}
          text="Add Content"
          onClick={onAddContent}
          className="hidden sm:inline-flex btn-gradient" 
        />
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        <UserMenu />
      </div>
    </header>
  );
};

export const Navbar = memo(NavbarComponent);
Navbar.displayName = "Navbar";
