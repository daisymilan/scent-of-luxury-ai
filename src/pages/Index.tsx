
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

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
        <RecentOrdersTable orders={mockOrders} />
      </div>
    </div>
  );
};

export default Index;
