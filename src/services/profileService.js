import { useApiMutation, useApiQuery } from "./api";
import { ENDPOINTS } from "../constants/apiEndpoints";

export const useGetProfile = (options = {}) => {
  return useApiQuery("profile", `/${ENDPOINTS.PROFILE}`, {
    refetchInterval: false, // Disable automatic refetching
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    structuralSharing: true, // Only update if data actually changed
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useUploadPhoto = (options = {}) => {
  return useApiMutation("put", `/${ENDPOINTS.UPLOAD_PHOTO}`, {
    skipLoading: true,
    invalidateQueries: ["profile"],
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },
  });
};

export const useChangePassword = (options = {}) => {
  return useApiMutation("patch", `/${ENDPOINTS.CHANGE_PASSWORD}`, {
    successMessage: "Password changed successfully!",
    ...options,
  });
};