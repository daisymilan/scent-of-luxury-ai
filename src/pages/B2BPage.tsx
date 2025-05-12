import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardHeader from '@/components/DashboardHeader';
import B2BLeadGeneration from '@/components/B2BLeadGeneration';
import N8nConfig from '@/components/N8nConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { WooCustomer, WooOrder, WooProduct } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { WOO_API_BASE_URL } from '@/utils/woocommerce';
import { WOO_API_CREDENTIALS, WOO_API_AUTH_PARAMS } from '@/utils/woocommerce/config';

// Column mapping for B2B leads import
export const B2BColumnMapping = {
  brand: ["brand", "Brand"],
  linkedInProfileUrl: ["linkedin profile url", "linkedinprofileurl", "linkedin url", "profile url"],
  fullName: ["full name", "fullname", "name"],
  firstName: ["first name", "firstname"],
  lastName: ["last name", "lastname"],
  jobTitle: ["job title", "jobtitle", "title", "position"],
  email: ["email", "email address", "contact email"],
  companyName: ["company name", "companyname", "company", "organization"],
  linkedInCompanyUrl: ["linkedin company url", "company linkedin url", "company profile"],
  linkedInCompanyId: ["linkedin company id", "company id"],
  website: ["website", "web", "site"],
  domain: ["domain", "company domain"],
  employeeCount: ["employee count", "employees", "company size", "size"],
  industry: ["industry", "sector", "field"],
  companyHQ: ["company hq", "headquarters", "hq"],
  location: ["person's location", "location", "contact location"],
  openProfile: ["open profile", "openprofile"],
  premiumLinkedIn: ["premium linkedin", "premium"],
  geoTag: ["geo tag", "geotag", "geo"]
};

const B2BPage = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const { toast } = useToast();

  // Fetch customers from WooCommerce API using query parameters
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['wooCustomers'],
    queryFn: async () => {
      try {
        const response = await fetch(`${WOO_API_BASE_URL}/customers?per_page=100&${WOO_API_AUTH_PARAMS}`, {
          headers: {
            'Content-Type': 'application/json',
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
          description: "Could not load customer data from WooCommerce.",
          variant: "destructive",
        });
        return null;
      }
    }
  });

  // Fetch orders from WooCommerce API
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['wooOrders'],
    queryFn: async () => {
      try {
        const response = await fetch(`${WOO_API_BASE_URL}/orders?per_page=100&${WOO_API_AUTH_PARAMS}`, {
          headers: {
            'Content-Type': 'application/json',
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
          description: "Could not load order data from WooCommerce.",
          variant: "destructive",
        });
        return null;
      }
    }
  });

  // Fetch products from WooCommerce API
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['wooProducts'],
    queryFn: async () => {
      try {
        const response = await fetch(`${WOO_API_BASE_URL}/products?per_page=100&${WOO_API_AUTH_PARAMS}`, {
          headers: {
            'Content-Type': 'application/json',
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
          description: "Could not load product data from WooCommerce.",
          variant: "destructive",
        });
        return null;
      }
    }
  });

  const isLoading = isLoadingCustomers || isLoadingOrders || isLoadingProducts;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">B2B Management</h1>
              <p className="text-gray-500">Manage your B2B leads and accounts</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 8, 2025, {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500">Loading B2B data from WooCommerce...</p>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="leads">Lead Management</TabsTrigger>
                <TabsTrigger value="automation">Automation Config</TabsTrigger>
              </TabsList>
              <TabsContent value="leads">
                <B2BLeadGeneration 
                  wooCustomers={customers} 
                  wooOrders={orders} 
                  wooProducts={products} 
                />
              </TabsContent>
              <TabsContent value="automation">
                <N8nConfig />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default B2BPage;
