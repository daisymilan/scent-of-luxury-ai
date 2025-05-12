
import { WooOrder, WooCustomer } from '@/utils/woocommerce';

export interface Customer {
  id: string;
  name: string;
  email: string;
  lastPurchase: string;
  lastPurchaseDate: string;
  daysSince: number;
  purchaseCount: number;
}

export const processCustomerData = (orders: WooOrder[], customers: WooCustomer[]): Customer[] => {
  if (!orders || !customers || orders.length === 0 || customers.length === 0) {
    console.log('No orders or customers data available for processing');
    return [];
  }
  
  // Map of customer ID to their purchase info
  const customerPurchases: Record<number, {
    lastPurchase: string;
    lastPurchaseDate: string;
    daysSince: number;
    purchaseCount: number;
  }> = {};
  
  console.log(`Processing ${orders.length} orders for ${customers.length} customers`);
  
  // Process orders to get purchase information
  orders.forEach(order => {
    const customerId = order.customer_id;
    
    // Skip orders without customer_id
    if (!customerId) {
      console.log('Order without customer_id:', order.id);
      return;
    }
    
    // Skip if order date is invalid
    if (!order.date_created) {
      console.log('Order without date_created:', order.id);
      return;
    }
    
    const orderDate = new Date(order.date_created);
    if (isNaN(orderDate.getTime())) {
      console.log('Order with invalid date:', order.id, order.date_created);
      return;
    }
    
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get the name of the first product in the order
    const productName = order.line_items && order.line_items.length > 0 
      ? order.line_items[0]?.name || "Unknown Product"
      : "Unknown Product";
    
    if (!customerPurchases[customerId] || new Date(customerPurchases[customerId].lastPurchaseDate) < orderDate) {
      // Update the last purchase info for this customer
      customerPurchases[customerId] = {
        lastPurchase: productName,
        lastPurchaseDate: order.date_created,
        daysSince: daysSince,
        purchaseCount: customerPurchases[customerId]?.purchaseCount + 1 || 1
      };
    } else if (customerPurchases[customerId]) {
      // Increment the purchase count
      customerPurchases[customerId].purchaseCount += 1;
    }
  });
  
  console.log(`Found purchase data for ${Object.keys(customerPurchases).length} customers`);
  
  // Fix: Create a list of valid customer IDs with purchase data
  const validCustomerIds = Object.keys(customerPurchases).map(id => parseInt(id));
  
  // Combine with customer info - corrected filtering logic
  const processed: Customer[] = customers
    .filter(customer => validCustomerIds.includes(customer.id)) // Fix: Use validCustomerIds for filtering
    .map(customer => ({
      id: customer.id.toString(),
      name: customer.first_name || customer.last_name 
        ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() 
        : customer.username || customer.email.split('@')[0],
      email: customer.email,
      lastPurchase: customerPurchases[customer.id].lastPurchase,
      lastPurchaseDate: customerPurchases[customer.id].lastPurchaseDate,
      daysSince: customerPurchases[customer.id].daysSince,
      purchaseCount: customerPurchases[customer.id].purchaseCount
    }))
    .sort((a, b) => b.daysSince - a.daysSince); // Sort by days since last purchase (descending)
  
  console.log(`Processed ${processed.length} customers with purchase data`);
  return processed;
};
