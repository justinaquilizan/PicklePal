import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-green-200">
              🏓 PicklePal
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Rules link - always visible */}
            <Link
              to="/rules"
              className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
              Rules
            </Link>

            {/* Authenticated user links */}
            {auth.token ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link
                  to="/live-match"
                  className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
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
                  className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
