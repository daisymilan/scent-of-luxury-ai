
import { FC } from 'react';

interface PageHeaderProps {
  lastUpdated: string;
}

const PageHeader: FC<PageHeaderProps> = ({ lastUpdated }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-3xl font-semibold">MIN NEW YORK Reports & Analytics</h1>
        <p className="text-gray-500">View detailed reports and analytics using real WooCommerce data</p>
      </div>
      <div className="mt-4 sm:mt-0">
        <span className="text-sm text-gray-500 mr-2">Last updated:</span>
        <span className="text-sm font-medium">{lastUpdated}</span>
      </div>
    </div>
  );
};

export default PageHeader;
