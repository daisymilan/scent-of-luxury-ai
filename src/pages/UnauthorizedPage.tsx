import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the route the user was trying to access (if available)
  const fromPath = location.state?.from?.pathname;
  const attemptedRoute = fromPath ? `"${fromPath}"` : 'this resource';
  
  // Determine the role display text
  const roleText = userRole || user?.role || 'Unknown';
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="rounded-full bg-red-100 p-4 mb-4">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          {userRole || user ? (
            <>Your role ({roleText}) does not have permission to access {attemptedRoute}.</>
          ) : (
            <>You don't have permission to access {attemptedRoute}.</>
          )}
        </p>
        
        <div className="mt-4 text-sm text-gray-400 max-w-md">
          <p>If you believe you should have access to this area, please contact your administrator.</p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Link to="/">
          <Button className="flex items-center space-x-2">
            <Home size={16} />
            <span>Go to Dashboard</span>
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;