
import { useState, useEffect } from 'react';
import { WooOrder } from '@/utils/woocommerce/types';

interface FormattedOrder {
  orderId: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

export const useFormattedOrders = (orders: WooOrder[] | undefined): FormattedOrder[] => {
  const [recentOrders, setRecentOrders] = useState<FormattedOrder[]>([]);

  useEffect(() => {
    // Format recent orders for the table component
    if (orders && orders.length > 0) {
      const formattedOrders = orders.slice(0, 4).map(order => ({
        orderId: order.id,
        customerName: `${order.billing.first_name} ${order.billing.last_name}`,
        orderDate: new Date(order.date_created).toLocaleDateString(),
        totalAmount: parseFloat(order.total),
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }));
      
      setRecentOrders(formattedOrders);
    } else {
      setRecentOrders([]);
    }
  }, [orders]);

  return recentOrders;
};
