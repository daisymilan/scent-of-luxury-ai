
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define user roles as string literals to match the ones used in the codebase
export type UserRole = 
  | 'CEO' 
  | 'CCO' 
  | 'Commercial Director' 
  | 'Regional Manager' 
  | 'Marketing Manager' 
  | 'Social Media Manager' 
  | 'Customer Support' 
  | 'User';

// Create an enum for backwards compatibility
export enum UserRoleEnum {
  CEO = 'CEO',
  CCO = 'CCO',
  CommercialDirector = 'Commercial Director',
  RegionalManager = 'Regional Manager',
  MarketingManager = 'Marketing Manager',
  SocialMediaManager = 'Social Media Manager',
  CustomerSupport = 'Customer Support',
  User = 'User'
}

// Define authentication context type
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (email: string, password: string, role?: UserRole) => Promise<boolean>; // Alias for signup
  currentUser: any | null;
  user: any | null; // Alias for currentUser for backward compatibility
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
  user: null,
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
        
        // Fetch user details including role from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          setUserRole('User' as UserRole); // Default role
        } else {
          setUserRole((userData?.role as UserRole) || 'User' as UserRole);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    };
    
    checkAuthStatus();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
          
          // Get user role from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user data:', userError);
            setUserRole('User' as UserRole); // Default role
          } else {
            setUserRole((userData?.role as UserRole) || 'User' as UserRole);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
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
      setIsAuthenticated(!!data.session);
      if (data.user) {
        setCurrentUser(data.user);
      
        // Get user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();
      
        if (userError) {
          console.error('Error fetching user data:', userError);
          setUserRole('User' as UserRole); // Default role
        } else {
          setUserRole((userData?.role as UserRole) || 'User' as UserRole);
        }
      }
      
      // If we have a session, navigate to the dashboard
      if (data.session) {
        navigate('/');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, role: UserRole = 'User'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });
      
      if (error) throw error;
      
      // Success! Set user if auto-confirm is enabled
      if (data.session) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setUserRole(role);
        navigate('/');
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
    user: currentUser, // Add user as alias to currentUser for compatibility
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
