import axios from "axios";
import { BACKEND_URL } from "../../config";
import { DeleteIcon, ShareIcon } from "../../Icons/IconsImport";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./Dialog";


declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

interface CardProps {
  contentId: string;
  title: string;
  link: string;
  type: string;
  refresh: () => void;
}

export function Card({ contentId, title, link, type, refresh }: CardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    if (type === "twitter" && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [type]);



  const getEmbedLink = () => {
    if (type === "youtube") {
      const videoIdMatch = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
    }
 
    if (type === "twitter") {
      return link;
    }
    return null; 
  };

  const embedLink = getEmbedLink();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        setIsDeleting(false);
        return;
      }

      await axios.delete(`${BACKEND_URL}/api/v1/content/${contentId}`, {
        headers: {
         
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Content deleted successfully!");
      refresh();
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Failed to delete content:", err);
      toast.error("Failed to delete content. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md w-full max-w-sm flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
          {type}
        </span>
        <div className="flex gap-2 items-center">
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-500 dark:hover:text-purple-300 transition-colors" title="Open Link">
            <ShareIcon className="w-5 h-5" />
          </a>
          <button onClick={() => setShowConfirmModal(true)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors" title="Delete Content" disabled={isDeleting}>
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 mb-3 flex-grow">
        {title}
      </h3>

      <div className="rounded overflow-hidden mt-auto">
        {type === "youtube" && embedLink && (
          <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700">
            <iframe className="w-full h-full rounded" src={embedLink} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        )}

        {type === "twitter" && embedLink && (
          
          <div className="w-full min-h-[150px]">
            <blockquote className="twitter-tweet" data-theme="dark">
              <a href={embedLink}>Loading Tweet...</a>
            </blockquote>
          </div>
        )}

        {!embedLink && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-600 dark:text-gray-400 text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <span className="line-clamp-2 p-2 font-medium">Click to open: {link}</span>
          </a>
        )}
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this content? This action cannot be undone.</p>
            <p className="font-semibold mt-2 break-words">"{title}"</p>
          </div>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setShowConfirmModal(false)} variant="ghost" text="Cancel" disabled={isDeleting} />
            <Button onClick={handleDelete} variant="danger" loading={isDeleting} loadingText="Deleting..." text="Delete" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
