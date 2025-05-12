
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WooCommerceConfig from '@/components/WooCommerceConfig';
import N8nConfig from '@/components/N8nConfig';
import GrokConfig from '@/components/GrokConfig';

const IntegrationsTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="woocommerce">
        <TabsList className="mb-4">
          <TabsTrigger value="woocommerce">WooCommerce</TabsTrigger>
          <TabsTrigger value="grok">Grok AI</TabsTrigger>
          <TabsTrigger value="n8n">n8n</TabsTrigger>
        </TabsList>
        
        <TabsContent value="woocommerce">
          <WooCommerceConfig />
        </TabsContent>
        
        <TabsContent value="grok">
          <GrokConfig />
        </TabsContent>
        
        <TabsContent value="n8n">
          <N8nConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsTab;
