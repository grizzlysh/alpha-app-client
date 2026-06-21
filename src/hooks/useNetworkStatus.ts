import { useState, useEffect, useRef } from "react";

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const wentOffline = useRef(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      wentOffline.current = true;
    };

    const handleOnline = () => {
      setIsOnline(true);
      if (wentOffline.current) {
        setWasOffline(true);
        wentOffline.current = false;
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Auto-clear the wasOffline flag after 3 seconds
  useEffect(() => {
    if (!wasOffline) return;
    const timer = setTimeout(() => setWasOffline(false), 3000);
    return () => clearTimeout(timer);
  }, [wasOffline]);

  return { isOnline, wasOffline };
}
