
import React from 'react';
import { WebhookError } from '@/components/ai-assistant/WebhookError';
import { UserQuery } from '@/components/ai-assistant/UserQuery';
import { ThinkingIndicator } from '@/components/ai-assistant/ThinkingIndicator';
import { ResponseDisplay } from '@/components/ai-assistant/ResponseDisplay';
import { AssistantFooter } from '@/components/ai-assistant/AssistantFooter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

interface AiAssistantBodyProps {
  displayedQuery: string;
  isThinking: boolean;
  response: string;
  isSpeaking: boolean;
  isWebhookFailed: boolean;
  showSpeechAlert: boolean;
  setShowSpeechAlert: (value: boolean) => void;
  speechSupportErrorMessage: string | null;
  handleReadAloud: () => void;
  user: any;
}

export const AiAssistantBody: React.FC<AiAssistantBodyProps> = ({
  displayedQuery,
  isThinking,
  response,
  isSpeaking,
  isWebhookFailed,
  showSpeechAlert,
  setShowSpeechAlert,
  speechSupportErrorMessage,
  handleReadAloud,
  user
}) => {
  return (
    <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
      {showSpeechAlert && (
        <Alert className="bg-red-500 text-white border-none rounded-none flex items-center justify-between">
          <AlertDescription>
            {speechSupportErrorMessage || "Speech recognition not available"}
          </AlertDescription>
          <button onClick={() => setShowSpeechAlert(false)} className="text-white">
            <X size={16} />
          </button>
        </Alert>
      )}
      
      <WebhookError isWebhookFailed={isWebhookFailed} />
      <UserQuery displayedQuery={displayedQuery} />
      <ThinkingIndicator isThinking={isThinking} />
      <ResponseDisplay 
        response={response} 
        isSpeaking={isSpeaking}
        handleReadAloud={handleReadAloud}
      />
      <AssistantFooter user={user} />
    </div>
  );
};
