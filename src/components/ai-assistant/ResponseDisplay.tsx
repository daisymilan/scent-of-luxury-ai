
import { Volume2, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResponseDisplayProps {
  response: string;
  isSpeaking: boolean;
  handleReadAloud: () => void;
}

export const ResponseDisplay = ({ 
  response, 
  isSpeaking,
  handleReadAloud
}: ResponseDisplayProps) => {
  if (!response) return null;
  
  // Function to format JSON response if it's valid JSON
  const formatResponse = (text: string) => {
    try {
      // Try to parse as JSON
      const jsonObj = JSON.parse(text);
      
      // If it's a JSON object, return it formatted nicely
      if (typeof jsonObj === 'object') {
        // Format specific JSON structures from the API
        if (jsonObj.response) {
          return jsonObj.response;
        }
        
        // For message-based responses (like in the screenshot)
        if (jsonObj.message) {
          return jsonObj.message;
        }
        
        // Fallback to pretty-printed JSON
        return JSON.stringify(jsonObj, null, 2);
      }
      return text;
    } catch (e) {
      // If not valid JSON, return original text
      return text;
    }
  };
  
  const formattedResponse = formatResponse(response);
  
  return (
    <div className="mb-4">
      <div className="flex items-start mb-2">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
          M
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%] text-gray-700 overflow-x-auto">
          <pre className="text-sm whitespace-pre-wrap break-words font-sans">{formattedResponse}</pre>
        </div>
      </div>
      <div className="flex justify-start ml-10 space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 text-xs flex items-center"
          onClick={handleReadAloud}
        >
          {isSpeaking ? (
            <>
              <PauseCircle size={14} className="mr-1" /> Stop Reading
            </>
          ) : (
            <>
              <Volume2 size={14} className="mr-1" /> Read Aloud
            </>
          )}
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs">
          See Details
        </Button>
      </div>
    </div>
  );
};
