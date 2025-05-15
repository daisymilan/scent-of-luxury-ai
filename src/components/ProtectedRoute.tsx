
// src/components/ProtectedRoute.tsx - FIXED VERSION FOR CEO ACCESS

import { ReactElement, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../contexts/AuthContext"; // Import your UserRole type

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
    hasPermission, // Use the hasPermission function from AuthContext
    isCEO // Use the new isCEO function from AuthContext
  } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("ProtectedRoute - Path:", location.pathname);
    console.log("ProtectedRoute - User:", currentUser?.email);
    console.log("ProtectedRoute - userRole:", userRole);
    console.log("ProtectedRoute - requiredRole:", requiredRole);
    
    // Check if CEO by various methods
    console.log("ProtectedRoute - Is CEO by role match:", userRole === 'CEO');
    if (typeof isCEO === 'function') {
      console.log("ProtectedRoute - Is CEO by function:", isCEO());
    }
    
    // Check permission status
    if (requiredRole) {
      if (typeof hasPermission === 'function') {
        console.log("ProtectedRoute - hasPermission result:", hasPermission(requiredRole));
      } else {
        // Manual check
        const manualCheck = Array.isArray(requiredRole) 
          ? requiredRole.includes(userRole as any) 
          : userRole === requiredRole;
        console.log("ProtectedRoute - Manual role check:", manualCheck);
      }
    }
  }, [location.pathname, currentUser, userRole, requiredRole, hasPermission, isCEO]);

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !currentUser) {
    console.log("ProtectedRoute - Redirecting to login, not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // CRITICAL FIX: Always check CEO status first before any other role checks
  // Use both direct role comparison and the isCEO function for redundancy
  const userIsCEO = userRole === 'CEO' || (typeof isCEO === 'function' && isCEO());
  
  // ENHANCED CEO DEBUG LOGGING
  console.log(`ProtectedRoute - CEO CHECK FOR ${location.pathname}:`);
  console.log(`- userRole === 'CEO': ${userRole === 'CEO'}`);
  console.log(`- isCEO function exists: ${typeof isCEO === 'function'}`);
  console.log(`- isCEO function result: ${typeof isCEO === 'function' ? isCEO() : 'N/A'}`);
  console.log(`- Final userIsCEO determination: ${userIsCEO}`);
  
  if (userIsCEO) {
    console.log("ProtectedRoute - User is CEO, allowing access to:", location.pathname);
    
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
    
    return children;
  }

  // For non-CEO users, check role-based access if required
  if (requiredRole) {
    let hasRequiredRole = false;
    
    // Try using hasPermission function first
    if (typeof hasPermission === 'function') {
      try {
        hasRequiredRole = hasPermission(requiredRole);
      } catch (err) {
        console.error("Error in hasPermission check:", err);
        // Fallback to manual check if function fails
        hasRequiredRole = Array.isArray(requiredRole)
          ? requiredRole.includes(userRole as any)
          : userRole === requiredRole;
      }
    } else {
      // Fallback if hasPermission is not available
      hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.includes(userRole as any)
        : userRole === requiredRole;
    }

    if (!hasRequiredRole) {
      console.log("ProtectedRoute - Role check failed", {
        required: requiredRole,
        actual: userRole,
        path: location.pathname
      });
      return <Navigate to="/unauthorized" state={{ from: location, requiredRole }} replace />;
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

  // All checks passed, allow access
  console.log("ProtectedRoute - All checks passed, allowing access to:", location.pathname);
  return children;
};

export default ProtectedRoute;
