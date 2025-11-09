import { useApiMutation, useApiQuery } from "./api";
import { ENDPOINTS } from "../constants/apiEndpoints";

export const useLogin = (options = {}) => {
  return useApiMutation("post", `/${ENDPOINTS.LOGIN}`, {
    ...options,
    onSuccess: (data, variables, context) => {
      if (data?.token) {
        localStorage.setItem("access_token", data.token);
      }
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useSignup = (options = {}) => {
  return useApiMutation("post", `/${ENDPOINTS.SIGNUP}`, {
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useGetProfile = (options = {}) => {
  return useApiQuery("profile", `/${ENDPOINTS.PROFILE}`, {
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateProfile = (options = {}) => {
  return useApiMutation("put", `/${ENDPOINTS.UPLOAD_PHOTO}`, {
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
  });
};

export default {
  useLogin,
  useSignup,
  useGetProfile,
  useUpdateProfile,
};
