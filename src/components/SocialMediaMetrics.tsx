
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

const SocialMediaMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <BarChart className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Coming Soon!</h3>
          <p className="text-gray-500 text-center max-w-md">
            We're working on comprehensive social media performance metrics tools.
            This feature will be available in an upcoming release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaMetrics;
