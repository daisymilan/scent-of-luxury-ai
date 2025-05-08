
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import KpiOverview from '@/components/KpiOverview';
import B2BLeadGeneration from '@/components/B2BLeadGeneration';
import SEODashboard from '@/components/SEODashboard';
import AbandonedCartRecovery from '@/components/AbandonedCartRecovery'; 
import AiAssistant from '@/components/AiAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { WooCustomer, WooOrder, WooProduct } from '@/lib/mockData';

// WooCommerce API endpoints
const API_BASE_URL = 'https://min.com/int/wp-json/wc/v3';
const API_CREDENTIALS = 'Basic ' + btoa('ck_8448b85f1bb94d4dd33539f9533fd338d50e781c:cs_703141faee85294cdddd88fd14dc2151d00a7aab');

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();

  // Optimize data fetching with stale-while-revalidate strategy
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['wooCustomers'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers?per_page=100`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': API_CREDENTIALS
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json() as WooCustomer[];
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Data Fetch Error",
          description: "Could not load customer data from WooCommerce. Using fallback data.",
          variant: "destructive",
        });
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - updated from cacheTime to gcTime
  });

  // Fetch orders from WooCommerce API with optimized caching
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['wooOrders'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders?per_page=100`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': API_CREDENTIALS
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json() as WooOrder[];
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Data Fetch Error",
          description: "Could not load order data from WooCommerce. Using fallback data.",
          variant: "destructive",
        });
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - updated from cacheTime to gcTime
  });

  // Fetch products with optimized caching
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['wooProducts'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products?per_page=100`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': API_CREDENTIALS
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json() as WooProduct[];
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Data Fetch Error",
          description: "Could not load product data from WooCommerce. Using fallback data.",
          variant: "destructive",
        });
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - updated from cacheTime to gcTime
  });

  // This function helps lazy-load components based on active tab
  const shouldLoadComponent = (tabId: string) => {
    // Always load overview tab
    if (tabId === 'overview') return true;
    
    // Load the active tab
    if (activeTab === tabId) return true;
    
    // Don't load other tabs until they're activated
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">
                <span className="font-cormorant font-medium text-4xl tracking-wider">
                  <span className="font-semibold">MiN</span> NEW YORK
                </span>{" "}
                <span className="text-xl">{user?.role} Dashboard</span>
              </h1>
              <p className="text-gray-500 mt-1">Welcome back to your luxury fragrance dashboard, {user?.name}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 8, 2025, {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Overview</TabsTrigger>
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director') && (
                <TabsTrigger value="b2b" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">B2B Leads</TabsTrigger>
              )}
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager') && (
                <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">SEO</TabsTrigger>
              )}
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
                <TabsTrigger value="cart" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">Abandoned Carts</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <KpiOverview />
            </TabsContent>
            
            <TabsContent value="b2b" className="space-y-6">
              {shouldLoadComponent('b2b') && (
                <B2BLeadGeneration 
                  wooCustomers={customers} 
                  wooOrders={orders} 
                  wooProducts={products} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              {shouldLoadComponent('seo') && (
                <SEODashboard />
              )}
            </TabsContent>
            
            <TabsContent value="cart" className="space-y-6">
              {shouldLoadComponent('cart') && (
                <AbandonedCartRecovery 
                  wooCustomers={customers}
                  wooOrders={orders}
                  wooProducts={products}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <AiAssistant />
    </div>
  );
};

export default Index;
