import { Link } from "react-router-dom";
import { Logo, PlusIcon } from "../Icons/IconsImport";
import { ThemeToggle } from "./ui/ThemeToggle";
import { UserMenu } from "./ui/UserMenu";
import { useTheme } from "../hooks/useThemes";
import { Button } from "./ui/button.tsx";

interface NavbarProps {
  onAddContent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddContent }) => {
  const { isDark, toggleTheme } = useTheme();

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

     
      <div className="flex items-center gap-4">
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
