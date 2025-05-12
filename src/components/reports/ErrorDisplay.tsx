
import { FC } from 'react';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  asDialog?: boolean;
  errorType?: 'api' | 'network' | 'validation' | 'unknown';
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ 
  isVisible, 
  message, 
  onClose,
  asDialog = true,
  errorType = 'api'
}) => {
  if (!isVisible) return null;

  // Handle specific error cases
  let title = "Error Loading Data";
  let description = message;
  let displayErrorType = errorType;

  if (message.includes("401") || message.toLowerCase().includes("auth")) {
    title = "WooCommerce Authentication Error";
    description = "Failed to authenticate with the WooCommerce API. Please check your API credentials in the Integrations tab.";
    displayErrorType = 'api';
  }
  
  return asDialog ? (
    <ErrorDialog
      open={isVisible}
      onOpenChange={onClose}
      title={title}
      description={description}
      errorType={displayErrorType}
    />
  ) : (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
