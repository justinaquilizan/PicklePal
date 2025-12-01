import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [auth.token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {auth.user ? (
        <>
          <p className="text-lg text-gray-600 mb-2">
            Welcome, {auth.user.username}!
          </p>
          <p className="text-md text-gray-500 mb-6">
            Your email: {auth.user.email}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Logout
          </button>
        </>
      ) : (
        <p className="text-lg text-gray-600">
          Please log in to view the dashboard.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
