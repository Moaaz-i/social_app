export const ENDPOINTS = {
  // Auth Endpoints
  LOGIN: `users/signin`,
  SIGNUP: `users/signup`,

  // User Endpoints
  PROFILE: `users/profile-data`,
  UPLOAD_PHOTO: `users/upload-photo`,
  CHANGE_PASSWORD: `users/change-password`,

  // Post Endpoints
  POSTS: `posts`,
  POST_BY_ID: (id) => `posts/${id}`,
  USER_POSTS: (userId) => `users/${userId}/posts`,

  // Comment Endpoints
  COMMENTS: `comments`,
  COMMENT: (id) => `comments/${id}`,
  POST_COMMENTS: (postId) => `posts/${postId}/comments`,
};

export const HEADERS = {
  "Content-Type": "application/json",
  getAuthHeader: () => ({
    "Content-Type": "application/json",
    token: `${localStorage.getItem("access_token")}`,
  }),
  getMultipartHeader: () => ({
    "Content-Type": "multipart/form-data",
    token: `${localStorage.getItem("access_token")}`,
  }),
};
