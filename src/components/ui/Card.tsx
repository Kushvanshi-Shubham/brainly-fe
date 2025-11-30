import axios from "axios";
import { BACKEND_URL } from "../../config";
import { DeleteIcon, ShareIcon, EditIcon, StarIcon, ArchiveIcon } from "../../Icons/IconsImport";
import { useState, memo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "./button";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./Dialog";
import { EmbedPreview } from "./EmbedPreview";
import { AddToCollection } from "./AddToCollection";
import { useCollections } from "../../hooks/useCollections";
import { getPlatformMeta, type ContentType } from "../../utlis/contentTypeDetection";
import type { Content } from "../../types";
import { triggerContentUpdate } from "../../utlis/events";
import { Spinner } from "./Spinner";

// Lazy load EditContentModal for better performance
const EditContentModal = lazy(() => 
  import("./EditContentModal").then(module => ({ 
    default: module.EditContentModal 
  }))
);

interface CardProps {
  content: Content;
  refresh: () => void;
  collectionId?: string;
  onContentRemoved?: () => void;
}

const CardComponent = ({ content, refresh, collectionId, onContentRemoved }: CardProps) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(content.isFavorite || false);
  const [isArchived, setIsArchived] = useState(content.isArchived || false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { _id: contentId, title, link, type, notes, userId } = content;
  const platformMeta = getPlatformMeta(type as ContentType);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Content deleted successfully!");
      triggerContentUpdate();
      refresh();
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Failed to delete content:", err);
      toast.error("Failed to delete content. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BACKEND_URL}/api/v1/content/${contentId}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newFavorite = !isFavorite;
      setIsFavorite(newFavorite);
      toast.success(newFavorite ? "Added to favorites" : "Removed from favorites");
      triggerContentUpdate();
      refresh();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const toggleArchive = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BACKEND_URL}/api/v1/content/${contentId}/archive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newArchived = !isArchived;
      setIsArchived(newArchived);
      toast.success(newArchived ? "Archived" : "Unarchived");
      triggerContentUpdate();
      refresh();
    } catch (error) {
      console.error("Failed to toggle archive:", error);
      toast.error("Failed to update archive status");
    }
  };

  const { removeFromCollection } = useCollections();
  
  const handleRemoveFromCollection = async () => {
    if (!collectionId) return;
    
    try {
      await removeFromCollection(collectionId, contentId);
      if (onContentRemoved) {
        onContentRemoved();
      }
    } catch (error) {
      console.error("Failed to remove from collection:", error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 will-change-transform"
    >
      {/* Embed preview - Full width at top */}
      <div className="w-full max-h-[600px] overflow-hidden">
        <EmbedPreview url={link} type={type as ContentType} title={title} />
      </div>

      {/* Content section */}
      <div className="p-5">
        {/* Header with platform badge and title */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{platformMeta.icon}</span>
            <span 
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: platformMeta.color + '20',
                color: platformMeta.color 
              }}
            >
              {type}
            </span>
            {isFavorite && <span className="text-yellow-500 text-lg">★</span>}
            {isArchived && <span className="text-purple-500 text-lg">📦</span>}
          </div>

          {/* Username - clickable */}
          {userId && (
            <button
              onClick={() => navigate(`/user/${userId._id}`)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium mb-2 hover:underline"
            >
              @{userId.username}
            </button>
          )}

          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
            {title}
          </h3>
          
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 line-clamp-1 hover:underline"
          >
            {link}
          </a>
        </div>
        
        {/* Notes section */}
        {notes && (
          <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-850 rounded-lg border border-purple-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-purple-700 dark:text-purple-400">💭 Note:</span> {notes}
            </p>
          </div>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {content.tags.slice(0, isExpanded ? content.tags.length : 5).map((tag, index) => {
              const tagName = typeof tag === 'string' ? tag : tag.name;
              return (
                <button
                  key={`${tagName}-${index}`}
                  onClick={() => navigate(`/explore?tag=${encodeURIComponent(tagName)}`)}
                  className="px-3 py-1.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                  title={`Search for content tagged with ${tagName}`}
                >
                  #{tagName}
                </button>
              );
            })}
            {content.tags.length > 5 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-colors"
              >
                {isExpanded ? '− Show less' : `+ ${content.tags.length - 5} more`}
              </button>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {collectionId && (
              <button
                onClick={handleRemoveFromCollection}
                className="p-2.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                title="Remove from collection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={toggleFavorite}
              className={`p-2.5 rounded-lg transition-all ${
                isFavorite 
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-sm' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <StarIcon className="w-5 h-5" filled={isFavorite} />
            </button>
            <button
              onClick={() => setShowCollectionDialog(true)}
              className="p-2.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
              title="Add to collection"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              title="Edit content"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={toggleArchive}
              className="p-2.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
              title={isArchived ? "Unarchive" : "Archive"}
            >
              <ArchiveIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all" 
              title="Open Link"
            >
              <ShareIcon className="w-5 h-5" />
            </a>
            <button 
              onClick={() => setShowConfirmModal(true)} 
              className="p-2.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all" 
              title="Delete" 
              disabled={isDeleting}
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
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

      {showEditModal && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50"><Spinner /></div>}>
          <EditContentModal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            content={content}
            refreshContent={refresh}
          />
        </Suspense>
      )}

      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <AddToCollection 
          contentId={content._id} 
          onClose={() => setShowCollectionDialog(false)} 
        />
      </Dialog>
    </motion.div>
  );
};

// Memoize to prevent unnecessary re-renders (keeps embeds playing during data refresh)
export const Card = memo(CardComponent, (prevProps, nextProps) => {
  // Only re-render if content actually changed
  return (
    prevProps.content._id === nextProps.content._id &&
    prevProps.content.isFavorite === nextProps.content.isFavorite &&
    prevProps.content.isArchived === nextProps.content.isArchived &&
    prevProps.content.title === nextProps.content.title &&
    prevProps.content.notes === nextProps.content.notes
  );
});

Card.displayName = 'Card';
