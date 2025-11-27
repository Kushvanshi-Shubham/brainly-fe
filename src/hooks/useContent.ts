import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../config";


interface ContentItem {
  _id: string;
  type: string;
  title: string;
  link: string;
  tags?: Array<{ _id: string; name: string }>;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  notes?: string;
  userId?: {
    _id: string;
    username: string;
    profilePic?: string;
  };
}


interface UseContentResult {
  contents: ContentItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void; 
}


export function useContent(): UseContentResult {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchContents = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get<{ content: ContentItem[] }>(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setContents(response.data.content);
    } catch (err: unknown) {
      console.error("Failed to fetch content:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load content. Please check your connection.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while loading content.");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []); 

  const refresh = useCallback(() => {
    fetchContents(false); // Explicit refresh shows loading
  }, [fetchContents]);


  useEffect(() => {
    fetchContents(false); // Initial load shows loading

    // Refresh on window focus (like Twitter/LinkedIn)
    const handleFocus = () => {
      fetchContents(true); // Silent refresh when user comes back
    };
    
    // Refresh when content is modified (create/edit/delete)
    const handleContentChange = () => {
      fetchContents(true); // Silent refresh after user action
    };
    
    globalThis.addEventListener('focus', handleFocus);
    globalThis.addEventListener('content-updated', handleContentChange);

    return () => {
      globalThis.removeEventListener('focus', handleFocus);
      globalThis.removeEventListener('content-updated', handleContentChange);
    };
  }, [fetchContents]); 
  
  return { contents, loading, error, refresh };
}
