import { useEffect, useState} from "react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";


function Dashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { contents, loading, error, refresh } = useContent();

  // Debounce search input to avoid excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter content based on the debounced search term
  const filteredContents = contents.filter((c) =>
    c.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

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

        {/* Content Display */}
        {loading && (
          <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
            Loading content...
          </div>
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredContents.map((content) => (
              <Card
                key={content._id}
                contentId={content._id}
                type={content.type}
                title={content.title}
                link={content.link}
                refresh={refresh}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;
