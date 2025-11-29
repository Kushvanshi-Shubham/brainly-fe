import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { UserIcon, CalendarIcon } from "../../Icons/IconsImport";
import { Button } from "../../components/ui/button";
import { BACKEND_URL } from "../../config";
import { Avatar } from "../../components/ui/Avatar";
import { FollowButton } from "../../components/ui/FollowButton";
import type { ContentType } from "../../utlis/contentTypeDetection";

interface UserProfileData {
  userId: string;
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
  joinedAt: string;
  contentCount: number;
  typeBreakdown: { _id: ContentType; count: number }[];
  recentActivity: { title: string; type: ContentType; createdAt: string }[];
  topTags: { name: string; count: number }[];
  totalTags: number;
  followersCount: number;
  followingCount: number;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  }, []);

  const isOwnProfile = currentUserId === userId;

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to view profiles.");
        return;
      }

      const { data } = await axios.get<UserProfileData>(
        `${BACKEND_URL}/api/v1/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOwnProfile) {
      navigate("/profile");
      return;
    }
    fetchUserProfile();
  }, [userId, isOwnProfile, navigate, fetchUserProfile]);

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto mt-8 p-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/3 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/4 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-center">
          <p className="font-semibold mb-3">🚨 {error}</p>
          <Button onClick={fetchUserProfile} variant="primary" text="Retry" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <Avatar
              profilePic={profile.profilePic}
              username={profile.username}
              size="2xl"
              showOnlineIndicator={false}
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                <UserIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                {profile.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.email}</p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
                <CalendarIcon className="w-5 h-5" />
                Member since {new Date(profile.joinedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}
              </p>
              {profile.bio && (
                <p className="text-gray-700 dark:text-gray-300 mt-3 italic">"{profile.bio}"</p>
              )}
            </div>

            {/* Follow Button */}
            <div className="flex flex-col gap-2">
              <FollowButton 
                userId={userId!} 
                username={profile.username}
                className="min-w-[120px]"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Saves</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {profile.contentCount}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Tags</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {profile.totalTags}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/user/${userId}/followers`)}
          >
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Followers</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {profile.followersCount}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/user/${userId}/following`)}
          >
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Following</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {profile.followingCount}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Content Type Breakdown */}
        {profile.typeBreakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content Types</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.typeBreakdown.map((type) => (
                <div key={type._id} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{type._id}</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                    {type.count}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Tags */}
        {profile.topTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Top Tags</h2>
            <div className="flex flex-wrap gap-3">
              {profile.topTags.map((tag) => (
                <span
                  key={tag.name}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                >
                  {tag.name} ({tag.count})
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
