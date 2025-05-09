
import { Button } from '@/components/ui/button';
import { ChevronDown, X } from 'lucide-react';

interface AssistantHeaderProps {
  setIsExpanded: (expanded: boolean) => void;
}

export const AssistantHeader = ({ setIsExpanded }: AssistantHeaderProps) => {
  return (
    <div className="bg-primary text-white p-3 flex justify-between items-center">
      <h3 className="font-medium">MIN NEW YORK AI Assistant</h3>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white hover:bg-primary/50"
          onClick={() => setIsExpanded(false)}
        >
          <ChevronDown size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-white hover:bg-primary/50"
          onClick={() => setIsExpanded(false)}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};
