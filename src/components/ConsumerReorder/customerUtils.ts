
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
  if (!orders || !customers) return [];
  
  // Map of customer ID to their purchase info
  const customerPurchases: Record<number, {
    lastPurchase: string;
    lastPurchaseDate: string;
    daysSince: number;
    purchaseCount: number;
  }> = {};
  
  // Process orders to get purchase information
  orders.forEach(order => {
    const customerId = order.customer_id;
    const orderDate = new Date(order.date_created);
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get the name of the first product in the order
    const productName = order.line_items[0]?.name || "Unknown Product";
    
    if (!customerPurchases[customerId] || new Date(customerPurchases[customerId].lastPurchaseDate) < orderDate) {
      // Update the last purchase info for this customer
      customerPurchases[customerId] = {
        lastPurchase: productName,
        lastPurchaseDate: order.date_created,
        daysSince: daysSince,
        purchaseCount: customerPurchases[customerId]?.purchaseCount + 1 || 1
      };
    } else {
      // Increment the purchase count
      customerPurchases[customerId].purchaseCount += 1;
    }
  });
  
  // Combine with customer info
  const processed: Customer[] = customers
    .filter(customer => customerPurchases[customer.id]) // Only include customers with purchases
    .map(customer => ({
      id: customer.id.toString(),
      name: `${customer.first_name} ${customer.last_name}`,
      email: customer.email,
      lastPurchase: customerPurchases[customer.id].lastPurchase,
      lastPurchaseDate: customerPurchases[customer.id].lastPurchaseDate,
      daysSince: customerPurchases[customer.id].daysSince,
      purchaseCount: customerPurchases[customer.id].purchaseCount
    }))
    .sort((a, b) => b.daysSince - a.daysSince); // Sort by days since last purchase (descending)
  
  return processed;
};
