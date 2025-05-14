
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

  // Fetch user role from users table
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching role for user:", userId);
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      console.log("User role data:", data);
      return data?.role as UserRole || null;
    } catch (err) {
      console.error("Exception in fetchUserRole:", err);
      return null;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Set up auth state listener first to avoid missing events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (session) {
              setIsAuthenticated(true);
              setCurrentUser(session.user);
              
              // Get user role from the users table
              const role = await fetchUserRole(session.user.id);
              
              if (role) {
                console.log("Setting user role from database:", role);
                setUserRole(role);
              } else {
                // Fallback to metadata if database query fails
                const metadataRole = session.user.user_metadata?.role;
                console.log("Setting user role from metadata:", metadataRole);
                setUserRole((metadataRole as UserRole) || 'User');
              }
            } else {
              setIsAuthenticated(false);
              setCurrentUser(null);
              setUserRole(null);
            }
            
            // Always update loading state when auth state changes
            setLoading(false);
          }
        );
        
        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setIsAuthenticated(false);
          setCurrentUser(null);
          setUserRole(null);
          setLoading(false);
        } else if (session) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
          
          // Get user role from database
          const role = await fetchUserRole(session.user.id);
          
          if (role) {
            console.log("Setting initial user role from database:", role);
            setUserRole(role);
          } else {
            // Fallback to metadata if database query fails
            const metadataRole = session.user.user_metadata?.role;
            console.log("Setting initial user role from metadata:", metadataRole);
            setUserRole((metadataRole as UserRole) || 'User');
          }
          
          setLoading(false);
        } else {
          setLoading(false);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserRole(null);
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Login function called with email:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
          duration: 5000,
        });
        setLoading(false);
        return false;
      }
      
      console.log("Login successful, session:", data.session ? "exists" : "none");
      
      // If we have a session, set authentication state
      if (data.session) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        
        // Directly fetch user role to ensure we have the latest data
        const userRole = await fetchUserRole(data.user?.id);
        
        if (userRole) {
          console.log("Setting user role after login:", userRole);
          setUserRole(userRole);
        } else {
          // Fallback to metadata if database query fails
          const metadataRole = data.user?.user_metadata?.role || 'User';
          console.log("Setting user role from metadata after login:", metadataRole);
          setUserRole(metadataRole as UserRole);
        }
        
        // Navigate after state is updated
        setTimeout(() => {
          navigate('/');
          setLoading(false);
        }, 100);
        
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
      setLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, role: UserRole = 'User'): Promise<boolean> => {
    try {
      console.log("Signup function called with email:", email, "role:", role);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });
      
      if (error) {
        console.error("Signup error from Supabase:", error);
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
          duration: 5000,
        });
        setLoading(false);
        return false;
      }
      
      console.log("Signup response:", data);
      
      // If automatic confirmation is enabled, this will have a session
      if (data.session) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setUserRole(role);
        
        // Create or update the user record in public.users table
        try {
          const { error: userError } = await supabase
            .from('users')
            .upsert([
              {
                id: data.user?.id,
                email: email,
                role: role
              }
            ]);
          
          if (userError) {
            console.error("Error creating user record:", userError);
          }
        } catch (err) {
          console.error("Error in user record creation:", err);
        }
        
        // Navigate to the dashboard
        console.log("Auto-confirming and redirecting to dashboard");
        navigate('/');
        setLoading(false);
        return true;
      }
      
      // If email confirmation is required
      if (data.user && !data.session) {
        console.log("Email confirmation required");
        toast({
          title: "Signup successful",
          description: "Please check your email for verification instructions.",
          duration: 5000,
        });
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return !!data.user;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
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
        duration: 5000,
      });
    } finally {
      setLoading(false);
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
