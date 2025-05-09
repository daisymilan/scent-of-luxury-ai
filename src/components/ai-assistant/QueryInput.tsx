
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  handleQuerySubmit: () => void;
  handleClear: () => void;
}

export const QueryInput = ({ 
  query, 
  setQuery, 
  handleQuerySubmit, 
  handleClear 
}: QueryInputProps) => {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Ask anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
      />
      {query && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1 h-8 w-8" 
          onClick={handleClear}
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
};
