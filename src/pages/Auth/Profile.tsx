import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UserIcon, CalendarIcon, ArchiveIcon, LogOutIcon } from "../../Icons/IconsImport";
import { Button } from "../../components/ui/button";
import { BACKEND_URL } from "../../config";
import { logout } from "../../utlis/logout";
interface ProfileData {
  username: string;
  joinedAt: string;
  contentCount: number;
  profilePic?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const res = await axios.get<ProfileData>(`${BACKEND_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load profile. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 rounded-2xl shadow-xl animate-pulse bg-white dark:bg-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 w-3/4 rounded-md"></div>
          <div className="w-full mt-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div className="w-full mt-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-center">
        <p className="font-semibold mb-3">🚨 Oh no! {error}</p>
        <Button onClick={fetchProfile} variant="primary" text="Retry Loading Profile" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-20 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition-all duration-300 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profile?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.username || 'User'}&backgroundColor=a855f7,8b5cf6,ec4899&backgroundType=gradientLinear&radius=50`}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-purple-400 dark:border-purple-600 transform transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.username || 'User'}&backgroundColor=a855f7,8b5cf6,ec4899&backgroundType=gradientLinear&radius=50`;
            }}
          />
          {/* Optional: Online status indicator */}
          <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </div>

        {/* Username */}
        <h2 className="text-4xl font-extrabold text-center text-purple-700 dark:text-purple-300 flex items-center gap-2">
          <UserIcon /> {profile?.username}
        </h2>

        {/* Profile Details */}
        <div className="w-full mt-4 space-y-4 text-lg">
          <p className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
            <CalendarIcon className="w-6 h-6"/>
            <strong>Joined on:</strong>{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </span>
          </p>
          <p className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
            <ArchiveIcon className="w-6 h-6"/>
            <strong>Contents Added:</strong>{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {profile?.contentCount}
            </span>
          </p>
        </div>

        {/* Logout Button */}
        <div className="w-full mt-8">
          <Button
            onClick={logout}
            variant="ghost"
            text="Logout"
            startIcon={<LogOutIcon />}
            className="w-full py-3 text-lg font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 border border-red-300 dark:border-red-700"
          />
        </div>
      </div>
    </motion.div>
  );
}
