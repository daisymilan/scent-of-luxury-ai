
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  errorType?: 'api' | 'network' | 'validation' | 'unknown';
  showHelp?: boolean;
  onHelp?: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  errorType = 'unknown',
  showHelp = false,
  onHelp,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-sm">
          <p className="font-semibold mb-1">Error Type: {errorType}</p>
          <p className="text-gray-600 dark:text-gray-400">
            {errorType === 'api' && 'This error occurred while communicating with the API.'}
            {errorType === 'network' && 'This error occurred due to network connectivity issues.'}
            {errorType === 'validation' && 'This error occurred due to invalid data.'}
            {errorType === 'unknown' && 'An unexpected error occurred.'}
          </p>
        </div>

        <DialogFooter>
          {showHelp && (
            <Button variant="outline" onClick={onHelp}>
              Get Help
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
