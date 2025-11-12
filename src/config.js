const env = import.meta.env;

export const API_BASE_URL = env.VITE_API_BASE_URL || "https://linked-posts.routemisr.com";

export const AppName = env.VITE_APP_NAME || "Linked Post";
