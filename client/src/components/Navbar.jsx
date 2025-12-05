import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect PWA mode once during component initialization
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isInWebAppiOS = window.navigator.standalone === true;
  const isInWebAppChrome = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;
  const [isPWA] = useState(isStandalone || isInWebAppiOS || isInWebAppChrome);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Monitor online/offline status only
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo and App Mode Indicator */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="text-xl font-bold text-white hover:text-green-200">
                🏓 PicklePal
              </Link>
              {/* PWA Mode Badge */}
              {isPWA && (
                <span className="bg-green-500 text-xs px-2 py-1 rounded-full font-medium">
                  PWA
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/" ? "bg-green-700" : ""
                }`}>
                Home
              </Link>
              <Link
                to="/rules"
                className={`text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/rules" ? "bg-green-700" : ""
                }`}>
                Rules
              </Link>

              {/* Authenticated user links */}
              {auth.token ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === "/dashboard" ? "bg-green-700" : ""
                    }`}>
                    Dashboard
                  </Link>
                  <Link
                    to="/live-match"
                    className={`text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === "/live-match" ? "bg-green-700" : ""
                    } ${!isOnline ? "opacity-50 cursor-not-allowed" : ""}`}>
                    Live Match
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === "/login" ? "bg-green-700" : ""
                    } ${!isOnline ? "opacity-50 cursor-not-allowed" : ""}`}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === "/register" ? "bg-green-700" : ""
                    } ${!isOnline ? "opacity-50 cursor-not-allowed" : ""}`}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-3">
            {/* Online/Offline Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-300" : "bg-red-400"
                }`}></div>
              <span className="text-xs hidden sm:inline">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-green-200 p-2">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  {isOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link
                to="/rules"
                className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium">
                Rules
              </Link>
              {auth.token ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium ${
                      !isOnline ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    Dashboard
                  </Link>
                  <Link
                    to="/live-match"
                    className={`text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium ${
                      !isOnline ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    Live Match
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium ${
                      !isOnline ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium ${
                      !isOnline ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
