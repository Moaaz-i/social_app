import { ENDPOINTS } from "../constants/apiEndpoints";
import { useApiQuery, useApiMutation } from "./api";

export const GetPost = (postId, options = {}) => {
  return useApiQuery(["post", postId], `/${ENDPOINTS.POST_BY_ID(postId)}`, {
    enabled: !!postId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 3000,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    structuralSharing: true,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
  });
} 

export const GetAllPosts = (options = {}) => {
    return useApiQuery("posts", `/${ENDPOINTS.POSTS}`, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 3000,
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
      structuralSharing: true,
      ...options,
      onSuccess: (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
      },
    });
  };

export const GetUserPosts = (userId, options = {}) => {
    return useApiQuery(
      ["userPosts", userId], 
      `/${ENDPOINTS.USER_POSTS(userId)}`, 
      {
        enabled: !!userId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: 3000,
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        structuralSharing: true,
        ...options,
        onSuccess: (data, variables, context) => {
          options.onSuccess?.(data, variables, context);
        },
      }
    );
  };

export const CreatePost = (options = {}) => {
  return useApiMutation("post", `/${ENDPOINTS.POSTS}`, {
    invalidateQueries: ["posts"],
    skipLoading: true,
    successMessage: "Post created successfully!",
    ...options,
  });
};

export const UpdatePost = (options = {}) => {
  return useApiMutation(
    "put",
    (data) => {
      const id = data instanceof FormData ? data.get('id') : data.id;
      return `/${ENDPOINTS.POST_BY_ID(id)}`;
    },
    {
      skipLoading: true,
      invalidateQueries: ["posts", ["userPosts"]],
      ...options,
    }
  );
};

export const DeletePost = (options = {}) => {
  return useApiMutation(
    "delete", 
    (data) => `/${ENDPOINTS.POST_BY_ID(data.id)}`,
    {
      skipLoading: true,
      invalidateQueries: ["posts", ["userPosts"]],
      successMessage: "Post deleted successfully!",
      ...options,
    }
  );
};

export const LikePost = (options = {}) => {
  return useApiMutation(
    "patch", 
    (data) => `/${ENDPOINTS.POST_BY_ID(data.id)}`,
    {
      skipLoading: true,
      invalidateQueries: ["posts", ["userPosts"]],
      ...options,
    }
  );
};

export const CreateComment = (options = {}) => {
  return useApiMutation("post", `/${ENDPOINTS.COMMENTS}`, {
    skipLoading: true,
    invalidateQueries: ["posts", ["userPosts"]],
    successMessage: "Comment added successfully!",
    ...options,
  });
};

export const UpdateComment = (commentId, options = {}) => {
  return useApiMutation("put", `/${ENDPOINTS.COMMENT(commentId)}`, {
    invalidateQueries: ["posts", ["userPosts"]],
    successMessage: "Comment updated successfully!",
    ...options,
  });
};

export const DeleteComment = (options = {}) => {
  return useApiMutation(
    "delete", 
    (data) => `/${ENDPOINTS.COMMENT(data.id)}`,
    {
      skipLoading: true,
      invalidateQueries: ["posts", ["userPosts"]],
      successMessage: "Comment deleted successfully!",
      ...options,
    }
  );
};