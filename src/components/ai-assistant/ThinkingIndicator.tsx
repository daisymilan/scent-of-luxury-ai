
import { Loader2 } from 'lucide-react';

interface ThinkingIndicatorProps {
  isThinking: boolean;
}

export const ThinkingIndicator = ({ isThinking }: ThinkingIndicatorProps) => {
  if (!isThinking) return null;
  
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
        M
      </div>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="flex space-x-1 items-center">
          <Loader2 size={12} className="animate-spin text-gray-400" />
          <span className="text-sm text-gray-500">Getting your answer ready...</span>
        </div>
      </div>
    </div>
  );
};
