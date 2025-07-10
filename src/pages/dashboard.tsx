import { useEffect, useState} from "react";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";
import { useTheme } from "../hooks/useThemes";
import { Sidebar } from "../components/ui/Sidebar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/button";
import { PlusIcon } from "../Icons/IconsImport";
import { SearchBar } from "../components/ui/SearchBar";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { EmptyState } from "../components/ui/EmptyState";
import { cn } from "../utlis/cn";
import { CreateContentModal } from "../components/ui/CreateContent";
import { UserMenu } from "../components/ui/UserMenu";
import { ShareLink } from "../components/ui/ShareLink";

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { contents, loading, error, refresh } = useContent();
  const { isDark, toggleTheme } = useTheme();

  // Debounce search input to avoid excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Persist the sidebar's collapsed state in localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed));
  }, [collapsed]);

  // Filter content based on the debounced search term
  const filteredContents = contents.filter((c: any) =>
    c.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <motion.div
        className={cn(
          "transition-all duration-300 p-6 min-h-screen w-full",
          "bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white",
          collapsed ? "ml-20" : "ml-64" // Adjusted margin to match sidebar width
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          refreshContent={refresh}
        />

        
        <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex gap-2 items-center">
            <UserMenu />
            <Button
              variant="primary"
              startIcon={<PlusIcon className="w-5 h-5" />}
              size="md"
              text="Add Content"
              onClick={() => setModalOpen(true)}
            />
            <ShareLink />
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          </div>
        </div>

        
        {loading ? (
          <div className="text-center mt-20 text-gray-500 dark:text-gray-400">
            Loading content...
          </div>
        ) : error ? (
          <div className="text-center mt-20 text-red-500 dark:text-red-400">
            Error: {error}
          </div>
        ) : contents.length === 0 ? (
          <EmptyState onAdd={() => setModalOpen(true)} />
        ) : filteredContents.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              No content matches your search.
            </p>
            <p className="mt-2 text-sm">Try a different keyword!</p>
          </div>
        ) : (
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
