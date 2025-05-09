
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  role: string;
}

interface DashboardStats {
  sales: number;
  orders: number;
  customers: number;
}

interface Order {
  id: number;
  customer: string;
  total: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: Order[];
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  dashboardData: DashboardData | null;
  processedCommand?: string;
}

export const useVoiceAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    user: null,
    dashboardData: null
  });
  
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check for existing session on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchDashboardData(storedToken);
    }
    
    // Ensure we have permission for microphone if needed
    const checkMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.log('Microphone permission not granted or not available');
      }
    };
    
    checkMicrophonePermission();
  }, []);
  
  const handleAuthResponse = async (response: any) => {
    // This function would be called when receiving a response from the webhook
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Validate the response from n8n webhook
      if (!response || !response.success) {
        throw new Error(response.message || 'Authentication failed');
      }
      
      // Store token in state and localStorage
      const sessionToken = response.sessionToken;
      setToken(sessionToken);
      localStorage.setItem('auth_token', sessionToken);
      
      // Update auth state
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
        error: null
      }));
      
      toast({
        title: "Authentication Successful",
        description: `Welcome back, ${response.user.name}!`,
      });
      
      // Fetch dashboard data using the authenticated token
      await fetchDashboardData(sessionToken);
      
      return true;
    } catch (error) {
      console.error('Error handling authentication response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      }));
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const fetchDashboardData = async (authToken: string) => {
    try {
      const response = await axios.get('/api/dashboard-data', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (response.data && response.data.success) {
        setAuthState(prevState => ({
          ...prevState,
          dashboardData: response.data.dashboardData,
          processedCommand: response.data.processedCommand
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token expired or invalid
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please authenticate again.",
          variant: "destructive",
        });
        handleLogout();
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      dashboardData: null
    });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return {
    authState,
    handleAuthResponse,
    handleLogout
  };
};
