import { useState, useEffect, useCallback } from "react";
import { followService } from "../services/followService";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
}

export const useFollow = (targetUserId: string | null) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkFollowStatus = useCallback(async () => {
    if (!targetUserId) return;
    
    try {
      const data = await followService.isFollowing(targetUserId);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("Failed to check follow status:", err);
    }
  }, [targetUserId]);

  useEffect(() => {
    if (targetUserId) {
      checkFollowStatus();
    }
  }, [targetUserId, checkFollowStatus]);

  const toggleFollow = async () => {
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      if (isFollowing) {
        await followService.unfollowUser(targetUserId);
        setIsFollowing(false);
      } else {
        await followService.followUser(targetUserId);
        setIsFollowing(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update follow status";
      setError(errorMessage);
      console.error("Follow/unfollow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, loading, error, toggleFollow };
};

export const useFollowers = (userId: string | null) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchFollowers = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await followService.getFollowers(userId);
      setFollowers(data.followers);
      setCount(data.count);
    } catch (err) {
      console.error("Failed to fetch followers:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchFollowers();
    }
  }, [userId, fetchFollowers]);

  return { followers, count, loading, refetch: fetchFollowers };
};

export const useFollowing = (userId: string | null) => {
  const [following, setFollowing] = useState<User[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchFollowing = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await followService.getFollowing(userId);
      setFollowing(data.following);
      setCount(data.count);
    } catch (err) {
      console.error("Failed to fetch following:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchFollowing();
    }
  }, [userId, fetchFollowing]);

  return { following, count, loading, refetch: fetchFollowing };
};
