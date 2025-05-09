
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { CollapsedAssistant } from '@/components/ai-assistant/CollapsedAssistant';
import { AssistantHeader } from '@/components/ai-assistant/AssistantHeader';
import { AiAssistantBody } from '@/components/ai-assistant/AiAssistantBody';
import { AiAssistantFooter } from '@/components/ai-assistant/AiAssistantFooter';
import { useAiAssistantState } from '@/components/ai-assistant/hooks/useAiAssistantState';
import { useSpeechHandler } from '@/components/ai-assistant/hooks/useSpeechHandler';
import { useWebhookCall } from '@/components/ai-assistant/useWebhookCall';

const AiAssistant = () => {
  // Get state from custom hook
  const {
    isExpanded,
    setIsExpanded,
    isListening,
    setIsListening,
    isSpeaking,
    setIsSpeaking,
    query,
    setQuery,
    displayedQuery,
    setDisplayedQuery,
    user,
    toast,
    speechSupport,
    setSpeechSupport,
    showSpeechAlert,
    setShowSpeechAlert,
    errorDialogOpen,
    setErrorDialogOpen,
    errorMessage,
    setErrorMessage,
    errorId,
    setErrorId,
    n8nWebhookUrl
  } = useAiAssistantState();
  
  // Initialize webhook call hook
  const { 
    callWebhook, 
    isThinking, 
    isWebhookFailed, 
    response, 
    rawResponse 
  } = useWebhookCall({
    webhookUrl: n8nWebhookUrl || 'https://minnewyorkofficial.app.n8n.cloud/webhook/ceo-dashboard',
    user,
    onError: (message, id) => {
      setErrorMessage(message);
      setErrorId(id);
      setErrorDialogOpen(true);
    }
  });

  // Query submission handler
  const handleQuerySubmit = async (command?: string) => {
    const currentQuery = command || query;
    if (!currentQuery) return;
    
    // Set the displayed query
    setDisplayedQuery(currentQuery);
    
    // Clear the input field after submission
    setQuery('');
    
    // Call webhook
    await callWebhook(currentQuery);
  };
  
  // Speech handlers
  const {
    handleListen,
    handleClear,
    handleReadAloud
  } = useSpeechHandler({
    setIsListening,
    setQuery,
    setDisplayedQuery,
    setSpeechSupport,
    setShowSpeechAlert,
    setIsSpeaking,
    handleQuerySubmit
  });

  // Collapsed view
  if (!isExpanded) {
    return <CollapsedAssistant setIsExpanded={setIsExpanded} />;
  }

  return (
    <>
      <Card className="fixed bottom-6 right-6 w-96 shadow-xl border border-gray-200 rounded-xl overflow-hidden z-50">
        <AssistantHeader setIsExpanded={setIsExpanded} />
        
        <AiAssistantBody
          displayedQuery={displayedQuery}
          isThinking={isThinking}
          response={response}
          isSpeaking={isSpeaking}
          isWebhookFailed={isWebhookFailed}
          showSpeechAlert={showSpeechAlert}
          setShowSpeechAlert={setShowSpeechAlert}
          speechSupportErrorMessage={speechSupport.errorMessage}
          handleReadAloud={() => handleReadAloud(response)}
          user={user}
        />
        
        <AiAssistantFooter
          query={query}
          setQuery={setQuery}
          isListening={isListening}
          handleListen={handleListen}
          handleClear={handleClear}
          handleQuerySubmit={() => handleQuerySubmit()}
          speechRecognitionSupported={speechSupport.isSupported}
          speechRecognitionErrorMessage={speechSupport.errorMessage}
        />
      </Card>
      
      {/* Error Dialog */}
      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        description={errorMessage}
        id={errorId}
        showHelp={true}
        onHelp={() => {
          window.open('https://minnewyorkofficial.app.n8n.cloud/help', '_blank');
        }}
      />
    </>
  );
};

export default AiAssistant;
