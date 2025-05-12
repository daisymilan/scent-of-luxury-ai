
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ErrorDialog } from '@/components/ui/error-dialog';

interface ErrorStateProps {
  title?: string;
  description?: string;
  errorMessage: string;
  onRetry?: () => void;
  onHelp?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Consumer Reorder Reminders",
  description = "Error loading customer data",
  errorMessage,
  onRetry,
  onHelp
}) => {
  const [showErrorDialog, setShowErrorDialog] = React.useState(false);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-10">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <p className="mb-4">There was an error loading the customer data.</p>
        
        <div className="text-sm text-gray-500 mb-6">
          <p className="mb-2">This could be because:</p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto">
            <li>The WooCommerce API connection has timed out</li>
            <li>Invalid API credentials</li>
            <li>Network connectivity issues</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry Loading Data
            </Button>
          )}
          
          <Button onClick={() => setShowErrorDialog(true)} variant="secondary">
            View Error Details
          </Button>
        </div>
        
        <ErrorDialog
          open={showErrorDialog}
          onOpenChange={setShowErrorDialog}
          title="Data Loading Error"
          description={errorMessage}
          errorType="api"
          showHelp={!!onHelp}
          onHelp={onHelp}
        />
      </CardContent>
    </Card>
  );
};

export default ErrorState;
