
import React from 'react';
import { UserWelcome } from '@/components/voice-auth/UserWelcome';
import { DashboardStats } from '@/components/voice-auth/DashboardStats';

interface User {
  id: string;
  name: string;
  role: string;
}

interface DashboardData {
  stats: {
    sales: number;
    orders: number;
    customers: number;
  };
  recentOrders: {
    id: number;
    customer: string;
    total: number;
  }[];
}

interface AuthContentProps {
  user: User;
  dashboardData: DashboardData | null;
  processedCommand?: string;
  onLogout: () => void;
}

export const AuthContent: React.FC<AuthContentProps> = ({ 
  user, 
  dashboardData, 
  processedCommand, 
  onLogout 
}) => {
  return (
    <div className="space-y-4">
      <UserWelcome user={user} onLogout={onLogout} />
      
      {dashboardData && (
        <DashboardStats 
          stats={dashboardData.stats} 
          recentOrders={dashboardData.recentOrders}
          processedCommand={processedCommand}
        />
      )}
    </div>
  );
};
