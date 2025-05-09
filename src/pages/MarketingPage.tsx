
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardHeader from '@/components/DashboardHeader';
import SEODashboard from '@/components/SEODashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { WOO_API_BASE_URL, WOO_API_AUTH_PARAMS } from '@/utils/woocommerce';
import { useToast } from '@/hooks/use-toast';

const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState('seo');
  const { toast } = useToast();

  // Fetch categories for SEO analysis
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['wooCategories'],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${WOO_API_BASE_URL}/products/categories?per_page=100&${WOO_API_AUTH_PARAMS}`,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Data Fetch Error",
          description: "Could not load category data from WooCommerce.",
          variant: "destructive",
        });
        return null;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch products with their metadata for SEO analysis
  const { data: productsWithSEO, isLoading: isLoadingSEOProducts } = useQuery({
    queryKey: ['wooProductsWithSEO'],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${WOO_API_BASE_URL}/products?per_page=100&${WOO_API_AUTH_PARAMS}`,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Process products to extract SEO metadata
        return products.map(product => ({
          ...product,
          seo: {
            title: product.meta_data?.find(meta => meta.key === '_yoast_wpseo_title')?.value || product.name,
            description: product.meta_data?.find(meta => meta.key === '_yoast_wpseo_metadesc')?.value || '',
            keywords: product.meta_data?.find(meta => meta.key === '_yoast_wpseo_metakeywords')?.value || '',
          }
        }));
      } catch (error) {
        console.error('Error fetching products with SEO data:', error);
        toast({
          title: "Data Fetch Error",
          description: "Could not load SEO data from WooCommerce.",
          variant: "destructive",
        });
        return null;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const isLoading = isLoadingCategories || isLoadingSEOProducts;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">Marketing Dashboard</h1>
              <p className="text-gray-500">Manage your marketing campaigns and SEO</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 8, 2025, {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>
            
            <TabsContent value="seo">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ) : (
                <SEODashboard 
                  categories={categories} 
                  productsWithSEO={productsWithSEO} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="keywords">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-48 w-full" />
                  ) : (
                    <div className="text-center py-6">
                      <p>Keyword analysis data from WooCommerce products.</p>
                      {/* Additional keyword analysis components would go here */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MarketingPage;
