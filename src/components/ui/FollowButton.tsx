import React from "react";
import { useFollow } from "../../hooks/useFollow";
import { Button } from "./button";

interface FollowButtonProps {
  userId: string;
  username?: string;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
  userId, 
  username,
  className = "" 
}) => {
  const { isFollowing, loading, toggleFollow } = useFollow(userId);

  return (
    <Button
      onClick={toggleFollow}
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      className={className}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
};
