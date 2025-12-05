import React, { useState, useEffect } from "react";

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-50 p-3 text-center text-sm font-medium transition-all duration-300 ${
        isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}>
      {isOnline ? (
        <span>🟢 Connection restored - Online mode active</span>
      ) : (
        <span>🔴 No internet connection - Offline mode active</span>
      )}
    </div>
  );
};

export default OfflineBanner;
