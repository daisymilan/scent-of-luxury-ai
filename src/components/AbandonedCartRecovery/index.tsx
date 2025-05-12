
import { ShoppingCart, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WooOrder, WooCustomer, WooProduct } from '@/lib/mockData';
import { useState, useMemo } from 'react';
import RecoveryStats from './RecoveryStats';
import AbandonedCartList from './AbandonedCartList';
import RecoveryAutomations from './RecoveryAutomations';
import { processAbandonedCartData, AbandonedCart, calculateRecoveryStats } from './utils';
import { useQuery } from '@tanstack/react-query';
import { WOO_API_BASE_URL, WOO_API_AUTH_PARAMS } from '@/utils/woocommerce';
import { useToast } from '@/hooks/use-toast';

interface AbandonedCartRecoveryProps {
  wooOrders?: WooOrder[] | null;
  wooCustomers?: WooCustomer[] | null;
  wooProducts?: WooProduct[] | null;
}

const AbandonedCartRecovery = ({ 
  wooOrders, 
  wooCustomers, 
  wooProducts 
}: AbandonedCartRecoveryProps) => {
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();

  // If props aren't provided, fetch the data directly
  const { data: fetchedOrders } = useQuery({
    queryKey: ['abandonedCartOrders'],
    queryFn: async () => {
      // Only fetch if props weren't provided
      if (wooOrders) return wooOrders;
      
      try {
        const response = await fetch(
          `${WOO_API_BASE_URL}/orders?status=pending,on-hold&per_page=100&${WOO_API_AUTH_PARAMS}`,
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
        console.error('Error fetching abandoned cart orders:', error);
        toast({
          title: "Data Fetch Error",
          description: "Could not load abandoned cart data from WooCommerce.",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !wooOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: fetchedCustomers } = useQuery({
    queryKey: ['abandonedCartCustomers'],
    queryFn: async () => {
      // Only fetch if props weren't provided
      if (wooCustomers) return wooCustomers;
      
      try {
        const response = await fetch(
          `${WOO_API_BASE_URL}/customers?per_page=100&${WOO_API_AUTH_PARAMS}`,
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
        console.error('Error fetching customers for abandoned carts:', error);
        return null;
      }
    },
    enabled: !wooCustomers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: fetchedProducts } = useQuery({
    queryKey: ['abandonedCartProducts'],
    queryFn: async () => {
      // Only fetch if props weren't provided
      if (wooProducts) return wooProducts;
      
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
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching products for abandoned carts:', error);
        return null;
      }
    },
    enabled: !wooProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Use either the props or the fetched data
  const orders = wooOrders || fetchedOrders;
  const customers = wooCustomers || fetchedCustomers;
  const products = wooProducts || fetchedProducts;

  // Process WooCommerce data to identify abandoned carts
  const processedCarts = useMemo(() => {
    return processAbandonedCartData(orders, customers, products, []);
  }, [orders, customers, products]);
  
  // Calculate recovery stats
  const recoveryStats = useMemo(() => {
    return calculateRecoveryStats(processedCarts);
  }, [processedCarts]);

  return (
    <div className="grid gap-6">
      <Card className="col-span-full">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Abandoned Cart Recovery</CardTitle>
          </div>
          <Button className="h-8 text-xs" size="sm">
            <Zap size={14} className="mr-1" /> Configure Automation
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <RecoveryStats stats={recoveryStats} />
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Recovery ({processedCarts.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({recoveryStats.recovered})</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <AbandonedCartList carts={processedCarts} />
              </TabsContent>
              <TabsContent value="completed">
                <div className="text-center py-8 border rounded-md">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Switch to the "Completed" tab to see recovered and lost carts</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <RecoveryAutomations />
        </CardContent>
      </Card>
    </div>
  );
};

export default AbandonedCartRecovery;
