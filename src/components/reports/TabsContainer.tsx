
import { FC, ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorDisplay from './ErrorDisplay';

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  hasError?: boolean;
  errorMessage?: string;
}

interface TabsContainerProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onErrorClose?: () => void;
}

const TabsContainer: FC<TabsContainerProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  onErrorClose
}) => {
  // Find the active tab to check for errors
  const currentTab = tabs.find(tab => tab.value === activeTab);
  const showInlineError = currentTab?.hasError && currentTab?.errorMessage;

  return (
    <>
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="mb-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {showInlineError && onErrorClose && (
          <ErrorDisplay 
            isVisible={true}
            message={currentTab.errorMessage || ""}
            onClose={onErrorClose}
            asDialog={false}
            errorType="api"
          />
        )}
        
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default TabsContainer;
