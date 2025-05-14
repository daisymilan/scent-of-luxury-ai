
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  name?: string; // Add name property
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'INITIAL_SESSION') {
        // Skip initial session event
        return;
      }
      
      if (session) {
        setIsAuthenticated(true);
        // Use setTimeout to avoid potential deadlocks with onAuthStateChange
        setTimeout(() => {
          loadCurrentUser(session.user.id);
        }, 0);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserRole(null);
      }
    });

    // THEN check for existing session
    const loadSession = async () => {
      setIsLoading(true);
      try {
        console.log("Loading session from Supabase");
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Current session:", session);
        
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

      if (user) {
        // Construct a proper User object with all required properties
        const processedUser: User = {
          ...user,
          name: user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}` 
            : user.first_name || user.email?.split('@')[0] || 'User',
          role: (user.role as UserRole) || 'User' // Ensure role is cast to UserRole
        };
        
        setCurrentUser(processedUser);
        setUserRole(processedUser.role || null);
        setIsVoiceEnrolled(!!processedUser.voice_enrolled);
        setIsVoiceAuthenticated(!!processedUser.voice_authenticated);

        console.log("User loaded successfully:", processedUser);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  // Login function - completely rebuilt for reliability
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Login attempt for:", email);
      
      // Clear any previous session to avoid conflicts
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login failed:', error.message);
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log("Auth response:", data);
      
      if (data.user && data.session) {
        console.log("Login successful for:", email);
        
        // Log user and session data for debugging
        console.log("User:", data.user);
        console.log("Session:", data.session);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // We successfully logged in, navigate user to home
        navigate('/');
        return true;
      } else {
        console.error("Login returned no user or session");
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Register function - Fixed to work with the users table
  const register = async (email: string, password: string, userData?: Record<string, any>): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Register attempt for:", email, "with user data:", userData);
      
      // First, sign up the user with Supabase Auth
      const { data: authResponse, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.firstName,
            last_name: userData?.lastName,
            role: userData?.role || 'User'
          }
        }
      });

      if (authError) {
        console.error('Registration failed:', authError.message);
        toast({
          title: "Registration failed",
          description: authError.message,
          variant: "destructive"
        });
        return false;
      }

      if (!authResponse.user) {
        console.error('Registration failed: No user returned');
        toast({
          title: "Registration failed",
          description: "Could not create your account. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      // Now insert the user data into our users table
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authResponse.user.id,
            email: email,
            first_name: userData?.firstName || '',
            last_name: userData?.lastName || '',
            avatar_url: userData?.avatar_url || '',
            role: userData?.role || 'User',
            fragrancepreference: userData?.fragrancePreference || '',
            fragrancestyle: userData?.fragranceStyle || '',
            fragrancestrength: userData?.fragranceStrength || ''
          },
        ]);

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        // If user table insert fails, we should still continue as the auth user was created
        // Just log the error but don't fail registration
        toast({
          title: "Profile creation warning",
          description: "Account created but profile data could not be saved.",
          variant: "warning"
        });
      } else {
        console.log("User profile created successfully for:", email);
      }

      setIsAuthenticated(true);
      
      // Create a basic user object until the full profile loads
      const basicUser: User = {
        id: authResponse.user.id,
        email: email,
        first_name: userData?.firstName || '',
        last_name: userData?.lastName || '',
        role: (userData?.role as UserRole) || 'User',
        name: userData?.firstName && userData?.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : userData?.firstName || email.split('@')[0] || 'User'
      };
      
      setCurrentUser(basicUser);
      setUserRole((userData?.role as UserRole) || 'User');
      
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
      
      // Navigate to home after successful registration
      navigate('/');
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
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
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to log out.';
      toast({
        title: "Logout failed",
        description: errorMessage,
        variant: "destructive"
      });
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
      last_voice_auth: undefined,
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
