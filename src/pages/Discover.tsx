import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SearchIcon , DiscoverIcon } from "../Icons/IconsImport";
import { BACKEND_URL } from "../config";
import { Avatar } from "../components/ui/Avatar";
import { FollowButton } from "../components/ui/FollowButton";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";

interface DiscoverUser {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  contentCount: number;
  createdAt: string;
}

export default function Discover() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDiscoverUsers();
  }, []);

  const fetchDiscoverUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/users/discover`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchDiscoverUsers();
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/users/search`, {
        params: { q: searchQuery },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data.users || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-600 dark:text-purple-400">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <DiscoverIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            Discover People
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find interesting people to follow and see what they're saving
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="mb-8"
        >
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search users by username or email..."
              className="pl-12 pr-4 py-3 w-full text-lg"
            />
          </div>
        </motion.form>

        {/* Users Grid */}
        {users.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-purple-200 dark:border-gray-700"
          >
            <div className="text-8xl mb-6 animate-pulse">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchQuery ? "Try a different search query" : "No suggested users at the moment"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-2xl transition-all p-6 border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 overflow-hidden"
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                
                {/* User Avatar and Info */}
                <div className="relative flex flex-col items-center text-center mb-4">
                  <button
                    onClick={() => navigate(`/user/${user._id}`)}
                    className="mb-4 hover:scale-105 transition-transform duration-200"
                  >
                    <Avatar
                      profilePic={user.profilePic}
                      username={user.username}
                      size="xl"
                      showOnlineIndicator={false}
                    />
                  </button>

                  <button
                    onClick={() => navigate(`/user/${user._id}`)}
                    className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300 mb-1"
                  >
                    {user.username}
                  </button>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {user.email}
                  </p>

                  {user.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-2 mb-4 px-2">
                      "{user.bio}"
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-5 py-4 border-y-2 border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                      {user.contentCount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Saves</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      {user.followersCount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                      {user.followingCount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Following</p>
                  </div>
                </div>

                {/* Follow Button */}
                <FollowButton
                  userId={user._id}
                  username={user.username}
                  className="w-full"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
