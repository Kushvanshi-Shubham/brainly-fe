import axios from "axios";
import { BACKEND_URL } from "../config";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const followService = {
  // Follow a user
  followUser: async (userId: string) => {
    const response = await api.post(`/follow/${userId}`);
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (userId: string) => {
    const response = await api.post(`/unfollow/${userId}`);
    return response.data;
  },

  // Get followers list
  getFollowers: async (userId: string) => {
    const response = await api.get(`/followers/${userId}`);
    return response.data;
  },

  // Get following list
  getFollowing: async (userId: string) => {
    const response = await api.get(`/following/${userId}`);
    return response.data;
  },

  // Check if following a user
  isFollowing: async (userId: string) => {
    const response = await api.get(`/is-following/${userId}`);
    return response.data;
  },
};
