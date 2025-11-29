import { useEffect, useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { Spinner } from "../components/ui/Spinner";
import { Avatar } from "../components/ui/Avatar";
import { CalendarIcon, FeedIcon } from "../Icons/IconsImport";
import { EmbedPreview } from "../components/ui/EmbedPreview";
import { getPlatformMeta, type ContentType } from "../utlis/contentTypeDetection";
import type { Content } from "../types";
import { useNavigate } from "react-router-dom";
import { FollowButton } from "../components/ui/FollowButton";

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
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-6">👥</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No Social Feed Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Follow people to see their content in your social feed
            </p>
            <button
              onClick={() => navigate("/discover")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Discover People
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (feed.length === 0 && stats.followingCount > 0) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Feed is Empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The people you follow haven't saved any content yet
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <FeedIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />{" "}
            Social Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Content from {stats.followingCount} people you follow
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold">{stats.totalItems}</div>
              <div className="text-sm opacity-90">Total Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.followingCount}</div>
              <div className="text-sm opacity-90">Following</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-3xl font-bold">{trending.length}</div>
              <div className="text-sm opacity-90">Trending This Week</div>
            </div>
          </div>
        </motion.div>

        {/* Trending Section */}
        {trending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🔥 Trending This Week
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Recent saves from your network</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📌 Popular Tags
            </h2>
            <div className="flex flex-wrap gap-3">
              {popularTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => navigate(`/explore?tag=${encodeURIComponent(tag._id)}`)}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                  title={`Explore content tagged with ${tag._id}`}
                >
                  #{tag._id} ({tag.count})
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📚 All Content
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Latest saves from your network</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800"
    >
      {/* User Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/user/${item.userDetails?._id}`)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar 
              profilePic={item.userDetails?.profilePic}
              username={item.userDetails?.username || "User"} 
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                @{item.userDetails?.username || "unknown"}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{createdDate}</span>
              </div>
            </div>
          </button>
          <FollowButton 
            userId={item.userDetails?._id || ""} 
            username={item.userDetails?.username || ""}
          />
        </div>
      </div>

      {/* Embed Preview */}
      <div className="w-full">
        <EmbedPreview url={item.link} type={item.type as ContentType} title={item.title} />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Platform Badge */}
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md"
            style={{ backgroundColor: platformMeta.color }}
          >
            <span>{platformMeta.icon}</span>
            <span>{item.type}</span>
          </span>
        </div>

        {/* Title */}
        {item.title && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {item.title}
          </h2>
        )}

        {/* Link */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm line-clamp-1 mb-3 block"
        >
          {item.link}
        </a>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag) => {
              const tagName = typeof tag === 'string' ? tag : tag.name;
              const tagId = typeof tag === 'object' && tag._id ? tag._id : tagName;
              return (
                <button
                  key={tagId}
                  onClick={() => navigate(`/explore?tag=${encodeURIComponent(tagName)}`)}
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                  title={`Explore content tagged with ${tagName}`}
                >
                  #{tagName}
                </button>
              );
            })}
            {item.tags.length > 3 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* View Link Button */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          View Content
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
});

SocialFeedCard.displayName = "SocialFeedCard";

export default SocialFeed;
