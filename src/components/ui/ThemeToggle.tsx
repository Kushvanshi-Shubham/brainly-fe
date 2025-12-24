import React from "react";
import { SunIcon, MoonIcon } from "../../Icons/IconsImport"; 
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utlis/cn";

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2.5 rounded-xl",
        "bg-gray-100 dark:bg-gray-800",
        "hover:bg-purple-100 dark:hover:bg-purple-900/30",
        "border border-gray-200/50 dark:border-gray-700/50",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <MoonIcon className="w-5 h-5 text-purple-400" />
          ) : (
            <SunIcon className="w-5 h-5 text-amber-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
