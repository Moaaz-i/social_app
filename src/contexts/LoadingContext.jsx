import { createContext, useState, useEffect } from "react";
import { subscribeToLoading } from "../services/api";

const LoadingContext = createContext({});

const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to loading state from api.js
    const unsubscribe = subscribeToLoading((isLoading) => {
      setLoading(isLoading);
    });

    return unsubscribe;
  }, []);

  const value = {
    loading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export { LoadingContext };
export default LoadingProvider;
