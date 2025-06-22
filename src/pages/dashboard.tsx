import { useEffect, useState } from "react";
import "../App.css";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContent";
import { Sidebar } from "../components/ui/Sidebar";
import { useContent } from "../hooks/useContent";
import { motion } from "framer-motion";
import { PlusIcon, ShareIcon } from "../Icons/IconsImport";

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { contents, refresh } = useContent();
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    refresh();
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [modalOpen, isDark]);

  const filteredContents = contents.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />

      <motion.div
        className="p-6 ml-72 min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-1/2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <div className="flex gap-4 items-center">
            <Button
              variant="primary"
              startIcon={<PlusIcon size="lg" />}
              size="md"
              text="Add Content"
              onClick={() => setModalOpen(true)}
            />
            <Button
              variant="secondary"
              startIcon={<ShareIcon size="md" />}
              size="md"
              text="Share"
            />
            <button
              onClick={() => setIsDark(!isDark)}
              className="ml-4 text-sm px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded"
            >
              {isDark ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {filteredContents.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No content matches your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredContents.map(({ type, title, link }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card type={type} title={title} link={link} refresh={refresh} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;
