
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import SocialMediaAdCreator from '@/components/SocialMediaAdCreator';
import SocialMediaMetrics from '@/components/SocialMediaMetrics';
import { useAuth } from '@/contexts/AuthContext';

const SocialMediaAdsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('creator');
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold">Social Media Advertising</h1>
              <p className="text-gray-500">Create and manage social media advertising campaigns</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-sm text-gray-500 mr-2">Last updated:</span>
              <span className="text-sm font-medium">May 7, 2025, 11:15 AM</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
              <TabsTrigger value="creator" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">
                Ad Creator
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md">
                Performance Metrics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="creator" className="space-y-6">
              <SocialMediaAdCreator />
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-6">
              <SocialMediaMetrics />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SocialMediaAdsPage;
