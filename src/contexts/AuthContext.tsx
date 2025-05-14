import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define user roles
export enum UserRole {
  CEO = 'CEO',
  CCO = 'CCO',
  CommercialDirector = 'Commercial Director',
  RegionalManager = 'Regional Manager',
  MarketingManager = 'Marketing Manager',
  SocialMediaManager = 'SocialMediaManager',
  CustomerSupport = 'CustomerSupport',
  User = 'User'
}

// Define authentication context type
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>; // Alias for signup
  currentUser: any | null;
  userRole: UserRole | null;
  isVoiceAuthenticated: boolean;
  isVoiceEnrolled: boolean;
  authenticateWithVoice: (voiceData: any) => Promise<boolean>;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  loading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  signup: async () => false,
  register: async () => false,
  currentUser: null,
  userRole: null,
  isVoiceAuthenticated: false,
  isVoiceEnrolled: false,
  authenticateWithVoice: async () => false,
  hasPermission: () => false,
  loading: true
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isVoiceAuthenticated, setIsVoiceAuthenticated] = useState(false);
  const [isVoiceEnrolled, setIsVoiceEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
      }
      
      if (session) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        
        // Fetch user details including role from the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setUserRole(UserRole.User); // Default role
        } else {
          setUserRole(profileData?.role || UserRole.User);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, [navigate]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Set authenticated state
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      
      // Get user role from metadata or set default
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setUserRole(UserRole.User); // Default role
      } else {
        setUserRole(profileData?.role || UserRole.User);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Success! Set user if auto-confirm is enabled
      if (data.session) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setUserRole(UserRole.User); // Default role for new users
      }
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserRole(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error instanceof Error ? error.message : 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  // Voice authentication function
  const authenticateWithVoice = async (voiceData: any): Promise<boolean> => {
    // Placeholder implementation
    console.log('Voice authentication triggered with data:', voiceData);
    setIsVoiceAuthenticated(true);
    return true; // Return true for now as placeholder
  };

  // Permission checking function
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !userRole) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    signup,
    register: signup, // Alias register to signup for compatibility
    currentUser,
    userRole,
    isVoiceAuthenticated,
    isVoiceEnrolled,
    authenticateWithVoice,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
