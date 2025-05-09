
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import RecentOrdersTable from '@/components/RecentOrdersTable';

// Mock data for recent orders
const mockOrders = [
  {
    orderId: 123456,
    customerName: 'John Smith',
    orderDate: '2025-05-01',
    totalAmount: 129.99,
    status: 'Delivered'
  },
  {
    orderId: 123457,
    customerName: 'Sarah Johnson',
    orderDate: '2025-05-03',
    totalAmount: 79.50,
    status: 'Shipped'
  },
  {
    orderId: 123458,
    customerName: 'Michael Brown',
    orderDate: '2025-05-05',
    totalAmount: 249.99,
    status: 'Processing'
  },
  {
    orderId: 123459,
    customerName: 'Emily Davis',
    orderDate: '2025-05-07',
    totalAmount: 54.25,
    status: 'Delivered'
  }
];

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader heading="MIN NEW YORK Dashboard" />
      
      <div className="space-y-8">
        <KpiOverview />
        <RecentOrdersTable orders={mockOrders} />
      </div>
    </div>
  );
};

export default Index;
