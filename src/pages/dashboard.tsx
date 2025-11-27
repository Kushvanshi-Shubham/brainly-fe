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
  const { contents, loading, error, refresh } = useContent();

  // Debounce search input to avoid excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter and sort content
  const filteredContents = useMemo(() => {
    let filtered = contents;

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((c) => c.type === typeFilter);
    }

    // Favorites filter
    if (showFavorites) {
      filtered = filtered.filter((c) => c.isFavorite);
    }

    // Archived filter
    if (showArchived) {
      filtered = filtered.filter((c) => c.isArchived);
    } else {
      // By default, hide archived items
      filtered = filtered.filter((c) => !c.isArchived);
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [contents, debouncedSearch, typeFilter, sortBy, showFavorites, showArchived]);

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
            placeholder="Search your content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

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
