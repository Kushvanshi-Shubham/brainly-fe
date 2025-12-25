import React from "react";
import { useFollow } from "../../hooks/useFollow";
import { motion } from "framer-motion";

interface FollowButtonProps {
  userId: string;
  username?: string;
  className?: string;
  compact?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  userId,
  className = "",
  compact = false
}) => {
  const { isFollowing, loading, toggleFollow } = useFollow(userId);

  return (
    <motion.button
      onClick={toggleFollow}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`
        relative overflow-hidden
        ${compact ? 'px-3 py-1.5 text-xs' : 'px-6 py-2.5 text-sm'} 
        rounded-full font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isFollowing 
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 border-2 border-gray-300 dark:border-gray-600' 
          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg border-2 border-transparent'
        }
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-1.5">
          <svg className={`animate-spin ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {!compact && <span>Loading...</span>}
        </span>
      ) : isFollowing ? (
        <span className="flex items-center justify-center gap-1.5 group-hover:hidden">
          <svg className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>{compact ? '' : 'Following'}</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-1.5">
          <svg className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          {!compact && <span>Follow</span>}
        </span>
      )}
    </motion.button>
  );
};
