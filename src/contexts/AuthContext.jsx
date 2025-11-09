import { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { http } from "../services/api";
import { ENDPOINTS } from "../constants/apiEndpoints";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [storedToken, setStoredToken] = useState(
    localStorage.getItem("access_token")
  );
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkToken = useCallback(() => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        setStoredToken(token);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || "Token check failed");
      return false;
    }
  }, []);

  const checkUser = useCallback(async () => {
    if (!storedToken) {
      setUserData(null);
      return false;
    }
    
    try {
      setIsLoading(true);
      const response = await http.get(`/${ENDPOINTS.PROFILE}`);
      setUserData(response);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || "User check failed");
      setUserData(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [storedToken]);

  useEffect(() => {
    if (storedToken) {
      checkUser();
    } else {
      setUserData(null);
    }
  }, [storedToken, checkUser]);

  const login = useCallback(async (token) => {
    try {
      localStorage.setItem("access_token", token);
      setStoredToken(token);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message || "Login failed");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("access_token");
      setStoredToken(null);
      setUserData(null);
      setError(null);
    } catch (err) {
      setError(err.message || "Logout failed");
    }
  }, []);

  const isAuthenticatedValue = useMemo(() => {
    return !!storedToken && !!userData;
  }, [storedToken, userData]);

  // For backward compatibility, provide both the value and function versions
  const isAuthenticated = useCallback(() => isAuthenticatedValue, [isAuthenticatedValue]);

  const value = useMemo(() => ({
    userData,
    storedToken,
    login,
    logout,
    checkToken,
    checkUser,
    isAuthenticated: isAuthenticatedValue, // Value version
    isAuthenticatedFn: isAuthenticated,    // Function version
    error,
    isLoading,
  }), [userData, storedToken, login, logout, checkToken, checkUser, isAuthenticatedValue, isAuthenticated, error, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export default AuthProvider;
