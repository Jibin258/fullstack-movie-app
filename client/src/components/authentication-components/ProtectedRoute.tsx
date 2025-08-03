import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Define the props type: expects a single JSX.Element as its child
interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }: Props) => {
  // Retrieve the token from localStorage to check authentication
  const token = localStorage.getItem("token");

  // Get the current location to redirect back after login if needed
  const location = useLocation();

  // If no token is found, redirect to the login page ("/") and preserve the location
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
