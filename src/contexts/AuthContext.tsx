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
  isCEO: () => boolean; // New function to explicitly check for CEO role
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>; // New function to update user role
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
  loading: true,
  isCEO: () => false,
  updateUserRole: async () => false
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
        .select('role, email, first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      console.log("User role data:", data);
      
      // Check if the user is you (CEO) by email - customize this check to match your email
      // This is a fallback mechanism if the database role is incorrect
      const yourCEOEmail = "your-ceo-email@example.com"; // Replace with your actual email
      if (data?.email === yourCEOEmail && data?.role !== 'CEO') {
        console.log("Detected CEO by email but role is incorrect, updating...");
        await updateUserRole(userId, 'CEO' as UserRole);
        return 'CEO' as UserRole;
      }
      
      return data?.role as UserRole || null;
    } catch (err) {
      console.error("Exception in fetchUserRole:", err);
      return null;
    }
  };

  // Update user role in database
  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      console.log(`Updating user ${userId} to role: ${role}`);
      
      const { error } = await supabase
        .from('users')
        .update({ 
          role: role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Error updating user role:", error);
        return false;
      }
      
      // Update local state if it's the current user
      if (currentUser && currentUser.id === userId) {
        setUserRole(role);
      }
      
      return true;
    } catch (err) {
      console.error("Error in updateUserRole:", err);
      return false;
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
                
                // If we had to use metadata, try to persist this role to the database
                if (metadataRole) {
                  await updateUserRole(session.user.id, metadataRole as UserRole);
                }
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
            
            // If we had to use metadata, try to persist this role to the database
            if (metadataRole) {
              await updateUserRole(session.user.id, metadataRole as UserRole);
            }
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
          
          // If we had to use metadata, try to persist this role to the database
          if (data.user) {
            await updateUserRole(data.user.id, metadataRole as UserRole);
          }
        }
        
        // Check if this is the CEO's email and force role update if needed
        const yourCEOEmail = "your-ceo-email@example.com"; // Replace with your actual email
        if (email === yourCEOEmail && userRole !== 'CEO' && data.user) {
          console.log("CEO email detected, forcing role update");
          await updateUserRole(data.user.id, 'CEO' as UserRole);
          setUserRole('CEO' as UserRole);
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
      
      // Check if this is the CEO's email and force the role to CEO
      const yourCEOEmail = "your-ceo-email@example.com"; // Replace with your actual email
      if (email === yourCEOEmail) {
        console.log("CEO email detected in signup, forcing role to CEO");
        role = 'CEO' as UserRole;
      }
      
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
                role: role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                first_name: role === 'CEO' ? 'CEO' : '', // Set first name if CEO
                last_name: role === 'CEO' ? 'User' : '',  // Set last name if CEO
                voice_enrolled: false,
                voice_authenticated: false
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

  // IMPROVED Logout function with enhanced error handling and forced redirect
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log("Logout function called");
      
      // First clear local state before API call to ensure UI updates even if API call fails
      const preLogoutState = {
        wasAuthenticated: isAuthenticated,
        wasUser: currentUser,
        wasRole: userRole
      };
      
      // Clear local state immediately
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserRole(null);
      
      // Now call the logout API with global scope to terminate all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Supabase signOut error:", error);
        toast({
          title: 'Logout issue',
          description: "You've been logged out locally, but there was an issue with the server: " + error.message,
          variant: 'destructive',
          duration: 5000,
        });
      } else {
        console.log("Supabase signOut successful");
        toast({
          title: 'Logged out',
          description: "You've been successfully logged out",
          duration: 3000,
        });
      }
      
      // Force browser to clear localStorage related to auth
      try {
        // Clear any relevant localStorage items
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith('supabase.auth.') || key.includes('supabase_auth')) {
            localStorage.removeItem(key);
            console.log(`Removed localStorage item: ${key}`);
          }
        }
      } catch (e) {
        console.warn("Could not clear localStorage", e);
      }
      
      // Force navigation regardless of API response
      console.log("Forcing navigation to login page");
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error instanceof Error ? error.message : 'Failed to logout',
        variant: 'destructive',
        duration: 5000,
      });
      
      // Force navigation even after error
      navigate('/login', { replace: true });
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

  // CEO role check function
  const isCEO = (): boolean => {
    return userRole === 'CEO';
  };

  // Permission checking function - enhanced to prioritize CEO role
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !userRole) return false;
    
    // CEO has access to everything
    if (userRole === 'CEO') return true;
    
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
    loading,
    isCEO,
    updateUserRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);