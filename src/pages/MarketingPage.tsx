
import DashboardHeader from '@/components/DashboardHeader';
import SEODashboard from '@/components/SEODashboard';

const MarketingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">Marketing Dashboard</h1>
              <p className="text-gray-500">Manage your marketing campaigns and SEO</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 6, 2025, 10:24 AM</span>
            </div>
          </div>
          
          <SEODashboard />
        </div>
      </main>
    </div>
  );
};

export default MarketingPage;
