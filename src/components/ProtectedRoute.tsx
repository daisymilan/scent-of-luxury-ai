
// src/components/ProtectedRoute.tsx - CEO ACCESS HOTFIX

import { ReactElement, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: UserRole | UserRole[];
  requireVoiceAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireVoiceAuth = false 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { 
    currentUser, 
    isAuthenticated, 
    userRole, 
    isVoiceAuthenticated, 
    isVoiceEnrolled,
    hasPermission,
    isCEO
  } = useAuth();

  // Enhanced debugging
  useEffect(() => {
    console.log("ProtectedRoute - Path:", location.pathname);
    console.log("ProtectedRoute - User:", currentUser?.email);
    console.log("ProtectedRoute - userRole:", userRole);
    console.log("ProtectedRoute - requiredRole:", requiredRole);
    console.log("ProtectedRoute - User is CEO check:", userRole === 'CEO' || (typeof isCEO === 'function' && isCEO()));
  }, [location.pathname, currentUser, userRole, requiredRole, isCEO]);

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !currentUser) {
    console.log("ProtectedRoute - Redirecting to login, not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // CRITICAL FIX: Always check CEO status first - using multiple methods to be certain
  const userIsCEO = userRole === 'CEO' || (typeof isCEO === 'function' && isCEO());
  
  console.log("ProtectedRoute - CEO ACCESS CHECK:", {
    path: location.pathname,
    userRole,
    isCEOFunction: typeof isCEO === 'function' ? isCEO() : 'not available',
    finalCEOStatus: userIsCEO
  });
  
  // If user is CEO, they can access everything (subject only to voice authentication)
  if (userIsCEO) {
    console.log("ProtectedRoute - CEO ACCESS GRANTED for", location.pathname);
    
    // Voice authentication still applies even for CEO
    if (requireVoiceAuth) {
      if (!isVoiceEnrolled) {
        console.log("ProtectedRoute - CEO needs voice enrollment");
        return <Navigate to="/profile" state={{ from: location, requireVoiceSetup: true }} replace />;
      }
      
      if (!isVoiceAuthenticated) {
        console.log("ProtectedRoute - CEO needs voice authentication");
        return <Navigate to="/voice-login" state={{ from: location }} replace />;
      }
    }
    
    // CEO can access this route
    return children;
  }

  // For non-CEO users, check role-based access
  if (requiredRole) {
    let hasRequiredRole = false;
    
    // Use hasPermission function if available
    if (typeof hasPermission === 'function') {
      try {
        hasRequiredRole = hasPermission(requiredRole);
        console.log("ProtectedRoute - hasPermission check result:", hasRequiredRole);
      } catch (err) {
        console.error("Error in hasPermission check:", err);
        
        // Fallback to manual check
        hasRequiredRole = Array.isArray(requiredRole)
          ? requiredRole.includes(userRole as UserRole)
          : userRole === requiredRole;
          
        console.log("ProtectedRoute - Manual permission check result:", hasRequiredRole);
      }
    } else {
      // Direct check if function not available
      hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.includes(userRole as UserRole)
        : userRole === requiredRole;
        
      console.log("ProtectedRoute - Direct permission check result:", hasRequiredRole);
    }

    if (!hasRequiredRole) {
      console.log("ProtectedRoute - Access denied, redirecting to unauthorized page");
      return <Navigate to="/unauthorized" state={{ from: location, requiredRole }} replace />;
    }
  }

  // Check voice authentication if required
  if (requireVoiceAuth) {
    if (!isVoiceEnrolled) {
      console.log("ProtectedRoute - Voice not enrolled, redirecting to profile");
      return <Navigate to="/profile" state={{ from: location, requireVoiceSetup: true }} replace />;
    }
    
    if (!isVoiceAuthenticated) {
      console.log("ProtectedRoute - Voice not authenticated, redirecting to voice login");
      return <Navigate to="/voice-login" state={{ from: location }} replace />;
    }
  }

  // All checks passed, allow access
  console.log("ProtectedRoute - All checks passed, allowing access to:", location.pathname);
  return children;
};

export default ProtectedRoute;
