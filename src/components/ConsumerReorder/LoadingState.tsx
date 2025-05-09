
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  description?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Consumer Reorder Reminders",
  description = "Loading customer data..."
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-10">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p>Fetching customer data from WooCommerce...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
