import { useApiMutation, useApiQuery } from "./api";
import { ENDPOINTS } from "../constants/apiEndpoints";

export const useGetProfile = (options = {}) => {
  return useApiQuery("profile", `/${ENDPOINTS.PROFILE}`, {
    refetchInterval: 3000, // Refetch every 3 seconds
    staleTime: 0, // Always consider data stale to allow refetch
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
  });
};

export const useChangePassword = (options = {}) => {
  return useApiMutation("patch", `/${ENDPOINTS.CHANGE_PASSWORD}`, {
    successMessage: "Password changed successfully!",
    ...options,
  });
};