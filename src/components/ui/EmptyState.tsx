import { memo } from "react";
import { Button } from "./button.tsx";
import { motion } from "framer-motion";
import { cn } from "../../utlis/cn";

interface EmptyStateProps {
  onAdd?: () => void;
  title?: string;
  description?: string;
}

const EmptyState = memo(({ onAdd, title = "Your content list is empty", description }: EmptyStateProps) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center w-full py-16 px-6 rounded-2xl",
        "bg-gradient-to-br from-gray-50 to-gray-100/50",
        "dark:from-gray-800/50 dark:to-gray-900/50",
        "border border-gray-200/50 dark:border-gray-700/50"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Animated Icon Container */}
      <motion.div
        className="relative mb-6"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20" />
        <div className={cn(
          "relative w-24 h-24 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-purple-100 to-pink-100",
          "dark:from-purple-900/30 dark:to-pink-900/30",
          "border border-purple-200/50 dark:border-purple-700/50"
        )}>
          <svg
            width="48"
            height="48"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-purple-500 dark:text-purple-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5} 
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </motion.div>

      <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      
      {description && (
        <p className="mb-6 text-center text-gray-500 dark:text-gray-400 max-w-sm">
          {description}
        </p>
      )}
      
      {onAdd && (
        <Button
          variant="primary"
          text="Add Your First Item"
          onClick={onAdd}
          size="lg"
          className="mt-2"
          startIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        />
      )}
    </motion.div>
  );
});

EmptyState.displayName = "EmptyState";

export { EmptyState };
