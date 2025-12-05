import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import OfflineBanner from "./OfflineBanner";

// Desktop Top Navigation Component
const DesktopNav = ({
  location,
  filteredNavItems,
  isOnline,
  auth,
  handleLogout,
}) => (
  <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏓</span>
            <span className="text-xl font-bold text-gray-900">PicklePal</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                } ${
                  !isOnline && item.requiresAuth
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}>
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Online Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}></div>
            <span className="text-sm text-gray-600 hidden lg:inline">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          {/* User Actions */}
          {auth.token ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 hidden md:inline">
                {auth.user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                  !isOnline ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all ${
                  !isOnline ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>
);

// Mobile Bottom Navigation Component
const MobileNav = ({ location, filteredNavItems, isOnline }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 safe-area-pb">
    <div className="grid grid-cols-4 gap-1 px-2 py-2">
      {filteredNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
            location.pathname === item.path
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          } ${
            !isOnline && item.requiresAuth
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}>
          <span className="text-xl mb-1">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}
    </div>
  </nav>
);

const Layout = ({ children }) => {
  const { auth, logout } = useAuth();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Navigation items
  const navItems = [
    { path: "/", icon: "🏠", label: "Home", requiresAuth: false },
    { path: "/rules", icon: "📋", label: "Rules", requiresAuth: false },
    { path: "/dashboard", icon: "📊", label: "Dashboard", requiresAuth: true },
    {
      path: "/live-match",
      icon: "🏓",
      label: "Live Match",
      requiresAuth: true,
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAuth || auth.token
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineBanner />

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <DesktopNav
          location={location}
          filteredNavItems={filteredNavItems}
          isOnline={isOnline}
          auth={auth}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main className={`${isMobile ? "pb-20" : ""}`}>{children}</main>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          location={location}
          filteredNavItems={filteredNavItems}
          isOnline={isOnline}
        />
      )}
    </div>
  );
};

export default Layout;
