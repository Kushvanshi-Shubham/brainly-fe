import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { Spinner } from "../components/ui/Spinner";
import { Avatar } from "../components/ui/Avatar";
import { CalendarIcon, StarIcon } from "../Icons/IconsImport";
import { EmbedPreview } from "../components/ui/EmbedPreview";
import { getPlatformMeta, type ContentType } from "../utlis/contentTypeDetection";
import type { Content } from "../types";

const SocialFeed = () => {
  const [feed, setFeed] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch all user's content for the feed (no pagination, we want full analysis)
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeed(response.data.content || []);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
      toast.error("Failed to load feed");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFeed();
    
    // Refresh on window focus (like modern social apps)
    const handleFocus = () => {
      void fetchFeed(true); // Silent refresh when user returns
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchFeed]);

  // Smart analytics for the feed
  const analytics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const today = new Date(now.setHours(0, 0, 0, 0));

    // This week's saves
    const thisWeekSaves = feed.filter(item => {
      const createdAt = new Date(item.createdAt || 0);
      return createdAt >= weekAgo;
    });

    // Today's saves
    const todaySaves = feed.filter(item => {
      const createdAt = new Date(item.createdAt || 0);
      return createdAt >= today;
    });

    // Tag frequency (trending tags)
    const tagFrequency: Record<string, number> = {};
    feed.forEach(item => {
      item.tags?.forEach(tag => {
        const tagName = typeof tag === 'string' ? tag : tag.name;
        tagFrequency[tagName] = (tagFrequency[tagName] || 0) + 1;
      });
    });
    const trendingTags = Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Unread items (not favorited, not archived)
    const unreadItems = feed.filter(item => !item.isFavorite && !item.isArchived);

    // On this day (same date, 1 year ago)
    const onThisDay = feed.filter(item => {
      const createdAt = new Date(item.createdAt || 0);
      return createdAt <= yearAgo && 
             createdAt.getMonth() === now.getMonth() && 
             createdAt.getDate() === now.getDate();
    });

    // Group by day for timeline
    const groupedByDay: Record<string, Content[]> = {};
    feed.forEach(item => {
      const date = new Date(item.createdAt || 0);
      const dateKey = date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined 
      });
      if (!groupedByDay[dateKey]) {
        groupedByDay[dateKey] = [];
      }
      groupedByDay[dateKey].push(item);
    });

    // Random discovery
    const randomItem = feed.length > 0 ? feed[Math.floor(Math.random() * feed.length)] : null;

    return {
      thisWeekSaves,
      todaySaves,
      trendingTags,
      unreadItems,
      onThisDay,
      groupedByDay,
      randomItem,
      totalFavorites: feed.filter(item => item.isFavorite).length,
    };
  }, [feed]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <Spinner />
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <CalendarIcon className="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No content yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start saving content to see personalized insights here!
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const timelineEntries = Object.entries(analytics.groupedByDay)
    .sort(([dateA], [dateB]) => {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 7); // Show last 7 days

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Your Learning Feed
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track progress, discover patterns, stay motivated
          </p>
        </motion.div>

        {/* Week at a Glance - Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">📈 Your Week at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold">{analytics.thisWeekSaves.length}</div>
              <div className="text-sm opacity-90 mt-1">Items saved this week</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold">{analytics.todaySaves.length}</div>
              <div className="text-sm opacity-90 mt-1">Saved today</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold">{analytics.totalFavorites}</div>
              <div className="text-sm opacity-90 mt-1">Total favorites ⭐</div>
            </div>
          </div>

          {/* Trending Tags */}
          {analytics.trendingTags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">🔥 Your Trending Topics</h3>
              <div className="flex flex-wrap gap-3">
                {analytics.trendingTags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    #{tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Unread Items Section */}
        {analytics.unreadItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 Waiting to Read
              </h2>
              <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full font-semibold">
                {analytics.unreadItems.length} items
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have {analytics.unreadItems.length} items waiting. Start reading to mark them as favorites!
            </p>
            <div className="grid grid-cols-1 gap-4">
              {analytics.unreadItems.slice(0, 3).map((item, idx) => (
                <CompactCard key={item._id} item={item} index={idx} />
              ))}
            </div>
          </motion.div>
        )}

        {/* On This Day */}
        {analytics.onThisDay.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-purple-800"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🗓️ On This Day
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              1 year ago, you saved this. Time to revisit?
            </p>
            <FeedCard item={analytics.onThisDay[0]} index={0} />
          </motion.div>
        )}

        {/* Random Discovery */}
        {analytics.randomItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl p-6 shadow-xl border border-green-200 dark:border-green-800"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎲 Random Discovery
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Rediscover something from your library
            </p>
            <FeedCard item={analytics.randomItem} index={0} />
          </motion.div>
        )}

        {/* Recently Saved Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ⏱️ Recently Saved
          </h2>
          {timelineEntries.map(([date, items], idx) => (
            <div key={date} className="space-y-4">
              <div className="sticky top-4 z-10 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full inline-block shadow-md">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {date} • {items.length} items
                </h3>
              </div>
              <div className="space-y-4 ml-4 border-l-4 border-blue-500 dark:border-blue-400 pl-6">
                {items.slice(0, 5).map((item, itemIdx) => (
                  <FeedCard key={item._id} item={item} index={idx * 5 + itemIdx} />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Compact card for unread section
const CompactCard = memo(({ item, index }: { item: Content; index: number }) => {
  const platformMeta = getPlatformMeta(item.type as ContentType);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: platformMeta.color }}
      >
        {platformMeta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
          {item.title || "Untitled"}
        </h3>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
        >
          {item.link}
        </a>
      </div>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
      >
        Read Now
      </a>
    </motion.div>
  );
});

// Memoized feed card component (same as before)
const FeedCard = memo(({ item, index }: { item: Content; index: number }) => {
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
        <div className="flex items-center gap-3">
          <Avatar username={item.userId?.username || "User"} />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              You
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{createdDate}</span>
              {item.isFavorite && (
                <>
                  <span>•</span>
                  <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span>Favorited</span>
                </>
              )}
            </div>
          </div>
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
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3 block truncate"
        >
          {item.link}
        </a>

        {/* Notes */}
        {item.notes && (
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {item.notes}
            </p>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 5).map((tag, idx) => {
              const tagName = typeof tag === 'string' ? tag : tag.name;
              const tagId = typeof tag === 'string' ? idx : tag._id;
              return (
                <span
                  key={tagId || idx}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  #{tagName}
                </span>
              );
            })}
            {item.tags.length > 5 && (
              <span className="px-3 py-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
                +{item.tags.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
});

export default SocialFeed;
