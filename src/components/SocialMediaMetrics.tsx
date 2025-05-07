
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const adPerformanceData = [
  {
    platform: 'Instagram',
    impressions: 125000,
    clicks: 6750,
    conversions: 385,
    ctr: 5.4,
    cpc: 1.85,
    spend: 12487.50
  },
  {
    platform: 'WhatsApp CTWA',
    impressions: 45000,
    clicks: 3600,
    conversions: 720,
    ctr: 8.0,
    cpc: 1.25,
    spend: 4500.00
  },
  {
    platform: 'TikTok',
    impressions: 210000,
    clicks: 11550,
    conversions: 462,
    ctr: 5.5,
    cpc: 0.75,
    spend: 8662.50
  }
];

const weeklyData = [
  { name: 'Mon', Instagram: 5200, WhatsApp: 3100, TikTok: 7800 },
  { name: 'Tue', Instagram: 4800, WhatsApp: 3400, TikTok: 6900 },
  { name: 'Wed', Instagram: 6500, WhatsApp: 2800, TikTok: 9200 },
  { name: 'Thu', Instagram: 5900, WhatsApp: 3700, TikTok: 8400 },
  { name: 'Fri', Instagram: 6800, WhatsApp: 4200, TikTok: 11500 },
  { name: 'Sat', Instagram: 7500, WhatsApp: 4500, TikTok: 13800 },
  { name: 'Sun', Instagram: 8200, WhatsApp: 3900, TikTok: 12600 },
];

const conversionData = [
  { name: 'Instagram', value: 385 },
  { name: 'WhatsApp', value: 720 },
  { name: 'TikTok', value: 462 },
];

const SocialMediaMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adPerformanceData.map((platform) => (
          <Card key={platform.platform}>
            <CardHeader className="pb-2">
              <CardTitle>{platform.platform} Performance</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Impressions</dt>
                  <dd className="text-2xl font-bold">{platform.impressions.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Clicks</dt>
                  <dd className="text-2xl font-bold">{platform.clicks.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">CTR</dt>
                  <dd className="text-2xl font-bold">{platform.ctr}%</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Conversions</dt>
                  <dd className="text-2xl font-bold">{platform.conversions}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">CPC</dt>
                  <dd className="text-2xl font-bold">${platform.cpc}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total Spend</dt>
                  <dd className="text-2xl font-bold">${platform.spend.toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Engagement</CardTitle>
          <CardDescription>Impressions by day and platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="space-y-4">
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Instagram" fill="#E1306C" />
                    <Bar dataKey="WhatsApp" fill="#25D366" />
                    <Bar dataKey="TikTok" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Monthly data view would appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="quarterly">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Quarterly data view would appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaMetrics;
