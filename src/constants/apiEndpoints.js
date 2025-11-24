export const ENDPOINTS = {
  LOGIN: `users/signin`,
  SIGNUP: `users/signup`,

  PROFILE: `users/profile-data`,
  UPLOAD_PHOTO: `users/upload-photo`,
  CHANGE_PASSWORD: `users/change-password`,

  POSTS: `posts?limit=1000`,
  POST_BY_ID: (id) => `posts/${id}`,
  USER_POSTS: (userId) => `users/${userId}/posts`,

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
