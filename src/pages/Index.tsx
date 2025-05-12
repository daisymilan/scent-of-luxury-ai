
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { useWooStats, useWooOrders, useWooProducts, useWooCustomers } from '@/utils/woocommerce';
import B2BLeadGeneration from '@/components/B2BLeadGeneration';
import SEODashboard from '@/components/SEODashboard';
import AbandonedCartRecovery from '@/components/AbandonedCartRecovery';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
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

  // Fetch data from WooCommerce API for all components
  const { stats, isLoading: isStatsLoading } = useWooStats('week');
  const { orders, isLoading: isOrdersLoading } = useWooOrders(50); // Increased to get more data
  const { products, isLoading: isProductsLoading } = useWooProducts(50); // Increased to get more data
  const { customers, isLoading: isCustomersLoading } = useWooCustomers(50); // Fetch customers for B2B

  const isLoading = isStatsLoading || isOrdersLoading || isProductsLoading || isCustomersLoading;

  // Filter abandoned orders and prepare data for AbandonedCartRecovery component
  const abandonedOrders = orders ? orders.filter(order => order.status === 'pending' || order.status === 'on-hold') : [];

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
          <button 
            className={`px-6 py-3 ${activeTab === 'overview' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'} font-medium`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-6 py-3 ${activeTab === 'b2b' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'} font-medium`}
            onClick={() => setActiveTab('b2b')}
          >
            B2B Leads
          </button>
          <button 
            className={`px-6 py-3 ${activeTab === 'seo' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'} font-medium`}
            onClick={() => setActiveTab('seo')}
          >
            SEO
          </button>
          <button 
            className={`px-6 py-3 ${activeTab === 'carts' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'} font-medium`}
            onClick={() => setActiveTab('carts')}
          >
            Abandoned Carts
          </button>
        </nav>
      </div>
      
      <div className="space-y-8">
        {activeTab === 'overview' && <KpiOverview />}
        
        {activeTab === 'b2b' && (
          <B2BLeadGeneration 
            wooCustomers={customers} 
            wooOrders={orders}
            wooProducts={products}
          />
        )}
        
        {activeTab === 'seo' && (
          <SEODashboard 
            categories={products?.reduce((acc, product) => {
              if (product.categories) {
                product.categories.forEach(cat => {
                  if (!acc.some(c => c.id === cat.id)) {
                    acc.push(cat);
                  }
                });
              }
              return acc;
            }, [])}
            productsWithSEO={products}
          />
        )}
        
        {activeTab === 'carts' && (
          <AbandonedCartRecovery 
            wooOrders={abandonedOrders}
            wooProducts={products}
            wooCustomers={customers}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
