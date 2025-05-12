
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { useWooStats, useWooOrders, useWooProducts, useWooCustomers, getWooCommerceConfig, testWooCommerceConnection } from '@/utils/woocommerce';
import B2BLeadGeneration from '@/components/B2BLeadGeneration';
import SEODashboard from '@/components/SEODashboard';
import AbandonedCartRecovery from '@/components/AbandonedCartRecovery';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiConnectionStatus, setApiConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
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

  // Check if WooCommerce is configured
  const wooConfig = getWooCommerceConfig();
  const [wooConfigured, setWooConfigured] = useState(!!wooConfig);

  // Test API connection when component mounts
  useEffect(() => {
    if (wooConfigured) {
      testWooCommerceConnection()
        .then(connected => {
          setApiConnectionStatus(connected ? 'connected' : 'failed');
        })
        .catch(() => {
          setApiConnectionStatus('failed');
        });
    } else {
      setApiConnectionStatus('failed');
    }
  }, [wooConfigured]);

  // Fetch data from WooCommerce API for all components
  const { stats, isLoading: isStatsLoading, error: statsError } = useWooStats('week');
  const { orders, isLoading: isOrdersLoading, error: ordersError } = useWooOrders(50); // Increased to get more data
  const { products, isLoading: isProductsLoading, error: productsError } = useWooProducts(50); // Increased to get more data
  const { customers, isLoading: isCustomersLoading, error: customersError } = useWooCustomers(50); // Fetch customers for B2B

  const isLoading = isStatsLoading || isOrdersLoading || isProductsLoading || isCustomersLoading;
  const hasError = !!(statsError || ordersError || productsError || customersError);
  const errorMessage = statsError?.message || ordersError?.message || productsError?.message || customersError?.message;

  // Debug WooCommerce API status
  useEffect(() => {
    console.log("WooCommerce API Status:", {
      configured: wooConfigured,
      connectionStatus: apiConnectionStatus,
      isLoading,
      hasError,
      errorMessage,
      stats: stats ? "Available" : "Not available",
      ordersCount: orders?.length || 0,
      productsCount: products?.length || 0,
      customersCount: customers?.length || 0
    });
  }, [wooConfigured, apiConnectionStatus, isLoading, hasError, stats, orders, products, customers, errorMessage]);

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
      
      {apiConnectionStatus === 'checking' && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertTitle>Checking WooCommerce API Connection</AlertTitle>
          <AlertDescription>
            Please wait while we verify the connection to your WooCommerce store...
          </AlertDescription>
        </Alert>
      )}
      
      {apiConnectionStatus === 'failed' && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle>WooCommerce API Not Connected</AlertTitle>
          <AlertDescription>
            Please visit the Reports page to configure your WooCommerce API connection.
          </AlertDescription>
        </Alert>
      )}
      
      {apiConnectionStatus === 'connected' && hasError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>WooCommerce API Error</AlertTitle>
          <AlertDescription>
            {errorMessage || "Error connecting to WooCommerce API. Please check your connection and credentials."}
          </AlertDescription>
        </Alert>
      )}
      
      {apiConnectionStatus === 'connected' && !hasError && !isLoading && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>WooCommerce Connected</AlertTitle>
          <AlertDescription>
            Successfully connected to MIN NEW YORK WooCommerce API.
          </AlertDescription>
        </Alert>
      )}
      
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
            wooCustomers={customers || []} 
            wooOrders={orders || []}
            wooProducts={products || []}
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
            }, []) || []}
            productsWithSEO={products || []}
          />
        )}
        
        {activeTab === 'carts' && (
          <AbandonedCartRecovery 
            wooOrders={abandonedOrders}
            wooProducts={products || []}
            wooCustomers={customers || []}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
