
import { ShoppingCart, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { abandonedCarts } from '../../lib/mockData';
import { WooOrder, WooCustomer, WooProduct } from '@/lib/mockData';
import { useState, useMemo } from 'react';
import RecoveryStats from './RecoveryStats';
import AbandonedCartList from './AbandonedCartList';
import RecoveryAutomations from './RecoveryAutomations';
import { processAbandonedCartData, AbandonedCart, calculateRecoveryStats } from './utils';

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

  // Process WooCommerce data to identify abandoned carts
  const processedCarts = useMemo(() => {
    return processAbandonedCartData(wooOrders, wooCustomers, wooProducts, abandonedCarts);
  }, [wooOrders, wooCustomers, wooProducts]);
  
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
