import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config.js";

// Create axios instance with base configuration
const http = axios.create({
  baseURL: API_BASE_URL || "https://linked-posts.routemisr.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for auth token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    } else {
      // Show error toast for non-401 errors
      toast.error(errorMessage);
    }

    return Promise.reject(errorMessage);
  }
);

// Custom hook for GET requests
export const useApiQuery = (key, url, options = {}) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await http.get(url);
      return response;
    },
    ...options,
  });
};

// Custom hook for POST, PUT, DELETE, etc.
export const useApiMutation = (method, url, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await http({
        method,
        url,
        data,
        headers: {
          token: localStorage.getItem("access_token"),
        },
      });
      return response;
    },
    onSuccess: (data, variables, context) => {
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries);
      }
      options.onSuccess?.(data, variables, context);
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Export http instance for direct use if needed
export { http };
