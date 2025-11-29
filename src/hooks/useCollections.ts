import { useState, useEffect } from "react";
import { collectionsService } from "../services/collectionsService";
import type { Collection } from "../types";
import toast from "react-hot-toast";

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await collectionsService.getAllCollections();
      setCollections(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch collections:", err);
      setError("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    isPrivate?: boolean;
  }) => {
    try {
      const newCollection = await collectionsService.createCollection(data);
      setCollections((prev) => [...prev, newCollection]);
      toast.success("Collection created!");
      return newCollection;
    } catch (err) {
      console.error("Failed to create collection:", err);
      toast.error("Failed to create collection");
      throw err;
    }
  };

  const updateCollection = async (
    collectionId: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      icon?: string;
      isPrivate?: boolean;
    }
  ) => {
    try {
      const updated = await collectionsService.updateCollection(
        collectionId,
        data
      );
      setCollections((prev) =>
        prev.map((col) => (col.id === collectionId ? updated : col))
      );
      toast.success("Collection updated!");
      return updated;
    } catch (err) {
      console.error("Failed to update collection:", err);
      toast.error("Failed to update collection");
      throw err;
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      await collectionsService.deleteCollection(collectionId);
      setCollections((prev) => prev.filter((col) => col.id !== collectionId));
      toast.success("Collection deleted!");
    } catch (err) {
      console.error("Failed to delete collection:", err);
      toast.error("Failed to delete collection");
      throw err;
    }
  };

  const addToCollection = async (collectionId: string, contentId: string) => {
    try {
      await collectionsService.addContentToCollection(collectionId, contentId);
      // Update local state to increment count
      setCollections((prev) =>
        prev.map((col) =>
          col.id === collectionId
            ? { ...col, contentCount: col.contentCount + 1 }
            : col
        )
      );
      toast.success("Added to collection!");
    } catch (err) {
      console.error("Failed to add to collection:", err);
      toast.error("Failed to add to collection");
      throw err;
    }
  };

  const removeFromCollection = async (
    collectionId: string,
    contentId: string
  ) => {
    try {
      await collectionsService.removeContentFromCollection(
        collectionId,
        contentId
      );
      // Update local state to decrement count
      setCollections((prev) =>
        prev.map((col) =>
          col.id === collectionId
            ? { ...col, contentCount: Math.max(0, col.contentCount - 1) }
            : col
        )
      );
      toast.success("Removed from collection!");
    } catch (err) {
      console.error("Failed to remove from collection:", err);
      toast.error("Failed to remove from collection");
      throw err;
    }
  };

  useEffect(() => {
    void fetchCollections();
  }, []);

  return {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
  };
};
