import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser !== null;
  };

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
