import { useEffect, useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { Spinner } from "../components/ui/Spinner";
import { Avatar } from "../components/ui/Avatar";
import { CalendarIcon } from "../Icons/IconsImport";
import { EmbedPreview } from "../components/ui/EmbedPreview";
import { getPlatformMeta, type ContentType } from "../utlis/contentTypeDetection";
import type { Content } from "../types";
import { useNavigate } from "react-router-dom";
import { FollowButton } from "../components/ui/FollowButton";
import { UserGroupIcon, InboxIcon, FireIcon, HashtagIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { cn } from "../utlis/cn";

interface SocialFeedContent extends Content {
  userDetails?: {
    _id: string;
    username: string;
    email: string;
    profilePic?: string;
  };
}

const SocialFeed = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState<SocialFeedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState<SocialFeedContent[]>([]);
  const [popularTags, setPopularTags] = useState<{ _id: string; count: number }[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    followingCount: 0,
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });

  const fetchFeed = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const headers = { Authorization: `Bearer ${token}` };
      
      // Use timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const [feedRes, trendingRes, tagsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/v1/social/feed`, { headers, signal: controller.signal }),
        axios.get(`${BACKEND_URL}/api/v1/social/trending`, { headers, signal: controller.signal }),
        axios.get(`${BACKEND_URL}/api/v1/social/tags`, { headers, signal: controller.signal })
      ]);
      
      clearTimeout(timeoutId);

      setFeed(feedRes.data.content || []);
      setStats(feedRes.data.stats || {});
      setTrending(trendingRes.data.content || []);
      setPopularTags(tagsRes.data.tags || []);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
        return;
      }
      console.error("Failed to fetch social feed:", error);
      toast.error("Failed to load social feed");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    
    const handleFocus = () => fetchFeed(true);
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchFeed]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-600 dark:text-purple-400">
          <Spinner />
        </div>
      </div>
    );
  }

  if (stats.followingCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className={cn(
            "w-20 h-20 mx-auto mb-6 rounded-full",
            "bg-gradient-to-br from-purple-100 to-pink-100",
            "dark:from-purple-900/30 dark:to-pink-900/30",
            "flex items-center justify-center"
          )}>
            <UserGroupIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-3">
            No Social Feed Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Follow people to see their content in your social feed
          </p>
          <button
            onClick={() => navigate("/discover")}
            className={cn(
              "px-6 py-3 rounded-xl font-semibold",
              "bg-gradient-to-r from-purple-600 to-pink-600",
              "hover:from-purple-700 hover:to-pink-700",
              "text-white transition-all duration-200",
              "shadow-lg hover:shadow-xl active:scale-95"
            )}
          >
            Discover People
          </button>
        </motion.div>
      </div>
    );
  }

  if (feed.length === 0 && stats.followingCount > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className={cn(
            "w-20 h-20 mx-auto mb-6 rounded-full",
            "bg-gradient-to-br from-purple-100 to-pink-100",
            "dark:from-purple-900/30 dark:to-pink-900/30",
            "flex items-center justify-center"
          )}>
            <InboxIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-3">
            Feed is Empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The people you follow haven't saved any content yet
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-1 sm:mb-2">
            Social Feed
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Content from {stats.followingCount} {stats.followingCount === 1 ? 'person' : 'people'} you follow
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className={cn(
            "glass border border-purple-200/50 dark:border-purple-800/30",
            "rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl"
          )}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{stats.totalItems}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{stats.followingCount}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Following</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">{trending.length}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">Trending</div>
            </div>
          </div>
        </motion.div>

        {/* Trending Section */}
        {trending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1 sm:mb-2">
                <FireIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                Trending This Week
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Recent saves from your network</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trending.map((item, idx) => (
                <SocialFeedCard key={item._id} item={item} index={idx} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="glass border border-purple-200/50 dark:border-purple-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
          >
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3 sm:mb-4">
              <HashtagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              Popular Tags
            </h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => navigate(`/explore?tag=${encodeURIComponent(tag._id)}`)}
                  className={cn(
                    "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium",
                    "bg-purple-100 dark:bg-purple-900/30",
                    "text-purple-700 dark:text-purple-300",
                    "hover:bg-purple-200 dark:hover:bg-purple-900/50",
                    "transition-all duration-200 active:scale-95"
                  )}
                  title={`Explore content tagged with ${tag._id}`}
                >
                  #{tag._id} <span className="opacity-60">({tag.count})</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1 sm:mb-2">
              <RectangleStackIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              All Content
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Latest saves from your network</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {feed.map((item, idx) => (
              <SocialFeedCard key={item._id} item={item} index={idx} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Social Feed Card component
const SocialFeedCard = memo(({ item, index }: { item: SocialFeedContent; index: number }) => {
  const navigate = useNavigate();
  const platformMeta = getPlatformMeta(item.type as ContentType);
  const createdDate = new Date(item.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={cn(
        "glass border border-purple-200/50 dark:border-purple-800/30",
        "rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl",
        "transition-all duration-300 overflow-hidden",
        "hover:scale-[1.01] sm:hover:scale-[1.02]"
      )}
    >
      {/* User Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => navigate(`/user/${item.userDetails?._id}`)}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0 flex-1"
          >
            <Avatar 
              profilePic={item.userDetails?.profilePic}
              username={item.userDetails?.username || "User"} 
              className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                @{item.userDetails?.username || "unknown"}
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span className="truncate">{createdDate}</span>
              </div>
            </div>
          </button>
          <FollowButton 
            userId={item.userDetails?._id || ""} 
            username={item.userDetails?.username || ""}
            compact
          />
        </div>
      </div>

      {/* Embed Preview */}
      <div className="w-full">
        <EmbedPreview url={item.link} type={item.type as ContentType} title={item.title} />
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
        {/* Title and Platform Badge */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-start justify-between gap-2">
            {item.title && (
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                {item.title}
              </h2>
            )}
            <span
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold text-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: platformMeta.color }}
            >
              <span className="hidden sm:inline">{platformMeta.icon}</span>
              <span>{item.type}</span>
            </span>
          </div>
          
          {/* Link - Only show domain */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-1 block"
          >
            {new URL(item.link).hostname.replace('www.', '')}
          </a>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {item.tags.slice(0, 3).map((tag) => {
              const tagName = typeof tag === 'string' ? tag : tag.name;
              const tagId = typeof tag === 'object' && tag._id ? tag._id : tagName;
              return (
                <button
                  key={tagId}
                  onClick={() => navigate(`/explore?tag=${encodeURIComponent(tagName)}`)}
                  className={cn(
                    "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium",
                    "bg-purple-100 dark:bg-purple-900/30",
                    "text-purple-700 dark:text-purple-300",
                    "hover:bg-purple-200 dark:hover:bg-purple-900/50",
                    "transition-colors active:scale-95"
                  )}
                  title={`Explore content tagged with ${tagName}`}
                >
                  #{tagName}
                </button>
              );
            })}
            {item.tags.length > 3 && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View Link Button */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "w-full inline-flex items-center justify-center gap-2",
            "px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm",
            "bg-gradient-to-r from-purple-600 to-pink-600",
            "hover:from-purple-700 hover:to-pink-700",
            "text-white transition-all duration-200",
            "shadow-md hover:shadow-lg active:scale-95"
          )}
        >
          View Content
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
});

SocialFeedCard.displayName = "SocialFeedCard";

export default SocialFeed;
