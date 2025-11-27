import { useState, useEffect } from "react";
import { getAvatarUrl } from "../../utlis/helpers";

interface AvatarProps {
  profilePic?: string | null;
  username: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showOnlineIndicator?: boolean;
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
  "2xl": "w-32 h-32",
};

export const Avatar = ({
  profilePic,
  username,
  size = "md",
  className = "",
  showOnlineIndicator = false,
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  
  // Reset error state when profilePic changes
  useEffect(() => {
    setImgError(false);
  }, [profilePic]);
  
  // Get the appropriate image source
  const getImageSrc = () => {
    // If there was an error loading the profile pic, or no profile pic, use generated avatar
    if (imgError || !profilePic || profilePic.trim() === '') {
      return getAvatarUrl(username);
    }
    return profilePic;
  };

  const handleError = () => {
    setImgError(true);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={getImageSrc()}
        alt={`${username}'s avatar`}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-purple-400 dark:border-purple-600`}
        onError={handleError}
      />
      {showOnlineIndicator && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
      )}
    </div>
  );
};
