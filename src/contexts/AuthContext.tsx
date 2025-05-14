
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase'; // Use the existing supabase client

export type UserRole = 'CEO' | 'CCO' | 'Commercial Director' | 'Regional Manager' | 'Marketing Manager' | 'User' | 'Social Media Manager' | 'Customer Support';

// Define the structure of user metadata
interface UserMetadata {
  firstName?: string;
  lastName?: string;
  avatar_url?: string;
  voice_enrolled?: boolean;
  voice_authenticated?: boolean;
  last_voice_auth?: string;
  role?: UserRole;
  fragrancePreference?: string;
  fragranceStyle?: string;
  fragranceStrength?: string;
}

// Define the User type since we don't have @/types/supabase
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: UserRole;
  voice_enrolled?: boolean;
  voice_authenticated?: boolean;
  last_voice_auth?: string;
  fragrancePreference?: string;
  fragranceStyle?: string;
  fragranceStrength?: string;
  created_at?: string;
  updated_at?: string;
}

// The interface for the AuthContext
export interface AuthContextType {
  currentUser: User | null;
  user: User | null; // Alias for currentUser for backward compatibility
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null; // Add userRole to match what components expect
  isVoiceAuthenticated: boolean; // Add isVoiceAuthenticated
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData?: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserMetadata: (metadata: UserMetadata) => Promise<void>;
  isVoiceEnrolled: boolean;
  authenticateWithVoice: (voiceInput: string) => Promise<boolean>;
  resetVoiceAuth: () => void;
  hasPermission: (requiredRole: string | string[]) => boolean; // Add hasPermission method
  enrollVoice?: (data: any) => Promise<boolean>; // Add enrollVoice
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVoiceEnrolled, setIsVoiceEnrolled] = useState<boolean>(false);
  const [isVoiceAuthenticated, setIsVoiceAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  // Load user data on mount
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          await loadCurrentUser(session.user.id);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') {
        // Skip initial session event
        return;
      }
      
      if (session) {
        setIsAuthenticated(true);
        await loadCurrentUser(session.user.id);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserRole(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load current user data
  const loadCurrentUser = async (userId: string) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      setCurrentUser(user);
      setUserRole(user?.role as UserRole || null);
      setIsVoiceEnrolled(user?.voice_enrolled || false);
      setIsVoiceAuthenticated(user?.voice_authenticated || false);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data: authResponse, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login failed:', error.message);
        return false;
      }

      if (authResponse.user) {
        setIsAuthenticated(true);
        await loadCurrentUser(authResponse.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, userData?: Record<string, any>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data: authResponse, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            avatar_url: userData?.avatar_url || '',
            role: userData?.role || 'User',
          },
        },
      });

      if (error) {
        console.error('Registration failed:', error.message);
        return false;
      }

      if (authResponse.user) {
        setIsAuthenticated(true);

        // Create a user profile in the 'users' table
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authResponse.user.id,
              email: email,
              first_name: userData?.firstName || '',
              last_name: userData?.lastName || '',
              avatar_url: userData?.avatar_url || '',
              role: userData?.role || 'User',
              fragrancePreference: userData?.fragrancePreference || '',
              fragranceStyle: userData?.fragranceStyle || '',
              fragranceStrength: userData?.fragranceStrength || ''
            },
          ]);

        if (userError) {
          console.error('Error creating user profile:', userError);
          return false;
        }

        await loadCurrentUser(authResponse.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserRole(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user metadata
  const updateUserMetadata = async (metadata: UserMetadata): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) {
        console.error('Update user metadata failed:', error.message);
      } else {
        // Refresh current user data after updating metadata
        if (currentUser?.id) {
          await loadCurrentUser(currentUser.id);
        }
      }
    } catch (error) {
      console.error('Update user metadata error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Authenticate with voice
  const authenticateWithVoice = async (voiceInput: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate voice authentication (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Set voice authentication status in user metadata
      await updateUserMetadata({
        voice_authenticated: true,
        last_voice_auth: new Date().toISOString(),
      });

      setIsVoiceAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Voice authentication error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Enroll voice
  const enrollVoice = async (data: any): Promise<boolean> => {
    try {
      // Simulate voice enrollment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update user metadata
      await updateUserMetadata({
        voice_enrolled: true
      });
      
      setIsVoiceEnrolled(true);
      return true;
    } catch (error) {
      console.error('Voice enrollment error:', error);
      return false;
    }
  };

  // Reset voice authentication status
  const resetVoiceAuth = () => {
    updateUserMetadata({
      voice_authenticated: false,
      last_voice_auth: null,
    });
    setIsVoiceAuthenticated(false);
  };

  // Check if user has a required role
  const hasPermission = (requiredRole: string | string[]): boolean => {
    if (!userRole) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
  };

  // Provide the auth context value
  const value: AuthContextType = {
    currentUser,
    user: currentUser, // Alias for backward compatibility
    userRole,
    isAuthenticated,
    isLoading,
    isVoiceAuthenticated,
    login,
    register,
    logout,
    updateUserMetadata,
    isVoiceEnrolled,
    authenticateWithVoice,
    resetVoiceAuth,
    hasPermission,
    enrollVoice
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
