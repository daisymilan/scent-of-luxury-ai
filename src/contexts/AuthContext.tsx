// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import voiceAuthService from '../services/voiceAuthService';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  voiceEnrollmentComplete?: boolean;
}

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isVoiceEnrolled: boolean;
  isVoiceAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithVoice: (voiceInput: string) => Promise<boolean>;
  logout: () => void;
  enrollVoice: (voiceSamples: string[]) => Promise<boolean>;
  checkVoiceAuth: () => Promise<boolean>;
}

// Default context value
const defaultContextValue: AuthContextType = {
  user: null,
  status: 'idle',
  isAuthenticated: false,
  isVoiceEnrolled: false,
  isVoiceAuthenticated: false,
  login: async () => false,
  loginWithVoice: async () => false,
  logout: () => {},
  enrollVoice: async () => false,
  checkVoiceAuth: async () => false
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [isVoiceEnrolled, setIsVoiceEnrolled] = useState<boolean>(false);
  const [isVoiceAuthenticated, setIsVoiceAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setStatus('loading');
      
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setStatus('unauthenticated');
          return;
        }
        
        // Validate token with backend
        // For demo purposes, we'll just check if it exists
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (userData && userData.id) {
          setUser(userData);
          setStatus('authenticated');
          
          // Check voice enrollment status
          if (userData.id) {
            try {
              const voiceStatus = await voiceAuthService.getVoiceAuthStatus(userData.id);
              setIsVoiceEnrolled(voiceStatus.isEnrolled);
              
              // Check if voice is recently authenticated
              const voiceAuth = localStorage.getItem('voiceAuthenticated');
              setIsVoiceAuthenticated(voiceAuth === 'true');
            } catch (error) {
              console.error('Error checking voice status:', error);
            }
          }
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setStatus('unauthenticated');
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login with email/password
  const login = async (email: string, password: string): Promise<boolean> => {
    setStatus('loading');
    
    try {
      // This would be your actual API call
      // For demo, we'll simulate a successful login
      const mockUser = {
        id: '12345',
        email,
        name: email.split('@')[0],
        voiceEnrollmentComplete: Math.random() > 0.5 // Random for demo
      };
      
      // Store auth data
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setStatus('authenticated');
      setIsVoiceEnrolled(!!mockUser.voiceEnrollmentComplete);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setStatus('unauthenticated');
      return false;
    }
  };

  // Login with voice
  const loginWithVoice = async (voiceInput: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await voiceAuthService.verifyVoice(user.id, voiceInput);
      
      if (response.success) {
        setIsVoiceAuthenticated(true);
        localStorage.setItem('voiceAuthenticated', 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Voice login error:', error);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('voiceAuthenticated');
    
    setUser(null);
    setStatus('unauthenticated');
    setIsVoiceAuthenticated(false);
  };

  // Enroll voice
  const enrollVoice = async (voiceSamples: string[]): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await voiceAuthService.enrollVoice(user.id, voiceSamples);
      
      if (success) {
        setIsVoiceEnrolled(true);
        
        // Update user data
        const updatedUser = { ...user, voiceEnrollmentComplete: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Voice enrollment error:', error);
      return false;
    }
  };

  // Check voice authentication status
  const checkVoiceAuth = async (): Promise<boolean> => {
    const voiceAuth = localStorage.getItem('voiceAuthenticated');
    const isAuth = voiceAuth === 'true';
    
    setIsVoiceAuthenticated(isAuth);
    return isAuth;
  };

  // Calculate derived state
  const isAuthenticated = status === 'authenticated';

  // Context value
  const value: AuthContextType = {
    user,
    status,
    isAuthenticated,
    isVoiceEnrolled,
    isVoiceAuthenticated,
    login,
    loginWithVoice,
    logout,
    enrollVoice,
    checkVoiceAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;