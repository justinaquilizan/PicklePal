import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OAuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth(); // Assuming setAuth is exposed by AuthContext

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const _id = params.get("_id");
    const username = params.get("username");
    const email = params.get("email");

    if (token && _id && username && email) {
      // Set auth state using AuthContext
      const user = { _id, username, email };
      setAuth({ token, user });
    }

    navigate("/dashboard"); // Redirect to dashboard after processing
  }, [location, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg text-gray-600">Processing Google login...</p>
    </div>
  );
};

export default OAuthSuccess;
