import { useState } from "react";
import { ShareIcon } from "../../Icons/IconsImport.ts";
import { BACKEND_URL } from "../../config.ts";
import toast from "react-hot-toast";
import axios from "axios";
import { Button } from "./button.tsx";


export function ShareLink() {
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    setLoading(true);
    const promise = axios.post(
      `${BACKEND_URL}/api/v1/brain/share`,
      { share: true },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );

    toast.promise(
      promise
        .then(async (res) => {
          const shareLink = `${window.location.origin}/brain/${res.data.hash}`;
          await navigator.clipboard.writeText(shareLink);
          return "Share link copied to clipboard!"; 
        })
        .catch((err) => {
          console.error("Share link error:", err);
          
          throw new Error(err.response?.data?.message || "Failed to generate link.");
        }),
      {
        loading: "Generating link...",
        success: (message) => message, 
        error: (err) => err.message, 
      }
    ).finally(() => {
        setLoading(false);
    });
  }

  return (
    <Button
      onClick={handleShare}
      variant="secondary"
      size="sm"
      startIcon={<ShareIcon className="w-4 h-4" />}
      text="Copy Share Link"
      loading={loading}
      disabled={loading}
    />
  );
}
