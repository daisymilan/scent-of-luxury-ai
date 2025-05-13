// src/components/ProtectedRoute.tsx - NEW FILE

import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVoiceAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireVoiceAuth = false 
}) => {
  // Check if user is authenticated via token
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Check if voice authentication is required and completed
  const isVoiceAuthenticated = localStorage.getItem('voiceAuthenticated') === 'true';
  
  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If voice authentication is required but not completed, redirect to voice login
  if (requireVoiceAuth && !isVoiceAuthenticated) {
    return <Navigate to="/voice-login" replace />;
  }
  
  // User is authenticated and meets voice auth requirements if needed
  return <>{children}</>;
};

export default ProtectedRoute;