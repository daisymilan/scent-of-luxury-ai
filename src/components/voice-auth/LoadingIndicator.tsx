
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center p-4">
      <div className="animate-pulse flex space-x-2">
        <div className="h-3 w-3 bg-primary rounded-full"></div>
        <div className="h-3 w-3 bg-primary rounded-full"></div>
        <div className="h-3 w-3 bg-primary rounded-full"></div>
      </div>
      <span className="ml-3 text-sm text-muted-foreground">Processing authentication...</span>
    </div>
  );
};
