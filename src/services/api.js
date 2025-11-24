import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config.js";

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

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  if (!config.skipLoading) {
    startLoading();
  }
  
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.token = `${token}`;
  }
  
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, (error) => {
  stopLoading();
  return Promise.reject(error);
});

http.interceptors.response.use(
  (response) => {
    if (!response.config?.skipLoading) {
      stopLoading();
    }
    return response.data;
  },
  (error) => {
    if (!error.config?.skipLoading) {
      stopLoading();
    }

    const rawData = error.response?.data;
    let message =
      typeof rawData === "string"
        ? rawData
        : rawData?.message || rawData?.error || "An error occurred";

    if (typeof message !== "string") {
      message = String(message);
    }

    if (error.response?.status === 401) {
      toast.error(message);
    } else {
      toast.error(message);
    }

    return Promise.reject(message);
  }
);

export const useApiQuery = (key, url, options = {}) => {
  const queryClient = useQueryClient();
  const queryKey = Array.isArray(key) ? key : [key];
  
  return useQuery({
    queryKey,
    queryFn: async ({ queryKey, meta }) => {
      const cachedData = queryClient.getQueryData(queryKey);
      const skipLoading = !!cachedData;
      
      const response = await http.get(url, { skipLoading });
      return response;
    },
    ...options,
  });
};

export const useApiMutation = (method, url, options = {}) => {
  const queryClient = useQueryClient();
  const { skipLoading = false, ...restOptions } = options;

  return useMutation({
    mutationFn: async (data) => {
      const finalUrl = typeof url === 'function' ? url(data) : url;
      
      const response = await http({
        method,
        url: finalUrl,
        data,
        skipLoading,
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

export { http };
