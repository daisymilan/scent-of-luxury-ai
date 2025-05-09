
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "Consumer Reorder Reminders", 
  description = "No customer purchase data available" 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-10">
        <p className="mb-4">There are no customers with purchase history to display.</p>
        <p className="text-sm text-gray-500">
          This could be because there are no orders in your WooCommerce store, 
          or the orders don't have associated customer accounts.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
