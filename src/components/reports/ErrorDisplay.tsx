
import { FC } from 'react';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  asDialog?: boolean;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ 
  isVisible, 
  message, 
  onClose,
  asDialog = true
}) => {
  if (!isVisible) return null;
  
  return asDialog ? (
    <ErrorDialog
      open={isVisible}
      onOpenChange={onClose}
      title="Error Loading Data"
      description={message}
      errorType="api"
    />
  ) : (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>WooCommerce API Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
