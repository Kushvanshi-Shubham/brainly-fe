import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { SEOHead } from "../components/SEOHead";
import { ArrowDownTrayIcon, DocumentTextIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

export default function ExportData() {
  const [exporting, setExporting] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  async function handleExport(format: "json" | "html") {
    setExporting(format);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/v1/export/bookmarks${format === "html" ? "?format=html" : ""}`,
        { headers, responseType: "blob" }
      );

      const ext = format === "html" ? "html" : "json";
      const blob = new Blob([res.data], { type: format === "html" ? "text/html" : "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `braintox-export.${ext}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}!`);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SEOHead title="Export Data" path="/export" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          <ArrowDownTrayIcon className="w-8 h-8 inline-block mr-2 text-purple-500" />
          Export <span className="gradient-text">Data</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Download all your bookmarks. Your data belongs to you.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* JSON Export */}
          <button
            onClick={() => handleExport("json")}
            disabled={exporting !== null}
            className="group p-6 text-left rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
          >
            <CodeBracketIcon className="w-10 h-10 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Export as JSON</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Machine-readable format. Great for backups, migrations, or using with the API.
            </p>
            {exporting === "json" && (
              <div className="mt-3 w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            )}
          </button>

          {/* HTML Export */}
          <button
            onClick={() => handleExport("html")}
            disabled={exporting !== null}
            className="group p-6 text-left rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700 transition-all"
          >
            <DocumentTextIcon className="w-10 h-10 text-pink-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Export as HTML</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chrome/Firefox bookmark format. Import directly into any browser.
            </p>
            {exporting === "html" && (
              <div className="mt-3 w-5 h-5 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
