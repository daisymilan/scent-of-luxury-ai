import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVoiceAuthEnabled: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  enableVoiceAuth: () => void;
  disableVoiceAuth: () => void;
  fetchSession: () => Promise<void>;
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
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email: string, password: string) => {
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
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
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    localStorage.setItem('voiceAuthEnabled', 'true');
    toast({
      title: 'Voice Authentication Enabled',
      description: 'You have enabled voice authentication.',
    });
  };

  const disableVoiceAuth = () => {
    setIsVoiceAuthEnabled(false);
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

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isVoiceAuthEnabled,
    role,
    login,
    signup,
    logout,
    enableVoiceAuth,
    disableVoiceAuth,
    fetchSession,
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
