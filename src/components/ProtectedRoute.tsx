// src/components/ProtectedRoute.tsx - FULLY OPTIMIZED VERSION

import { ReactElement, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../contexts/AuthContext"; // Import your UserRole type

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: UserRole | UserRole[];
  requireVoiceAuth?: boolean;
  redirectPath?: string; // Add option to customize redirect path
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireVoiceAuth = false,
  redirectPath = "/unauthorized" // Default redirect to unauthorized page
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { 
    currentUser, 
    isAuthenticated, 
    userRole, 
    isVoiceAuthenticated, 
    isVoiceEnrolled,
    hasPermission, // Use the hasPermission function from AuthContext
    isCEO // Use the new isCEO function from AuthContext
  } = useAuth();

  // Enhanced logging - group logs for better readability in console
  useEffect(() => {
    console.group(`ProtectedRoute - ${location.pathname}`);
    console.log("userRole:", userRole);
    console.log("requiredRole:", requiredRole);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isCEO function available:", typeof isCEO === 'function');
    
    if (typeof isCEO === 'function') {
      console.log("isCEO():", isCEO());
    }
    
    if (requiredRole) {
      const hasAccess = hasPermission 
        ? hasPermission(requiredRole) // Use hasPermission if available
        : Array.isArray(requiredRole)
          ? requiredRole.some(role => userRole === role)
          : userRole === requiredRole;
      
      console.log("hasAccess:", hasAccess);

      // More detailed logging for array of roles
      if (Array.isArray(requiredRole)) {
        console.log("Role check details:");
        requiredRole.forEach(role => {
          console.log(`- ${role}: ${userRole === role}`);
        });
      }
    }
    console.groupEnd();
  }, [location.pathname, userRole, requiredRole, isAuthenticated, hasPermission, isCEO]);

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !currentUser) {
    console.log("ProtectedRoute - Redirecting to login, not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // OPTIMIZED CEO CHECK: CEO always has access to all routes regardless of role requirements
  // Make sure we check if the function exists AND if the user is a CEO
  if (typeof isCEO === 'function' && isCEO()) {
    console.log("ProtectedRoute - Allowing access, user is CEO");
    
    // Check voice authentication if required, even for CEO
    if (requireVoiceAuth) {
      // Voice checks are still applied for CEO
      if (!isVoiceEnrolled) {
        console.log("ProtectedRoute - Redirecting to profile, voice not enrolled (CEO)");
        return <Navigate to="/profile" state={{ from: location, requireVoiceSetup: true }} replace />;
      }
      
      if (!isVoiceAuthenticated) {
        console.log("ProtectedRoute - Redirecting to voice login, voice not authenticated (CEO)");
        return <Navigate to="/voice-login" state={{ from: location }} replace />;
      }
    }
    
    return children;
  }

  // ALTERNATE CEO CHECK (just in case): Check if userRole is 'CEO' directly
  if (userRole === 'CEO') {
    console.log("ProtectedRoute - Allowing access, user role is CEO");
    
    // Voice checks still apply
    if (requireVoiceAuth) {
      if (!isVoiceEnrolled) {
        return <Navigate to="/profile" state={{ from: location, requireVoiceSetup: true }} replace />;
      }
      
      if (!isVoiceAuthenticated) {
        return <Navigate to="/voice-login" state={{ from: location }} replace />;
      }
    }
    
    return children;
  }

  // Check role-based access if required
  if (requiredRole) {
    // ROBUST PERMISSION CHECK:
    // 1. Try hasPermission function from context
    // 2. Fallback to array check if it's an array of roles
    // 3. Fallback to direct equality check for single role
    let hasRequiredRole = false;
    
    if (typeof hasPermission === 'function') {
      hasRequiredRole = hasPermission(requiredRole);
    } else if (Array.isArray(requiredRole)) {
      hasRequiredRole = requiredRole.some(role => userRole === role);
    } else {
      hasRequiredRole = userRole === requiredRole;
    }

    if (!hasRequiredRole) {
      console.log("ProtectedRoute - Role check failed");
      console.log(`Required role: ${JSON.stringify(requiredRole)}, User role: ${userRole}`);
      
      // Use custom redirect path if provided, otherwise go to unauthorized
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
  }

  // Check voice authentication if required
  if (requireVoiceAuth) {
    // If voice is not enrolled, redirect to profile page
    if (!isVoiceEnrolled) {
      console.log("ProtectedRoute - Redirecting to profile, voice not enrolled");
      return <Navigate to="/profile" state={{ from: location, requireVoiceSetup: true }} replace />;
    }
    
    // If voice is enrolled but not authenticated in this session, redirect to voice login
    if (!isVoiceAuthenticated) {
      console.log("ProtectedRoute - Redirecting to voice login, voice not authenticated");
      return <Navigate to="/voice-login" state={{ from: location }} replace />;
    }
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;