import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth-token"); // Or your authentication logic
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
