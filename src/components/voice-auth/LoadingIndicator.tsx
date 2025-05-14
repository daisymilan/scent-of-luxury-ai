
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Processing authentication..." 
}) => {
  return (
    <div className="flex justify-center p-4">
      <div className="animate-pulse flex space-x-2">
        <div className="h-3 w-3 bg-primary rounded-full"></div>
        <div className="h-3 w-3 bg-primary rounded-full"></div>
        <div className="h-3 w-3 bg-primary rounded-full"></div>
      </div>
      <span className="ml-3 text-sm text-muted-foreground">{message}</span>
    </div>
  );
};
