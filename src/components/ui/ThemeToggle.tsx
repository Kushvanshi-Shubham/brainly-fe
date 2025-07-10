import React from "react";
import { SunIcon, MoonIcon } from "../../Icons/IconsImport"; 
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleTheme }) => {
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="relative w-28 justify-start overflow-hidden" 
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {isDark ? (
            <>
              <MoonIcon className="w-4 h-4" />
              <span>Dark</span>
            </>
          ) : (
            <>
              <SunIcon className="w-4 h-4" />
              <span>Light</span>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};
