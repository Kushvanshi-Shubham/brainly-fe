import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(
        `${BACKEND_URL}/api/v1/notifications/unread-count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return { unreadCount, refreshUnreadCount: fetchUnreadCount };
};
