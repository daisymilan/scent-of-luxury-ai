
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InstagramAdCreator from './ads/InstagramAdCreator';
import WhatsAppAdCreator from './ads/WhatsAppAdCreator';
import TikTokAdCreator from './ads/TikTokAdCreator';

const SocialMediaAdCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('instagram');

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Social Media Ad Creator</h2>
          <p className="text-gray-500">Create and manage ads across multiple platforms</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp CTWA</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instagram">
          <InstagramAdCreator />
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <WhatsAppAdCreator />
        </TabsContent>
        
        <TabsContent value="tiktok">
          <TikTokAdCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaAdCreator;
