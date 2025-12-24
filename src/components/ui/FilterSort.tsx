import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utlis/cn";

interface FilterSortProps {
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
}

const selectClasses = cn(
  "w-full px-4 py-2.5 rounded-xl text-sm",
  "bg-white/80 dark:bg-gray-800/80",
  "backdrop-blur-sm",
  "border border-gray-200 dark:border-gray-700",
  "text-gray-900 dark:text-white",
  "focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500",
  "hover:border-purple-300 dark:hover:border-purple-600",
  "outline-none transition-all duration-200",
  "cursor-pointer"
);

const FilterSort = memo(({
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  showFavorites,
  setShowFavorites,
  showArchived,
  setShowArchived,
}: FilterSortProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-5 mb-6",
        "bg-white/70 dark:bg-gray-800/70",
        "backdrop-blur-xl",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-sm shadow-gray-200/20 dark:shadow-black/10"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Filter by Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={selectClasses}
          >
            <option value="all">All Types</option>
            <optgroup label="Social Media">
              <option value="youtube">▶️ YouTube</option>
              <option value="twitter">𝕏 Twitter / X</option>
              <option value="instagram">📷 Instagram</option>
              <option value="tiktok">🎵 TikTok</option>
              <option value="linkedin">💼 LinkedIn</option>
              <option value="facebook">👥 Facebook</option>
              <option value="pinterest">📌 Pinterest</option>
              <option value="reddit">🔴 Reddit</option>
            </optgroup>
            <optgroup label="Media & Entertainment">
              <option value="spotify">🎧 Spotify</option>
              <option value="soundcloud">🎵 SoundCloud</option>
              <option value="vimeo">▶️ Vimeo</option>
              <option value="twitch">🎮 Twitch</option>
            </optgroup>
            <optgroup label="Development">
              <option value="github">🐙 GitHub</option>
              <option value="codepen">✏️ CodePen</option>
            </optgroup>
            <optgroup label="Writing">
              <option value="medium">Ⓜ️ Medium</option>
              <option value="article">📄 Article</option>
            </optgroup>
            <optgroup label="Other">
              <option value="video">🎬 Video</option>
              <option value="resource">📚 Resource</option>
              <option value="other">🔗 Other</option>
            </optgroup>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={selectClasses}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div className="md:col-span-2 flex items-end gap-3">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
              showFavorites
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl"
                : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50 border border-gray-200/50 dark:border-gray-600/50"
            )}
          >
            ⭐ {showFavorites ? 'Showing' : 'Show'} Favorites
          </button>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
              showArchived
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl"
                : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50 border border-gray-200/50 dark:border-gray-600/50"
            )}
          >
            📦 {showArchived ? 'Showing' : 'Show'} Archived
          </button>
        </div>
      </div>
    </motion.div>
  );
});

FilterSort.displayName = "FilterSort";

export { FilterSort };
