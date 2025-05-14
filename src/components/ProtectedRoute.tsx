// src/components/ProtectedRoute.tsx - UPDATED FOR VOICE AUTH

import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: string | string[];
  requireVoiceAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireVoiceAuth = false 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { currentUser, isAuthenticated, userRole, isVoiceAuthenticated, isVoiceEnrolled } = useAuth();

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.some(role => userRole === role)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check voice authentication if required
  if (requireVoiceAuth) {
    // If voice is not enrolled, redirect to profile page
    if (!isVoiceEnrolled) {
      return <Navigate to="/profile" state={{ from: location, requireVoiceSetup: true }} replace />;
    }
    
    // If voice is enrolled but not authenticated in this session, redirect to voice login
    if (!isVoiceAuthenticated) {
      return <Navigate to="/voice-login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
