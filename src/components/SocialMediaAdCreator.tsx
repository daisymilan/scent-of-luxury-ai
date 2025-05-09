
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SocialMediaAdCreator: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Social Media Ad Creator</h2>
          <p className="text-gray-500">Create and manage ads across multiple platforms</p>
        </div>
      </div>
      
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-16">
          {isLoading ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <CalendarClock className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Coming Soon!</h3>
              <p className="text-gray-500 text-center max-w-md">
                We're working on enhanced social media ad creation tools. 
                This feature will be available in an upcoming release.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaAdCreator;
