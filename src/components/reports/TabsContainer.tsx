
import { FC, ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsContainerProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TabsContainer: FC<TabsContainerProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsContainer;
