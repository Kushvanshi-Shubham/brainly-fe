import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { Spinner } from "../components/ui/Spinner";
import { SearchIcon, CalendarIcon, ShareIcon } from "../Icons/IconsImport";
import type { Content, DiscoveryData, SearchFilters } from "../types";
import { getTypeColor, getTypeEmoji } from "../utlis/helpers";

const Explore = () => {
  const [activeTab, setActiveTab] = useState<"discover" | "search">("discover");
  
  // Discovery state
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ types: [], tags: [] });
  const [selectedType, setSelectedType] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch Discovery Data
  useEffect(() => {
    if (activeTab === "discover") {
      fetchDiscoveryData();
    }
  }, [activeTab]);

  // Fetch Search Filters
  useEffect(() => {
    if (activeTab === "search") {
      fetchSearchFilters();
    }
  }, [activeTab]);

  // Debounced Search
  useEffect(() => {
    if (activeTab === "search") {
      const timer = setTimeout(() => {
        void performSearch();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedType, selectedTags, startDate, endDate, currentPage, activeTab]);

  const fetchDiscoveryData = async () => {
    try {
      setDiscoveryLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/api/v1/discovery/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscoveryData(response.data);
    } catch (error) {
      console.error("Failed to fetch discovery data:", error);
      toast.error("Failed to load discovery feed");
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const fetchSearchFilters = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/api/v1/search/filters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilters(response.data);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  const performSearch = async () => {
    try {
      setSearchLoading(true);
      const token = localStorage.getItem("token");
      
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: 12,
      };
      
      if (searchQuery) params.query = searchQuery;
      if (selectedType) params.type = selectedType;
      if (selectedTags.length > 0) params.tags = selectedTags.join(",");
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(`${BACKEND_URL}/api/v1/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setSearchResults(response.data.results || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
    setCurrentPage(1);
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">{" "}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Explore
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover insights and search your content
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === "discover"
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            🔥 Discover
            {activeTab === "discover" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === "search"
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            🔎 Search
            {activeTab === "search" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "discover" ? (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {discoveryLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Spinner />
                </div>
              ) : discoveryData ? (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        📊 Activity Overview
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">This Week</span>
                          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {discoveryData.weeklyContent}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">This Month</span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {discoveryData.monthlyContent}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        🎲 Rediscover
                      </h3>
                      {discoveryData.randomItem ? (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {discoveryData.randomItem.title}
                          </h4>
                          <a
                            href={discoveryData.randomItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline line-clamp-1"
                          >
                            {discoveryData.randomItem.link}
                          </a>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(discoveryData.randomItem.type)}`}>
                            {getTypeEmoji(discoveryData.randomItem.type)} {discoveryData.randomItem.type}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No content to rediscover yet</p>
                      )}
                    </motion.div>
                  </div>

                  {/* Type Breakdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Content by Type
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {discoveryData.typeBreakdown.map((item) => (
                        <div
                          key={item._id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
                        >
                          <div className="text-3xl mb-2">{getTypeEmoji(item._id)}</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {item.count}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {item._id}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tag Cloud */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      🏷️ Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {discoveryData.tagStats.map((tag) => (
                        <span
                          key={tag._id}
                          className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium"
                        >
                          #{tag.name} ({tag.count})
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* On This Day */}
                  {discoveryData.onThisDay.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        📅 On This Day
                      </h3>
                      <div className="space-y-3">
                        {discoveryData.onThisDay.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="text-2xl">{getTypeEmoji(item.type)}</div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                {item.title}
                              </h4>
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline line-clamp-1"
                              >
                                {item.link}
                              </a>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(item.createdAt).getFullYear()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg mb-6">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search your content..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      showFilters
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Filters {showFilters ? "▲" : "▼"}
                  </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                  >
                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Types</option>
                        {filters.types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {filters.tags.map((tag) => (
                          <button
                            key={tag._id}
                            onClick={() => toggleTag(tag._id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedTags.includes(tag._id)
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            #{tag.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Search Results */}
              {searchLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Spinner />
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {searchResults.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
                              {getTypeEmoji(item.type)} {item.type}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mb-3 line-clamp-1"
                          >
                            <ShareIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{item.link}</span>
                          </a>
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag._id}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs"
                                >
                                  #{tag.name}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                  +{item.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Explore;
