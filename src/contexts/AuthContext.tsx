
// src/contexts/AuthContext.tsx - Updating User interface

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import supabase from "../supabase";
import voiceAuthService from "../services/voiceAuthService";

// Define user role type
export type UserRole = 'CEO' | 'CCO' | 'Commercial Director' | 'Marketing Manager' | 'Social Media Manager' | 'Regional Manager' | 'Customer Support' | 'User';

// Define user type - ensuring 'name' is required and adding avatar_url property
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string; // Make name required instead of optional
  avatar_url?: string;
}

// Define auth context value type
interface AuthContextValue {
  currentUser: User | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  isVoiceAuthenticated: boolean;
  isVoiceEnrolled: boolean;
  isLoading: boolean;
  user: User | null; // Added for compatibility
  
  // Authentication methods
  register: (email: string, password: string, name: string) => Promise<string>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Voice methods
  authenticateWithVoice: (voiceInput: string) => Promise<boolean>;
  enrollVoice: (voiceSamples: string[]) => Promise<boolean>;
  resetVoiceAuth: () => void;
  hasPermission?: (roles: string | string[]) => boolean; // Added for compatibility
}

// Create the auth context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVoiceAuthenticated, setIsVoiceAuthenticated] = useState<boolean>(false);
  const [isVoiceEnrolled, setIsVoiceEnrolled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Register a new user
  const register = async (email: string, password: string, name: string): Promise<string> => {
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('User not created');
      }
      
      // Return the user ID for voice enrollment
      return data.user.id;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Handle user login
  const login = async (email: string, password: string) => {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('User not found');
      }
      
      // Check if user has voice enrollment from metadata
      setIsVoiceEnrolled(!!data.user.user_metadata?.voice_enrolled);
      
      // Reset voice authentication status
      setIsVoiceAuthenticated(false);
      localStorage.removeItem('voiceAuthenticated');
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setCurrentUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      setIsVoiceAuthenticated(false);
      localStorage.removeItem('voiceAuthenticated');
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Authenticate with voice
  const authenticateWithVoice = async (voiceInput: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // Use either mock or real API based on environment
      const response = import.meta.env.DEV
        ? await voiceAuthService.mockVerifyVoice(voiceInput)
        : await voiceAuthService.verifyVoice(currentUser.id, voiceInput);
      
      if (response.success) {
        setIsVoiceAuthenticated(true);
        localStorage.setItem('voiceAuthenticated', 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Voice authentication error:", error);
      return false;
    }
  };

  // Enroll voice
  const enrollVoice = async (voiceSamples: string[]): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const success = await voiceAuthService.enrollVoice(currentUser.id, voiceSamples);
      
      if (success) {
        setIsVoiceEnrolled(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Voice enrollment error:", error);
      return false;
    }
  };

  // Reset voice authentication
  const resetVoiceAuth = () => {
    setIsVoiceAuthenticated(false);
    localStorage.removeItem('voiceAuthenticated');
  };

  // Check if user has required permission
  const hasPermission = (roles: string | string[]): boolean => {
    if (!currentUser || !userRole) return false;
    
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    return requiredRoles.includes(userRole);
  };

  // Handle auth state changes
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            // Create user object from session
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              role: (session.user.user_metadata?.role as UserRole) || 'User',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatar_url: session.user.user_metadata?.avatar_url
            };
            
            setCurrentUser(user);
            setUserRole(user.role);
            setIsAuthenticated(true);
            setIsVoiceEnrolled(!!session.user.user_metadata?.voice_enrolled);
            
            // Check if voice is already authenticated in this session
            const voiceAuth = localStorage.getItem('voiceAuthenticated');
            setIsVoiceAuthenticated(voiceAuth === 'true');
          } catch (error) {
            console.error("Error handling user session:", error);
            await supabase.auth.signOut();
            setCurrentUser(null);
            setUserRole(null);
            setIsAuthenticated(false);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          setIsVoiceAuthenticated(false);
          setIsLoading(false);
        }
      }
    );
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Create user object from session
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as UserRole) || 'User',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url
        };
        
        setCurrentUser(user);
        setUserRole(user.role);
        setIsAuthenticated(true);
        setIsVoiceEnrolled(!!session.user.user_metadata?.voice_enrolled);
        
        // Check if voice is already authenticated in this session
        const voiceAuth = localStorage.getItem('voiceAuthenticated');
        setIsVoiceAuthenticated(voiceAuth === 'true');
      }
      setIsLoading(false);
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Context value
  const value: AuthContextValue = {
    currentUser,
    userRole,
    isAuthenticated,
    isVoiceAuthenticated,
    isVoiceEnrolled,
    isLoading,
    user: currentUser, // For compatibility
    register,
    login,
    logout,
    authenticateWithVoice,
    enrollVoice,
    resetVoiceAuth,
    hasPermission // For compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
