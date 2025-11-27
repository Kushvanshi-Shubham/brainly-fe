/**
 * Format a date string to a localized date
 */
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options || defaultOptions);
};

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

/**
 * Truncate text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from a username for avatar fallback
 */
export const getInitials = (username: string): string => {
  return username.substring(0, 2).toUpperCase();
};

/**
 * Generate avatar URL using DiceBear API
 */
export const getAvatarUrl = (username: string): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=a855f7,8b5cf6,ec4899&backgroundType=gradientLinear&radius=50`;
};

/**
 * Get profile picture URL with fallback to generated avatar
 */
export const getProfilePicture = (profilePic: string | null | undefined, username: string): string => {
  // If profile pic exists and is not empty, use it
  if (profilePic && profilePic.trim() !== '') {
    return profilePic;
  }
  // Otherwise, generate avatar from username
  return getAvatarUrl(username);
};
