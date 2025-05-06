
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="rounded-full bg-red-100 p-4 mb-4">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          {user ? (
            <>Your role ({user.role}) does not have permission to access this resource.</>
          ) : (
            <>You don't have permission to access this resource.</>
          )}
        </p>
      </div>
      
      <div className="flex space-x-4">
        <Link to="/">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
