import { createContext, useState, useCallback, useRef } from "react";
import useAuth from "../hooks/useAuth";

export const LoadingContext = createContext({});

const LoadingProvider = ({ children }) => {
  const { token } = useAuth();
  console.log(token);
  const [loading, setLoading] = useState(token !== undefined);
  const loadingCountRef = useRef(0);

  const startLoading = useCallback(() => {
    loadingCountRef.current += 1;
    if (loadingCountRef.current === 1) {
      setLoading(true);
    }
  }, []);

  const stopLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    if (loadingCountRef.current === 0) {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    startLoading,
    stopLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export default LoadingProvider;
