import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // Will create this next
import Home from "./pages/Home"; // Will create this next
import Rules from "./pages/Rules";
import LiveMatch from "./pages/LiveMatch";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/live-match" element={<LiveMatch />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
