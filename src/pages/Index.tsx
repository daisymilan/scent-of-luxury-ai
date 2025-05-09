
// Update import statements to properly use the DashboardHeader component
// Make sure the component accepts a title prop
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import RecentOrdersTable from '@/components/RecentOrdersTable';

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader heading="MIN NEW YORK Dashboard" />
      
      <div className="space-y-8">
        <KpiOverview />
        <RecentOrdersTable />
      </div>
    </div>
  );
};

export default Index;
