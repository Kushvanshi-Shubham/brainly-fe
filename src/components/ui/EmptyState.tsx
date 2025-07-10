import { Button } from "./button.tsx";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full py-20 px-4 sm:px-6 md:px-8 text-gray-500 dark:text-gray-400 bg-transparent rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <svg
        width="120"
        height="120"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="text-gray-300 dark:text-gray-600 mb-6 drop-shadow-md"
      >
     
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1} 
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
        />
      </svg>
      <p className="mb-6 text-lg text-center font-medium text-gray-700 dark:text-gray-300">
        Your content list is empty.
      </p>
      <Button
        variant="primary"
        text="Add Your First Item"
        onClick={onAdd}
        size="lg"
      />
    </motion.div>
  );
}
