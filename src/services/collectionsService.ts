import axios from "axios";
import { BACKEND_URL } from "../config";
import type { Collection } from "../types";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const collectionsService = {
  // Get all collections for the current user
  getAllCollections: async (): Promise<Collection[]> => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/collections`, {
      headers: getAuthHeaders(),
    });
    return response.data.collections;
  },

  // Get a single collection with all its content
  getCollection: async (collectionId: string): Promise<Collection> => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/collections/${collectionId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Create a new collection
  createCollection: async (data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    isPrivate?: boolean;
  }): Promise<Collection> => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/collections`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Update a collection
  updateCollection: async (
    collectionId: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      icon?: string;
      isPrivate?: boolean;
      order?: number;
    }
  ): Promise<Collection> => {
    const response = await axios.put(
      `${BACKEND_URL}/api/v1/collections/${collectionId}`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Delete a collection
  deleteCollection: async (collectionId: string): Promise<void> => {
    await axios.delete(`${BACKEND_URL}/api/v1/collections/${collectionId}`, {
      headers: getAuthHeaders(),
    });
  },

  // Add content to a collection
  addContentToCollection: async (
    collectionId: string,
    contentId: string
  ): Promise<void> => {
    await axios.post(
      `${BACKEND_URL}/api/v1/collections/${collectionId}/content`,
      { contentId },
      {
        headers: getAuthHeaders(),
      }
    );
  },

  // Remove content from a collection
  removeContentFromCollection: async (
    collectionId: string,
    contentId: string
  ): Promise<void> => {
    await axios.delete(
      `${BACKEND_URL}/api/v1/collections/${collectionId}/content/${contentId}`,
      {
        headers: getAuthHeaders(),
      }
    );
  },

  // Reorder collections
  reorderCollections: async (collectionIds: string[]): Promise<void> => {
    await axios.put(
      `${BACKEND_URL}/api/v1/collections/reorder`,
      { collectionIds },
      {
        headers: getAuthHeaders(),
      }
    );
  },
};
