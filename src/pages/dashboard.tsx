import { useEffect, useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { FilterSort } from "../components/ui/FilterSort";
import { ContentGridSkeleton } from "../components/ui/Skeleton";


function Dashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { contents, loading, error, refresh } = useContent();

  // Extract unique tags from all content
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const content of contents) {
      if (content.tags) {
        for (const tag of content.tags) {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          if (tagName) tagSet.add(tagName);
        }
      }
    }
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [contents]);

  // Debounce search input to avoid excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredContents = useMemo(() => {
    const searchLower = debouncedSearch.toLowerCase();
    
    const filtered = contents
      .filter(c => !debouncedSearch || c.title.toLowerCase().includes(searchLower))
      .filter(c => typeFilter === "all" || c.type === typeFilter)
      .filter(c => {
        if (selectedTag === "all") return true;
        return c.tags?.some(tag => {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          return tagName === selectedTag;
        });
      })
      .filter(c => !showFavorites || c.isFavorite)
      .filter(c => showArchived ? c.isArchived : !c.isArchived);

    // Sort
    if (sortBy === "newest") {
      return filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === "oldest") {
      return filtered.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sortBy === "title") {
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    return filtered;
  }, [contents, debouncedSearch, typeFilter, selectedTag, sortBy, showFavorites, showArchived]);

  return (
    <div className="px-6 py-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="📁 Search your saved content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Search through your personal saved content only
          </p>
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              🏷️ Filter by Tag
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All Tags ({contents.length})
              </button>
              {availableTags.map((tag) => {
                const count = contents.filter(c => 
                  c.tags?.some(t => (typeof t === 'string' ? t : t.name) === tag)
                ).length;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                    }`}
                  >
                    #{tag} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter & Sort */}
        <FilterSort
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
        />

        {/* Content Display */}
        {loading && (
          <ContentGridSkeleton count={8} />
        )}
        
        {!loading && error && (
          <div className="text-center mt-20 text-red-500 dark:text-red-400">
            Error: {error}
          </div>
        )}
        
        {!loading && !error && contents.length === 0 && (
          <EmptyState />
        )}
        
        {!loading && !error && contents.length > 0 && filteredContents.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              No content matches your search.
            </p>
            <p className="mt-2 text-sm">Try a different keyword!</p>
          </div>
        )}
        
        {!loading && !error && filteredContents.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
          >
            {filteredContents.map((content) => (
              <Card
                key={content._id}
                content={{ ...content, tags: content.tags || [] }}
                refresh={refresh}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default memo(Dashboard);
