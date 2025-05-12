
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useWooOrders, useWooCustomers } from '@/utils/woocommerce';

interface EmptyStateProps {
  title?: string;
  description?: string;
  ordersCount?: number;
  customersCount?: number;
  onRetry?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "Consumer Reorder Reminders", 
  description = "No customer purchase data available",
  ordersCount = 0,
  customersCount = 0,
  onRetry
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-10">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
        </div>
        <p className="mb-4">There are no customers with purchase history to display.</p>
        
        <div className="text-sm text-gray-500 mb-6">
          <p className="mb-2">This could be because:</p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto">
            <li>There are no orders in your WooCommerce store</li>
            <li>The orders don't have associated customer accounts</li>
            <li>The WooCommerce API connection needs to be refreshed</li>
          </ul>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="font-medium text-gray-700 mb-1">Diagnostic Information:</p>
            <p>Orders loaded: {ordersCount}</p>
            <p>Customers loaded: {customersCount}</p>
          </div>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="mt-2" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry Loading Data
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
