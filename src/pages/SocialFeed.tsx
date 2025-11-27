import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { Spinner } from "../components/ui/Spinner";
import { Avatar } from "../components/ui/Avatar";
import { ShareIcon, CalendarIcon } from "../Icons/IconsImport";
import type { Content } from "../types";
import { getTypeColor, getTypeEmoji } from "../utlis/helpers";

const SocialFeed = () => {
  const [feed, setFeed] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch user's recent content
      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10 }
      });

      const newItems = response.data.content || [];
      
      if (page === 1) {
        setFeed(newItems);
      } else {
        setFeed(prev => [...prev, ...newItems]);
      }
      
      setHasMore(newItems.length === 10);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover what you've saved recently
          </p>
        </div>

        {/* Feed */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : null}
        
        {!loading && feed.length === 0 ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-lg"
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Your feed is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start saving content to see it appear here
              </p>
            </motion.div>
          </div>
        ) : null}
        
        {feed.length > 0 ? (
          <div className="space-y-4">
            {feed.map((item, index) => (
              <motion.article
                key={`${item._id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        profilePic={item.userId?.profilePic}
                        username={item.userId?.username || 'User'}
                        size="md"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          You saved this
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
                      {getTypeEmoji(item.type)} {item.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {item.title}
                  </h2>
                  
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-3 break-all"
                  >
                    <ShareIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{item.link}</span>
                  </a>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag._id}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <button className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      💬 Comment
                    </button>
                    <button className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      🔖 Save
                    </button>
                    <button className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      📤 Share
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {!hasMore && feed.length > 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                You've reached the end! 🎉
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SocialFeed;
