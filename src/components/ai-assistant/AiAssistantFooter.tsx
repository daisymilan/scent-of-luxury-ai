
import React from 'react';
import { QueryInput } from '@/components/ai-assistant/QueryInput';
import { AssistantToggles } from '@/components/ai-assistant/AssistantToggles';
import { SuggestionLinks } from '@/components/ai-assistant/SuggestionLinks';

interface AiAssistantFooterProps {
  query: string;
  setQuery: (value: string) => void;
  isListening: boolean;
  handleListen: () => void;
  handleClear: () => void;
  handleQuerySubmit: () => void;
  speechRecognitionSupported: boolean;
  speechRecognitionErrorMessage: string | null;
}

export const AiAssistantFooter: React.FC<AiAssistantFooterProps> = ({
  query,
  setQuery,
  isListening,
  handleListen,
  handleClear,
  handleQuerySubmit,
  speechRecognitionSupported,
  speechRecognitionErrorMessage
}) => {
  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex space-x-2">
        <QueryInput
          query={query}
          setQuery={setQuery}
          handleQuerySubmit={handleQuerySubmit}
          handleClear={handleClear}
        />
        
        <AssistantToggles
          query={query}
          isListening={isListening}
          handleListen={handleListen}
          handleClear={handleClear}
          handleQuerySubmit={handleQuerySubmit}
          speechRecognitionSupported={speechRecognitionSupported}
          speechRecognitionErrorMessage={speechRecognitionErrorMessage}
        />
      </div>
      
      <SuggestionLinks />
    </div>
  );
};
