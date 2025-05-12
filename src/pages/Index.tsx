
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { user } = useAuth();
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(currentDate);

  return (
    <div className="container mx-auto px-4 pb-8">
      <DashboardHeader />
      
      <div className="py-6">
        <h1 className="text-3xl font-normal mb-1">MiN NEW YORK {user?.role} Dashboard</h1>
        <p className="text-gray-600">Welcome back to your luxury fragrance dashboard, {user?.name}</p>
        <div className="text-sm text-gray-500 mt-4 text-right">Last updated: {formattedDate}</div>
      </div>
      
      <div className="mb-8">
        <nav className="flex border-b border-gray-200">
          <button className="px-6 py-3 bg-black text-white font-medium">
            Overview
          </button>
          <button className="px-6 py-3 text-gray-600 hover:bg-gray-50">
            B2B Leads
          </button>
          <button className="px-6 py-3 text-gray-600 hover:bg-gray-50">
            SEO
          </button>
          <button className="px-6 py-3 text-gray-600 hover:bg-gray-50">
            Abandoned Carts
          </button>
        </nav>
      </div>
      
      <div className="space-y-8">
        <KpiOverview />
      </div>
    </div>
  );
};

export default Index;
