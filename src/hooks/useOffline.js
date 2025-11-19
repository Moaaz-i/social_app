import { useEffect, useState } from "react";

const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  function detectOnline() {
    setIsOnline(true);
  }

  function detectOffline() {
    setIsOnline(false);
  }

  useEffect(() => {
    window.addEventListener("online", detectOnline);
    window.addEventListener("offline", detectOffline);

    return () => {
      window.removeEventListener("online", detectOnline);
      window.removeEventListener("offline", detectOffline);
    };
  }, []);

  function forceDetect() {
    window.dispatchEvent(new Event("online"));
    window.dispatchEvent(new Event("offline"));
  }

  return { isOnline, forceDetect };
};

export default useOffline;