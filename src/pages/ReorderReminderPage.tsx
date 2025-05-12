
import React, { useEffect, useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ConsumerReorderReminder from '@/components/ConsumerReorder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useWooOrders, useWooCustomers } from '@/utils/woocommerce';
import { Skeleton } from '@/components/ui/skeleton';

const ReorderReminderPage: React.FC = () => {
  const { user } = useAuth();
  // Fix: Update the hook calls to match the expected number of arguments
  const { orders, isLoading: ordersLoading } = useWooOrders(100); 
  const { customers, isLoading: customersLoading } = useWooCustomers(100);
  
  const [stats, setStats] = useState({
    customersForReorder: 0,
    remindersSent: 0,
    conversionRate: 0,
    conversionTrend: 0
  });
  
  useEffect(() => {
    if (!ordersLoading && !customersLoading && orders && customers) {
      // Calculate customers due for reorder (last purchase > 90 days)
      const today = new Date();
      const customerLastPurchase: Record<number, Date> = {};
      
      // Track the most recent purchase date for each customer
      orders.forEach(order => {
        const customerId = order.customer_id;
        const orderDate = new Date(order.date_created);
        
        if (!customerLastPurchase[customerId] || orderDate > customerLastPurchase[customerId]) {
          customerLastPurchase[customerId] = orderDate;
        }
      });
      
      // Count customers with purchases over 90 days ago
      const customersForReorder = Object.values(customerLastPurchase).filter(date => {
        const daysSince = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return daysSince >= 90;
      }).length;
      
      // For these demo metrics, we'll use some estimated values
      // In a real implementation, these would come from actual reminder tracking
      const remindersSent = Math.min(42, Math.floor(customersForReorder * 1.75));
      const conversionRate = remindersSent > 0 ? Math.floor((remindersSent * 0.62) / remindersSent * 100) : 0;
      
      setStats({
        customersForReorder,
        remindersSent,
        conversionRate,
        conversionTrend: 5 // Mock trend data for now
      });
    }
  }, [orders, customers, ordersLoading, customersLoading]);
  
  const isLoading = ordersLoading || customersLoading;
  
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
                  {isLoading ? (
                    <Skeleton className="h-12 w-24" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold">{stats.customersForReorder}</div>
                      <div className="text-sm text-green-600 flex items-center">
                        ↑ 15% from last month
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Reorder Reminders Sent</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-12 w-24" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold">{stats.remindersSent}</div>
                      <div className="text-sm text-green-600 flex items-center">
                        ↑ 8% from last month
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Reordering Customers</CardTitle>
                  <CardDescription>Conversion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-12 w-24" />
                  ) : (
                    <>
                      <div className="text-3xl font-bold">{stats.conversionRate}%</div>
                      <div className="text-sm text-green-600 flex items-center">
                        ↑ {stats.conversionTrend}% from last month
                      </div>
                    </>
                  )}
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
