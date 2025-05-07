import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

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

const VoiceAuthComponent: React.FC = () => {
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
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">MiN NEW YORK Voice Authentication</CardTitle>
        </CardHeader>
        
        <CardContent>
          {authState.isLoading && (
            <div className="flex justify-center p-4">
              <div className="animate-pulse flex space-x-2">
                <div className="h-3 w-3 bg-primary rounded-full"></div>
                <div className="h-3 w-3 bg-primary rounded-full"></div>
                <div className="h-3 w-3 bg-primary rounded-full"></div>
              </div>
              <span className="ml-3 text-sm text-muted-foreground">Processing authentication...</span>
            </div>
          )}
          
          {authState.error && (
            <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm mb-3">
              Error: {authState.error}
            </div>
          )}
          
          {!authState.isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Please authenticate using your voice through the microphone button above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-medium">Welcome, {authState.user?.name}</h3>
                  <p className="text-sm text-muted-foreground">Role: {authState.user?.role}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
              
              {authState.processedCommand && (
                <div className="bg-muted p-2 rounded-md text-sm">
                  <p>Your command: "{authState.processedCommand}"</p>
                </div>
              )}
              
              {authState.dashboardData && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wide">Dashboard Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-primary/5">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground">Sales</p>
                        <p className="text-2xl font-semibold">${authState.dashboardData.stats.sales.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-primary/5">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="text-2xl font-semibold">{authState.dashboardData.stats.orders}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-primary/5">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground">Customers</p>
                        <p className="text-2xl font-semibold">{authState.dashboardData.stats.customers}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="rounded-md border">
                    <h4 className="px-4 py-2 text-sm font-medium">Recent Orders</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {authState.dashboardData.recentOrders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell className="text-right">${order.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAuthComponent;
