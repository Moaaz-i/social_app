const env = import.meta.env;

export const API_BASE_URL = env.VITE_API_BASE_URL || "http://localhost:8000";

export const AppName = env.VITE_APP_NAME || "AppName";
