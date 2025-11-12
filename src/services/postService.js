import { ENDPOINTS } from "../constants/apiEndpoints";
import { useApiQuery, useApiMutation } from "./api";

export const GetPost = (postId, options = {}) => {
  return useApiQuery(["post", postId], `/${ENDPOINTS.POST_BY_ID(postId)}`, {
    enabled: !!postId, // Only fetch if postId exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchInterval: 3000, // Refetch every 3 seconds
    staleTime: 0, // Always consider data stale to allow refetch
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    structuralSharing: true, // Only update if data actually changed
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
  });
} 

export const GetAllPosts = (options = {}) => {
    return useApiQuery("posts", `/${ENDPOINTS.POSTS}`, {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on component mount if data exists
      refetchInterval: 3000, // Refetch every 3 seconds
      staleTime: 0, // Always consider data stale to allow refetch
      gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
      structuralSharing: true, // Only update if data actually changed
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
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on component mount if data exists
        refetchInterval: 3000, // Refetch every 3 seconds
        staleTime: 0, // Always consider data stale to allow refetch
        gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
        structuralSharing: true, // Only update if data actually changed
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
      // Extract id from FormData or regular object
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
      skipLoading: true, // No loading spinner for delete
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
      skipLoading: true, // No loading spinner for like
      invalidateQueries: ["posts", ["userPosts"]],
      ...options,
    }
  );
};

// Comment Services
export const CreateComment = (options = {}) => {
  return useApiMutation("post", `/${ENDPOINTS.COMMENTS}`, {
    skipLoading: true, // No loading spinner for comment
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
    (data) => `/${ENDPOINTS.COMMENT(data.id)}`, // Dynamic URL based on comment id
    {
      skipLoading: true, // No loading spinner for delete comment
      invalidateQueries: ["posts", ["userPosts"]],
      successMessage: "Comment deleted successfully!",
      ...options,
    }
  );
};