import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { SEOHead } from "../components/SEOHead";
import {
  ChartBarIcon,
  TagIcon,
  FolderIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

interface OverviewData {
  totalLinks: number;
  totalCollections: number;
  totalTags: number;
  typeBreakdown: { _id: string; count: number }[];
  topTags: { name: string; count: number }[];
}

interface ActivityData {
  activity: { date: string; count: number }[];
}

export default function Analytics() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${BACKEND_URL}/api/v1/analytics/overview`, { headers }),
      axios.get(`${BACKEND_URL}/api/v1/analytics/activity`, { headers }),
    ])
      .then(([overviewRes, activityRes]) => {
        setOverview(overviewRes.data);
        setActivity(activityRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  const maxActivity = activity ? Math.max(...activity.activity.map((d) => d.count), 1) : 1;
  const totalSaves30d = activity ? activity.activity.reduce((sum, d) => sum + d.count, 0) : 0;

  const statCards = overview
    ? [
        { label: "Total Links", value: overview.totalLinks, icon: LinkIcon, color: "purple" },
        { label: "Collections", value: overview.totalCollections, icon: FolderIcon, color: "pink" },
        { label: "Unique Tags", value: overview.totalTags, icon: TagIcon, color: "blue" },
        { label: "Saves (30d)", value: totalSaves30d, icon: ChartBarIcon, color: "green" },
      ]
    : [];

  const colorMap: Record<string, string> = {
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEOHead title="Analytics" description="Your Braintox usage analytics and activity." path="/analytics" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Your <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Track your knowledge-building activity.</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 -mr-4 -mt-4 rounded-full bg-gradient-to-br ${colorMap[stat.color]} opacity-10`} />
              <stat.icon className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Activity Chart */}
        {activity && (
          <div className="rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">30-Day Activity</h2>
            <div className="flex items-end gap-[3px] h-32">
              {activity.activity.map((day) => {
                const height = day.count > 0 ? Math.max((day.count / maxActivity) * 100, 8) : 4;
                return (
                  <div
                    key={day.date}
                    className="flex-1 group relative"
                    title={`${day.date}: ${day.count} saves`}
                  >
                    <div
                      className={`w-full rounded-t transition-all duration-200 ${
                        day.count > 0
                          ? "bg-gradient-to-t from-purple-600 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-400"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        )}

        {/* Content Type & Top Tags */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Type Breakdown */}
          {overview && overview.typeBreakdown.length > 0 && (
            <div className="rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Content Types</h2>
              <div className="space-y-3">
                {overview.typeBreakdown.map((type) => {
                  const pct = Math.round((type.count / overview.totalLinks) * 100);
                  return (
                    <div key={type._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300 capitalize">{type._id}</span>
                        <span className="text-gray-500">{type.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Tags */}
          {overview && overview.topTags.length > 0 && (
            <div className="rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Tags</h2>
              <div className="flex flex-wrap gap-2">
                {overview.topTags.map((tag) => (
                  <span
                    key={tag.name}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30"
                  >
                    #{tag.name}
                    <span className="ml-1 text-xs text-purple-400">({tag.count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
