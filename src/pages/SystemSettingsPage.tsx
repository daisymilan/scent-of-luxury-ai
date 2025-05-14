import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SystemSettingsPage = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!hasPermission('CEO')) {
    navigate('/unauthorized');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>
      <p>Only CEOs can access this page.</p>
    </div>
  );
};

export default SystemSettingsPage;
