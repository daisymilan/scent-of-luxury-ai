
import { useState } from 'react';
import { Mic, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssistantTogglesProps {
  query: string;
  isListening: boolean;
  handleListen: () => void;
  handleClear: () => void;
  handleQuerySubmit: () => void;
}

export const AssistantToggles = ({ 
  query, 
  isListening, 
  handleListen, 
  handleClear, 
  handleQuerySubmit 
}: AssistantTogglesProps) => {
  return isListening ? (
    <Button 
      className="rounded-full bg-red-500 hover:bg-red-600 h-10 w-10 flex-shrink-0" 
      onClick={() => {
        // The actual stopping is handled in the parent component
        handleClear();
      }}
    >
      <X size={20} />
    </Button>
  ) : (
    <>
      <Button 
        className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 flex-shrink-0" 
        onClick={handleListen}
      >
        <Mic size={20} />
      </Button>
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
