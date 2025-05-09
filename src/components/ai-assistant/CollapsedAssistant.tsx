
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

interface CollapsedAssistantProps {
  setIsExpanded: (expanded: boolean) => void;
}

export const CollapsedAssistant = ({ setIsExpanded }: CollapsedAssistantProps) => {
  return (
    <Button 
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
      onClick={() => setIsExpanded(true)}
    >
      <Mic size={20} />
    </Button>
  );
};
