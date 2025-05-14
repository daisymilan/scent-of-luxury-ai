
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface CollapsedAssistantProps {
  setIsExpanded: (expanded: boolean) => void;
}

export const CollapsedAssistant = ({ setIsExpanded }: CollapsedAssistantProps) => {
  return (
    <Button
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      onClick={() => setIsExpanded(true)}
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};
