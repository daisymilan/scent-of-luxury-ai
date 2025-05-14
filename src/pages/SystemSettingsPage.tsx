
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, Info, Loader2 } from 'lucide-react';

const SystemSettingsPage = () => {
  const { userRole, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    // Only check permissions after the auth state is loaded
    if (!loading) {
      console.log("SystemSettingsPage - Current user role:", userRole);
      if (!isAuthenticated) {
        navigate('/login');
      } else if (userRole !== 'CEO') {
        console.log("User is not CEO, redirecting to unauthorized");
        navigate('/unauthorized');
      }
      setCheckingRole(false);
    }
  }, [loading, isAuthenticated, userRole, navigate]);

  // Show loading state while checking permissions
  if (loading || checkingRole) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 size={40} className="animate-spin text-gray-700 mb-4" />
          <h2 className="text-xl font-medium">Verifying permissions...</h2>
        </div>
      </div>
    );
  }

  // If we've passed the check and still on this page, the user is a CEO
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="font-medium">CEO Access Granted</AlertTitle>
        <AlertDescription>
          You are viewing this page because you have CEO privileges.
        </AlertDescription>
      </Alert>
      
      <div className="prose max-w-none">
        <p>As the CEO, you have access to the following system settings:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Global security policies</li>
          <li>Company-wide announcements</li>
          <li>User role management</li>
          <li>Integration configuration</li>
          <li>Data retention policies</li>
        </ul>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
