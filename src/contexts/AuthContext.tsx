import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth, SupabaseClient, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/types/supabase';

export type User = Database['public']['Tables']['users']['Row'];
export type UserRole = 'CEO' | 'CCO' | 'Commercial Director' | 'Regional Manager' | 'Marketing Manager' | 'User';

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

// The interface for the AuthContext
export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData?: Record<string, any>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserMetadata: (metadata: UserMetadata) => Promise<void>;
  isVoiceEnrolled: boolean;
  authenticateWithVoice: (voiceInput: string) => Promise<boolean>;
  resetVoiceAuth: () => void;
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
  const supabase = useSupabaseClient<Database>();
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
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

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
      setIsVoiceEnrolled(user?.voice_enrolled || false);
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

      return true;
    } catch (error) {
      console.error('Voice authentication error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset voice authentication status
  const resetVoiceAuth = () => {
    updateUserMetadata({
      voice_authenticated: false,
      last_voice_auth: null,
    });
  };

  // Provide the auth context value
  const value: AuthContextType = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserMetadata,
    isVoiceEnrolled,
    authenticateWithVoice,
    resetVoiceAuth
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
