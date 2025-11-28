import { useState, useEffect } from "react";
import { followService } from "../services/followService";

export const useFollow = (targetUserId: string | null) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (targetUserId) {
      checkFollowStatus();
    }
  }, [targetUserId]);

  const checkFollowStatus = async () => {
    if (!targetUserId) return;
    
    try {
      const data = await followService.isFollowing(targetUserId);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("Failed to check follow status:", err);
    }
  };

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
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update follow status");
      console.error("Follow/unfollow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, loading, error, toggleFollow };
};

export const useFollowers = (userId: string | null) => {
  const [followers, setFollowers] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchFollowers();
    }
  }, [userId]);

  const fetchFollowers = async () => {
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
  };

  return { followers, count, loading, refetch: fetchFollowers };
};

export const useFollowing = (userId: string | null) => {
  const [following, setFollowing] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchFollowing();
    }
  }, [userId]);

  const fetchFollowing = async () => {
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
  };

  return { following, count, loading, refetch: fetchFollowing };
};
