import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { authApiUrl } from "../config/config";
import { LinearProgress } from "@mui/material";

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
        const response = await axios.get(`${authApiUrl}/protected`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.status === 200) {
          //storing userId in local storage
          localStorage.setItem('userId', response.data.userId);
          setIsAuthenticated(true); // Authenticated
          setIsLoading(false); 
        } else {
          setIsAuthenticated(false); // Not authenticated
        }
      } catch (err) {
        console.error("Error fetching protected route:", err);
        setIsAuthenticated(false); // Error occurred, assume not authenticated
      } finally {
        setIsLoading(false); // Stop loading once check is complete
      }
    };

    isProtected();
  }, [token]); // Empty dependency array to run only once on component mount

  // Handle loading state
  if (isLoading) {
    return <> {isLoading && <LinearProgress/>}</> // Or a spinner, etc.
  }

  // If authenticated, render children; otherwise, redirect to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
