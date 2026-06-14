import { useEffect, useState } from "react";

export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("service-worker.js")
        .then((registration) => {
          console.log("[SW] Registered:", registration.scope);
          setSwReady(true);
        })
        .catch((err) => {
          console.error("[SW] Registration failed:", err);
        });
    }

    // Track online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, swReady };
}
