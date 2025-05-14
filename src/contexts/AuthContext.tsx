
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the UserRole type and export it
export type UserRole = 'CEO' | 'CCO' | 'Commercial Director' | 'Regional Manager' | 'Marketing Manager' | 
                      'Social Media Manager' | 'Customer Support' | string | null;

interface AuthContextType {
  user: any;
  currentUser: any; // Added for ProtectedRoute
  isAuthenticated: boolean;
  isLoading: boolean;
  isVoiceAuthEnabled: boolean;
  isVoiceAuthenticated: boolean; // Added for ProtectedRoute
  isVoiceEnrolled: boolean; // Added for voice auth checks
  role: string | null;
  userRole: UserRole; // Added for ProtectedRoute
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>; // Alias for signup
  logout: () => Promise<void>;
  enableVoiceAuth: () => void;
  disableVoiceAuth: () => void;
  fetchSession: () => Promise<void>;
  authenticateWithVoice: (transcript: string) => Promise<boolean>; // Added for voice auth
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean; // Added for SystemSettingsPage
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVoiceAuthEnabled, setIsVoiceAuthEnabled] = useState<boolean>(false);
  const [isVoiceAuthenticated, setIsVoiceAuthenticated] = useState<boolean>(false);
  const [isVoiceEnrolled, setIsVoiceEnrolled] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSession();
    
    // Check if voice auth is enabled from localStorage
    const voiceAuthEnabled = localStorage.getItem('voiceAuthEnabled') === 'true';
    setIsVoiceAuthEnabled(voiceAuthEnabled);
    
    // For demo purposes, simulate voice enrollment if voice auth is enabled
    if (voiceAuthEnabled) {
      setIsVoiceEnrolled(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      } else {
        console.log('Login successful:', data.user);
        setUser(data.user);
        setIsAuthenticated(true);
        setRole(data.user?.role || null);
        navigate('/');
        toast({
          title: 'Login successful',
          description: 'You have successfully logged in.',
        });
        return true;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      } else {
        console.log('Signup successful:', data.user);
        setUser(data.user);
        setIsAuthenticated(true);
        setRole(data.user?.role || null);
        navigate('/');
        toast({
          title: 'Signup successful',
          description: 'Please check your email to verify your account.',
        });
        return true;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Alias for signup
  const register = signup;

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error.message);
        toast({
          title: 'Logout failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Logout successful');
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
        setIsVoiceAuthenticated(false);
        navigate('/login');
        toast({
          title: 'Logout successful',
          description: 'You have successfully logged out.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const enableVoiceAuth = () => {
    setIsVoiceAuthEnabled(true);
    setIsVoiceEnrolled(true); // For demo purposes
    localStorage.setItem('voiceAuthEnabled', 'true');
    toast({
      title: 'Voice Authentication Enabled',
      description: 'You have enabled voice authentication.',
    });
  };

  const disableVoiceAuth = () => {
    setIsVoiceAuthEnabled(false);
    setIsVoiceAuthenticated(false);
    localStorage.removeItem('voiceAuthEnabled');
    toast({
      title: 'Voice Authentication Disabled',
      description: 'You have disabled voice authentication.',
    });
  };

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        console.log('Session found:', session.user);
        setUser(session.user);
        setIsAuthenticated(true);
        setRole(session.user.app_metadata.role || null);
      } else {
        console.log('No session found');
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add voice authentication function
  const authenticateWithVoice = async (transcript: string): Promise<boolean> => {
    console.log('Authenticating with voice:', transcript);
    
    // Mock implementation - in a real app, this would call a voice authentication service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, consider authentication successful
      setIsVoiceAuthenticated(true);
      toast({
        title: 'Voice Authentication Successful',
        description: 'Voice identity confirmed.',
      });
      return true;
    } catch (error) {
      console.error('Voice authentication error:', error);
      toast({
        title: 'Voice Authentication Failed',
        description: 'Could not verify voice identity.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add hasPermission function
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role as UserRole);
    }
    
    return role === requiredRole;
  };

  const value: AuthContextType = {
    user,
    currentUser: user, // Map user to currentUser for compatibility
    isAuthenticated,
    isLoading,
    isVoiceAuthEnabled,
    isVoiceAuthenticated,
    isVoiceEnrolled,
    role,
    userRole: role as UserRole, // Map role to userRole for compatibility
    login,
    signup,
    register, // Alias for signup
    logout,
    enableVoiceAuth,
    disableVoiceAuth,
    fetchSession,
    authenticateWithVoice,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
