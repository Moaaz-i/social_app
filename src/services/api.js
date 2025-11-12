import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config.js";

// Loading state management
let loadingCount = 0;
const loadingCallbacks = new Set();

export const subscribeToLoading = (callback) => {
  loadingCallbacks.add(callback);
  return () => loadingCallbacks.delete(callback);
};

const notifyLoading = (isLoading) => {
  loadingCallbacks.forEach(callback => callback(isLoading));
};

const startLoading = () => {
  loadingCount++;
  if (loadingCount === 1) {
    notifyLoading(true);
  }
};

const stopLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    notifyLoading(false);
  }
};

// Create axios instance with base configuration
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for auth token and loading
http.interceptors.request.use((config) => {
  // Start loading only if not explicitly disabled
  if (!config.skipLoading) {
    startLoading();
  }
  
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.token = `${token}`;
  }
  
  // Set Content-Type based on data type
  if (config.data instanceof FormData) {
    // Let browser set Content-Type with boundary for FormData
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    // Default to JSON for other requests
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, (error) => {
  stopLoading();
  return Promise.reject(error);
});

// Response interceptor for error handling and loading
http.interceptors.response.use(
  (response) => {
    // Stop loading on success only if it was started
    if (!response.config?.skipLoading) {
      stopLoading();
    }
    return response.data;
  },
  (error) => {
    // Stop loading on error only if it was started
    if (!error.config?.skipLoading) {
      stopLoading();
    }
    
    const errorMessage = error.response?.data?.message || "An error occurred";

    if (error.response?.status === 401) {
      // Handle unauthorized access

      toast.error(errorMessage)
    } else {
      // Show error toast for non-401 errors
      toast.error(errorMessage);
    }

    return Promise.reject(errorMessage);
  }
);

// Custom hook for GET requests
export const useApiQuery = (key, url, options = {}) => {
  const queryClient = useQueryClient();
  const queryKey = Array.isArray(key) ? key : [key];
  
  return useQuery({
    queryKey,
    queryFn: async ({ queryKey, meta }) => {
      // Check if data exists in cache (not first fetch)
      const cachedData = queryClient.getQueryData(queryKey);
      const skipLoading = !!cachedData;
      
      const response = await http.get(url, { skipLoading });
      return response;
    },
    ...options,
  });
};

// Custom hook for POST, PUT, DELETE, etc.
export const useApiMutation = (method, url, options = {}) => {
  const queryClient = useQueryClient();
  const { skipLoading = false, ...restOptions } = options;

  return useMutation({
    mutationFn: async (data) => {
      // Support dynamic URL if urlBuilder is provided
      const finalUrl = typeof url === 'function' ? url(data) : url;
      
      const response = await http({
        method,
        url: finalUrl,
        data,
        skipLoading, // Pass skipLoading to axios config
        headers: {
          token: localStorage.getItem("access_token"),
        },
      });
      return response;
    },
    onSuccess: (data, variables, context) => {
      if (restOptions.invalidateQueries) {
        queryClient.invalidateQueries(restOptions.invalidateQueries);
      }
      restOptions.onSuccess?.(data, variables, context);
      if (restOptions.successMessage) {
        toast.success(restOptions.successMessage);
      }
    },
    onError: (error, variables, context) => {
      restOptions.onError?.(error, variables, context);
    },
    ...restOptions,
  });
};

// Export http instance for direct use if needed
export { http };
