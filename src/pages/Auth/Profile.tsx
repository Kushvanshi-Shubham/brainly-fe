import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { UserIcon, CalendarIcon, ArchiveIcon, LogOutIcon } from "../../Icons/IconsImport";
import { Button } from "../../components/ui/button";
import { BACKEND_URL } from "../../config";
import { logout } from "../../utlis/logout";
import { Avatar } from "../../components/ui/Avatar";
import type { ProfileData } from "../../types";
import { getPlatformMeta, type ContentType } from "../../utlis/contentTypeDetection";
import { useFollowers, useFollowing } from "../../hooks/useFollow";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [bio, setBio] = useState("");

  // Get user ID from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const currentUserId = getUserIdFromToken();
  const { count: followersCount, refetch: refetchFollowers } = useFollowers(currentUserId);
  const { count: followingCount, refetch: refetchFollowing } = useFollowing(currentUserId);

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
      setProfilePicUrl(res.data.profilePic || "");
      setBio(res.data.bio || "");
    } catch (err) {
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
    void fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `${BACKEND_URL}/api/v1/profile`,
        { profilePic: profilePicUrl, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated successfully!");
      setEditMode(false);
      void fetchProfile();
      
      // Emit event to update profile picture everywhere
      globalThis.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-white dark:bg-gray-800 rounded-lg"></div>
              <div className="h-32 bg-white dark:bg-gray-800 rounded-lg"></div>
              <div className="h-32 bg-white dark:bg-gray-800 rounded-lg"></div>
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
          <p className="font-semibold mb-3">🚨 Oh no! {error}</p>
          <Button onClick={fetchProfile} variant="primary" text="Retry Loading Profile" />
        </div>
      </div>
    );
  }

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
              profilePic={profile?.profilePic}
              username={profile?.username || 'User'}
              size="2xl"
              showOnlineIndicator={true}
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                <UserIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                {profile?.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{profile?.email}</p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
                <CalendarIcon className="w-5 h-5" />
                Member since {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long' }) : 'N/A'}
              </p>
              {!editMode && profile?.bio && (
                <p className="text-gray-700 dark:text-gray-300 mt-3 italic">"{profile.bio}"</p>
              )}
            </div>

            {/* Edit/Logout Buttons */}
            <div className="flex flex-col gap-2">
              {!editMode ? (
                <>
                  <Button
                    onClick={() => setEditMode(true)}
                    variant="primary"
                    text="Edit Profile"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  />
                  <Button
                    onClick={logout}
                    variant="ghost"
                    text="Logout"
                    startIcon={<LogOutIcon />}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 border border-red-300 dark:border-red-700"
                  />
                </>
              ) : (
                <>
                  <Button
                    onClick={handleUpdateProfile}
                    variant="primary"
                    text="Save Changes"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  />
                  <Button
                    onClick={() => {
                      setEditMode(false);
                      setProfilePicUrl(profile?.profilePic || "");
                      setBio(profile?.bio || "");
                    }}
                    variant="ghost"
                    text="Cancel"
                    className="text-gray-600 dark:text-gray-400"
                  />
                </>
              )}
            </div>
          </div>

          {/* Edit Mode Fields */}
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={profilePicUrl}
                  onChange={(e) => setProfilePicUrl(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter a URL to your profile picture (leave blank for default initials avatar)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {bio.length}/500 characters
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Saves</p>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {profile?.contentCount || 0}
                </p>
              </div>
              <ArchiveIcon className="w-12 h-12 text-purple-600 dark:text-purple-400 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Followers</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {followersCount}
                </p>
              </div>
              <UserIcon className="w-12 h-12 text-green-600 dark:text-green-400 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Following</p>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {followingCount}
                </p>
              </div>
              <UserIcon className="w-12 h-12 text-orange-600 dark:text-orange-400 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Unique Tags</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {profile?.totalTags || 0}
                </p>
              </div>
              <span className="text-5xl opacity-20">🏷️</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Content Types</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {profile?.typeBreakdown?.length || 0}
                </p>
              </div>
              <span className="text-5xl opacity-20">📊</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Type Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Content by Type
            </h2>
            <div className="space-y-3">
              {profile?.typeBreakdown && profile.typeBreakdown.length > 0 ? (
                profile.typeBreakdown.map((item, index) => {
                  const platformMeta = getPlatformMeta(item._id as ContentType);
                  return (
                  <div key={item._id || index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platformMeta.icon}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {item._id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full"
                          style={{ width: `${(item.count / (profile?.contentCount || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No content types yet
                </p>
              )}
            </div>
          </motion.div>

          {/* Top Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Most Used Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile?.topTags && profile.topTags.length > 0 ? (
                profile.topTags.map((tag) => (
                  <span
                    key={tag._id}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    #{tag.name}
                    <span className="bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded-full text-xs">
                      {tag.count}
                    </span>
                  </span>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center w-full py-8">
                  No tags used yet
                </p>
              )}
            </div>
          </motion.div>

          {/* Recent Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {profile?.recentActivity && profile.recentActivity.length > 0 ? (
                profile.recentActivity.map((item) => {
                  const platformMeta = getPlatformMeta(item.type as ContentType);
                  return (
                  <div
                    key={item._id}
                    className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: platformMeta.color }}
                    >
                      {platformMeta.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: platformMeta.color }}
                        >
                          {item.type}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
