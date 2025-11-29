import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "./button";
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { motion, AnimatePresence } from "framer-motion";
import { CrossIcon } from "../../Icons/IconsImport";
import toast from "react-hot-toast";
import { detectContentType, type ContentType } from "../../utlis/contentTypeDetection";
import { triggerContentUpdate } from "../../utlis/events";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  refreshContent: () => void; 
}

export function CreateContentModal({ open, onClose, refreshContent }: Readonly<CreateContentModalProps>) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<ContentType>('article');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    if (titleRef.current) titleRef.current.value = "";
    if (linkRef.current) linkRef.current.value = "";
    setType('article');
    setLoading(false);
    setError(null);
  }, []);
  
  // Auto-detect content type from URL
  const handleLinkChange = (url: string) => {
    if (url) {
      const detectedType = detectContentType(url);
      setType(detectedType);
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      titleRef.current?.focus();

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
        resetForm();
      };
    }
  }, [open, onClose, resetForm]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  async function addContent() {
    setError(null);
    const title = titleRef.current?.value.trim();
    const link = linkRef.current?.value.trim();

    if (!title || !link) {
      setError("Title and link are required.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        { link, type, title },
        {
          headers: {
          
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Content added successfully!");
      triggerContentUpdate(); // Trigger instant refresh across all components
      refreshContent(); 
      onClose();
    } catch (err) {
      console.error("Failed to add content:", err);
      setError("Failed to add content. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            ref={modalRef}
            className="relative z-20 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            role="document"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 id="modal-title" className="text-xl font-semibold text-gray-800 dark:text-white">
                Add New Content
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors duration-200"
                aria-label="Close modal"
              >
                <CrossIcon className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 dark:bg-red-900 dark:text-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input ref={titleRef} placeholder={"Title"} />
              <Input 
                ref={linkRef} 
                placeholder={"Link"} 
                onChange={(e) => handleLinkChange(e.target.value)}
              />
            </div>

            <div className="my-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type {type && <span className="text-purple-600 dark:text-purple-400">(Auto-detected: {type})</span>}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="reddit">Reddit</option>
                <option value="medium">Medium</option>
                <option value="github">GitHub</option>
                <option value="codepen">CodePen</option>
                <option value="spotify">Spotify</option>
                <option value="soundcloud">SoundCloud</option>
                <option value="vimeo">Vimeo</option>
                <option value="twitch">Twitch</option>
                <option value="facebook">Facebook</option>
                <option value="pinterest">Pinterest</option>
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="resource">Resource</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                text="Submit"
                size="md"
                onClick={addContent}
                loading={loading}
                loadingText="Submitting..."
                disabled={loading}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
