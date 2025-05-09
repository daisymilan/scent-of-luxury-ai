
import { useState } from 'react';
import { Mic, Play, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssistantTogglesProps {
  query: string;
  isListening: boolean;
  handleListen: () => void;
  handleClear: () => void;
  handleQuerySubmit: () => void;
  speechRecognitionSupported: boolean;
  speechRecognitionErrorMessage?: string | null;
}

export const AssistantToggles = ({ 
  query, 
  isListening, 
  handleListen, 
  handleClear, 
  handleQuerySubmit,
  speechRecognitionSupported,
  speechRecognitionErrorMessage
}: AssistantTogglesProps) => {
  if (isListening) {
    return (
      <Button 
        className="rounded-full bg-red-500 hover:bg-red-600 h-10 w-10 flex-shrink-0" 
        onClick={handleClear}
      >
        <X size={20} />
      </Button>
    );
  }
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className={`rounded-full h-10 w-10 flex-shrink-0 ${!speechRecognitionSupported ? 'bg-gray-400 hover:bg-gray-500' : 'bg-primary hover:bg-primary/90'}`}
              onClick={handleListen}
              disabled={!speechRecognitionSupported}
            >
              {!speechRecognitionSupported ? (
                <AlertTriangle size={18} />
              ) : (
                <Mic size={20} />
              )}
            </Button>
          </TooltipTrigger>
          {!speechRecognitionSupported && (
            <TooltipContent side="top">
              <p>{speechRecognitionErrorMessage || "Speech recognition not supported"}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      <Button 
        className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 flex-shrink-0"
        onClick={handleQuerySubmit}
        disabled={!query}
      >
        <Play size={20} />
      </Button>
    </>
  );
};
