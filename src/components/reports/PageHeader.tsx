
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  lastUpdated: string;
  onNavigateToIntegrations?: () => void;
  hasAuthError?: boolean;
}

const PageHeader: FC<PageHeaderProps> = ({ 
  lastUpdated, 
  onNavigateToIntegrations,
  hasAuthError 
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-3xl font-semibold">MIN NEW YORK Reports & Analytics</h1>
        <p className="text-gray-500">View detailed reports and analytics using real WooCommerce data</p>
        
        {hasAuthError && onNavigateToIntegrations && (
          <Button 
            variant="link" 
            onClick={onNavigateToIntegrations} 
            className="p-0 h-auto mt-2 text-red-600 hover:text-red-800"
          >
            Fix WooCommerce API connection <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="mt-4 sm:mt-0">
        <span className="text-sm text-gray-500 mr-2">Last updated:</span>
        <span className="text-sm font-medium">{lastUpdated}</span>
      </div>
    </div>
  );
};

export default PageHeader;
