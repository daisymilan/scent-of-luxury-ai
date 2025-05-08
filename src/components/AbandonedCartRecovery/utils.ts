
import { WooOrder, WooCustomer, WooProduct } from '@/lib/mockData';

// Define a type for our processed abandoned cart data
export interface AbandonedCart {
  id: number;
  customer: string;
  email: string;
  products: string[];
  value: number;
  time: string;
}

export interface RecoveryStats {
  abandoned: number;
  recovered: number;
  recoveryRate: string;
  valueRecovered: string;
}

export const processAbandonedCartData = (
  wooOrders?: WooOrder[] | null,
  wooCustomers?: WooCustomer[] | null,
  wooProducts?: WooProduct[] | null,
  fallbackData?: AbandonedCart[]
): AbandonedCart[] => {
  // If we don't have the WooCommerce data yet, use mock data
  if (!wooOrders || !wooCustomers || !wooProducts) {
    console.log('Using mock data for abandoned carts');
    return fallbackData || [];
  }

  try {
    console.log('Processing WooCommerce data for abandoned carts', {
      orders: wooOrders.length,
      customers: wooCustomers.length,
      products: wooProducts.length
    });

    // Find abandoned carts (orders with status 'pending' or 'failed')
    const abandonedOrdersData = wooOrders
      .filter(order => ['pending', 'failed', 'on-hold'].includes(order.status))
      .map(order => {
        // Find customer info - use billing info directly or find customer in wooCustomers
        let customerName = `${order.billing.first_name} ${order.billing.last_name}`.trim();
        let customerEmail = order.billing.email;
        
        // If customer name is empty and we have a customer ID, try to find the customer
        if ((!customerName || customerName === " ") && order.customer_id > 0) {
          const customer = wooCustomers.find(c => c.id === order.customer_id);
          if (customer) {
            customerName = `${customer.first_name} ${customer.last_name}`.trim();
            customerEmail = customer.email;
          }
        }
        
        // Default customer name if still empty
        if (!customerName || customerName === " ") {
          customerName = "Guest Customer";
        }
        
        // Get products in cart with proper names
        const cartProducts: string[] = [];
        if (order.line_items && order.line_items.length > 0) {
          order.line_items.forEach(item => {
            if (item.name) {
              cartProducts.push(item.name);
            } else {
              // Just add a default product name if name is not available
              cartProducts.push("Unnamed Product");
            }
          });
        }
        
        // Calculate cart value - use order total or sum line items
        let cartValue = parseFloat(order.total);
        if (isNaN(cartValue) || cartValue === 0) {
          // Fallback to calculating from line items, using 'price' property which exists
          cartValue = order.line_items.reduce((total, item) => {
            const itemPrice = parseFloat(String(item.price || "0"));
            return total + (isNaN(itemPrice) ? 0 : itemPrice);
          }, 0);
        }
        
        // Calculate time since order
        const orderDate = new Date(order.date_created);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        let timeAgo;
        if (diffDays > 0) {
          timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
          timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        }
        
        return {
          id: order.id,
          customer: customerName,
          email: customerEmail || "email@example.com", // Fallback email
          products: cartProducts.length > 0 ? cartProducts : ["Unknown Product"],
          value: cartValue > 0 ? cartValue : 19.99, // Default value if zero
          time: timeAgo
        };
      });

    console.log('Found abandoned carts:', abandonedOrdersData);
    
    return abandonedOrdersData;
  } catch (error) {
    console.error('Error processing abandoned cart data:', error);
    return fallbackData || []; // Fallback to mock data
  }
};

export const calculateRecoveryStats = (processedCarts: AbandonedCart[]): RecoveryStats => {
  // In a real implementation, this would be based on actual data
  // For now we'll use some realistic calculations based on the abandoned carts
  const abandonedCount = processedCarts.length;
  const recoveredCount = Math.floor(abandonedCount * 0.3); // Assume 30% recovery rate
  const recoveryRate = abandonedCount > 0 ? (recoveredCount / abandonedCount) * 100 : 0;
  const valueRecovered = processedCarts.reduce((total, cart) => {
    // Assume 30% of carts are recovered with their full value
    return total + (Math.random() > 0.7 ? cart.value : 0);
  }, 0);
  
  return {
    abandoned: abandonedCount,
    recovered: recoveredCount,
    recoveryRate: recoveryRate.toFixed(1),
    valueRecovered: valueRecovered.toFixed(0)
  };
};
