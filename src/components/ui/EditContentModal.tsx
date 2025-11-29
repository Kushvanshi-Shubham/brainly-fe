import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./Dialog";
import { Button } from "./button";
import { Input } from "./Input";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../config";
import type { Content } from "../../types";
import { triggerContentUpdate } from "../../utlis/events";

interface EditContentModalProps {
  open: boolean;
  onClose: () => void;
  content: Content | null;
  refreshContent: () => void;
}

export function EditContentModal({ open, onClose, content, refreshContent }: Readonly<EditContentModalProps>) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<string>("article");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setLink(content.link);
      setType(content.type);
      setTags(content.tags.map(t => t.name).join(", "));
      setNotes(content.notes || "");
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const tagArray = tags
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await axios.put(
        `${BACKEND_URL}/api/v1/content/${content._id}`,
        { title, link, type, tags: tagArray, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Content updated successfully!");
      triggerContentUpdate(); // Instant refresh across app
      refreshContent();
      onClose();
    } catch (error) {
      console.error("Failed to update content:", error);
      toast.error("Failed to update content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link
            </label>
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              required
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
              <option value="resource">Resource</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="javascript, tutorial, react"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this content..."
              maxLength={1000}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {notes.length}/1000 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              text="Cancel"
              onClick={onClose}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="primary"
              text={isSubmitting ? "Updating..." : "Update"}
              disabled={isSubmitting}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
