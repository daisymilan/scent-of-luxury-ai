
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AbandonedCartList, { AbandonedCart } from './AbandonedCartList';
import RecoveryStats from './RecoveryStats';
import RecoveryAutomations from './RecoveryAutomations';
import { useToast } from '@/components/ui/use-toast';
import { WooOrder, WooProduct, WooCustomer } from '@/utils/woocommerce/types';

// Sample data generator function to convert WooCommerce abandoned orders to our format
const convertWooOrdersToAbandonedCarts = (
  orders: WooOrder[] = [], 
  products: WooProduct[] = [], 
  customers: WooCustomer[] = []
): AbandonedCart[] => {
  return orders
    .filter(order => order.status === 'pending' || order.status === 'on-hold')
    .map(order => {
      // Find customer data
      const customer = customers.find(c => c.id === order.customer_id) || {
        first_name: 'Unknown',
        last_name: 'Customer',
        email: order.billing?.email || 'unknown@example.com'
      };
      
      // Convert line items to product names
      const productNames = order.line_items.map(item => item.name);
      
      return {
        id: `cart-${order.id}`,
        orderId: order.id,
        customerId: order.customer_id,
        customer: `${customer.first_name} ${customer.last_name}`,
        email: order.billing?.email || customer.email || 'unknown@example.com',
        products: productNames,
        value: parseFloat(order.total),
        time: new Date(order.date_created).toLocaleString(),
        status: Math.random() > 0.5 ? 'pending' : 'in_progress' // Randomize status for demo
      };
    });
};

interface AbandonedCartRecoveryProps {
  wooOrders?: WooOrder[];
  wooProducts?: WooProduct[];
  wooCustomers?: WooCustomer[];
}

const AbandonedCartRecovery: React.FC<AbandonedCartRecoveryProps> = ({ 
  wooOrders = [], 
  wooProducts = [], 
  wooCustomers = [] 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("carts");
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  
  useEffect(() => {
    // Convert WooCommerce orders to abandoned carts format
    const carts = convertWooOrdersToAbandonedCarts(wooOrders, wooProducts, wooCustomers);
    setAbandonedCarts(carts);
    
    console.log('AbandonedCartRecovery: Converted', wooOrders.length, 'orders to', carts.length, 'abandoned carts');
  }, [wooOrders, wooProducts, wooCustomers]);

  // Action handlers
  const handleSendEmail = (cartId: string) => {
    toast({
      title: "Email Reminder Sent",
      description: `Recovery email sent for cart ${cartId}`,
    });
  };

  const handleSendSMS = (cartId: string) => {
    toast({
      title: "SMS Reminder Sent",
      description: `Recovery SMS sent for cart ${cartId}`,
    });
  };

  const handleViewDetails = (cartId: string) => {
    toast({
      title: "View Cart Details",
      description: `Viewing details for cart ${cartId}`,
    });
  };

  const handleSendCustomEmail = (cartId: string) => {
    toast({
      title: "Custom Email",
      description: `Custom email editor opened for cart ${cartId}`,
    });
  };

  const handleMarkRecovered = (cartId: string) => {
    setAbandonedCarts(prev => 
      prev.map(cart => 
        cart.id === cartId ? { ...cart, status: 'recovered' } : cart
      )
    );
    
    toast({
      title: "Cart Recovered",
      description: `Cart ${cartId} marked as recovered`,
    });
  };

  const handleCancelRecovery = (cartId: string) => {
    setAbandonedCarts(prev => 
      prev.map(cart => 
        cart.id === cartId ? { ...cart, status: 'cancelled' } : cart
      )
    );
    
    toast({
      title: "Recovery Cancelled",
      description: `Recovery for cart ${cartId} has been cancelled`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Abandoned Cart Recovery</h2>
        <p className="text-gray-500">
          Track and recover abandoned shopping carts to boost sales conversion
        </p>
      </div>
      
      <Tabs defaultValue="carts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="carts">Abandoned Carts</TabsTrigger>
          <TabsTrigger value="stats">Recovery Stats</TabsTrigger>
          <TabsTrigger value="automations">Recovery Automations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="carts" className="space-y-4">
          <AbandonedCartList 
            carts={abandonedCarts}
            onSendEmail={handleSendEmail}
            onSendSMS={handleSendSMS}
            onViewDetails={handleViewDetails}
            onSendCustomEmail={handleSendCustomEmail}
            onMarkRecovered={handleMarkRecovered}
            onCancelRecovery={handleCancelRecovery}
            wooOrders={wooOrders}
            wooProducts={wooProducts}
            wooCustomers={wooCustomers}
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <RecoveryStats />
        </TabsContent>
        
        <TabsContent value="automations">
          <RecoveryAutomations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AbandonedCartRecovery;
