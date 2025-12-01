import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:5000/api";
    axios.defaults.headers.common["x-auth-token"] = auth.token;

    if (auth.token) {
      localStorage.setItem("token", auth.token);
    } else {
      localStorage.removeItem("token");
    }
    if (auth.user) {
      localStorage.setItem("user", JSON.stringify(auth.user));
    } else {
      localStorage.removeItem("user");
    }
    axios.defaults.headers.common["x-auth-token"] = auth.token;
  }, [auth]);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    setAuth({
      token: res.data.token,
      user: {
        _id: res.data._id,
        username: res.data.username,
        email: res.data.email,
      },
    });
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await axios.post("/auth/register", {
      username,
      email,
      password,
    });
    setAuth({
      token: res.data.token,
      user: {
        _id: res.data._id,
        username: res.data.username,
        email: res.data.email,
      },
    });
    return res.data;
  };

  const logout = () => {
    setAuth({ token: "", user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
