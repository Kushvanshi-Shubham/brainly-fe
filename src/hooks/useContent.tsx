import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

interface ContentItem {
  type: string;
  title: string;
  link: string;
}

export function useContent() {
  const [contents, setContents] = useState<ContentItem[]>([]);

  function refresh() {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setContents(response.data.content);
      })
      .catch((err) => {
        console.error("Failed to fetch content:", err.message);
      });
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { refresh, contents };
}
