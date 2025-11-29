import { Link, useNavigate } from "react-router-dom";
import { Logo, PlusIcon, SearchIcon } from "../Icons/IconsImport";
import { ThemeToggle } from "./ui/ThemeToggle";
import { UserMenu } from "./ui/UserMenu";
import { useTheme } from "../hooks/useThemes";
import { Button } from "./ui/button.tsx";
import { useState } from "react";

interface NavbarProps {
  onAddContent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddContent }) => {
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

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-white/80 px-4 shadow-sm backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
      
      <div className="flex items-center gap-6">
        <Link to="/feed" className="flex items-center gap-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
          <Logo className="h-6 w-6" />
          <span className="hidden sm:inline-block">Brainly</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4">
          <Link 
            to="/feed" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Feed
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/explore" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Explore
          </Link>
        </nav>
      </div>

      {/* Search Bar */}
      {showSearch ? (
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🌐 Search all content globally..."
            autoFocus
            onBlur={() => !searchQuery && setShowSearch(false)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </form>
      ) : null}
     
      <div className="flex items-center gap-4">
        {!showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="Global Search - Search all content"
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
          className="hidden sm:inline-flex" 
        />
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        <UserMenu />
      </div>
    </header>
  );
};
