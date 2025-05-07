
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ConsumerReorderReminder from '@/components/ConsumerReorderReminder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const ReorderReminderPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">Consumer Reorder Reminders</h1>
              <p className="text-gray-500">Send personalized reorder reminders to customers</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Customers Due for Reorder</CardTitle>
                  <CardDescription>Last 90+ days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm text-green-600 flex items-center">
                    ↑ 15% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Reorder Reminders Sent</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">42</div>
                  <div className="text-sm text-green-600 flex items-center">
                    ↑ 8% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Reordering Customers</CardTitle>
                  <CardDescription>Conversion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">62%</div>
                  <div className="text-sm text-green-600 flex items-center">
                    ↑ 5% from last month
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <ConsumerReorderReminder />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReorderReminderPage;
