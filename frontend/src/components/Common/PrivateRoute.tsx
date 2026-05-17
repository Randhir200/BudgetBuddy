import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { apiClient } from "../../configs/apiClient";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use boolean for clarity
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const token = localStorage.getItem("auth-token"); // Retrieve the token from localStorage

  useEffect(() => {
    const isProtected = async () => {
      try {
        if (!token) { 
          setIsAuthenticated(false); // No token, so not authenticated
          return;
        }
        const response = await apiClient.get(`/auth/me`);

        if (response.status === 200) {
          //storing userId in local storage
          localStorage.setItem('userId', response.data.data.userId);
          localStorage.setItem('userEmail', response.data.data.email || '');
          setIsAuthenticated(true); // Authenticated
          setIsLoading(false); 
        } else {
          setIsAuthenticated(false); // Not authenticated
        }
      } catch (err) {
        setIsAuthenticated(false); // Error occurred, assume not authenticated
      } finally {
        setIsLoading(false); // Stop loading once check is complete
      }
    };

    isProtected();
  }, [token]); // Empty dependency array to run only once on component mount

  // Handle loading state
  if (isLoading) {
    return <> {isLoading && <LinearProgress/>}</> 
  }

  // If authenticated, render children; otherwise, redirect to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
