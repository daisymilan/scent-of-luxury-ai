
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getN8nConfig } from '@/components/N8nConfig';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { CollapsedAssistant } from '@/components/ai-assistant/CollapsedAssistant';
import { AssistantHeader } from '@/components/ai-assistant/AssistantHeader';
import { WebhookError } from '@/components/ai-assistant/WebhookError';
import { UserQuery } from '@/components/ai-assistant/UserQuery';
import { ThinkingIndicator } from '@/components/ai-assistant/ThinkingIndicator';
import { ResponseDisplay } from '@/components/ai-assistant/ResponseDisplay';
import { AssistantFooter } from '@/components/ai-assistant/AssistantFooter';
import { QueryInput } from '@/components/ai-assistant/QueryInput';
import { AssistantToggles } from '@/components/ai-assistant/AssistantToggles';
import { SuggestionLinks } from '@/components/ai-assistant/SuggestionLinks';
import { createSpeechRecognition } from '@/components/ai-assistant/SpeechRecognition';
import { useSpeechSynthesis } from '@/components/ai-assistant/useSpeechSynthesis';
import { useWebhookCall } from '@/components/ai-assistant/useWebhookCall';
import { getGrokApiConfig } from '@/utils/grokApi';

const AiAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Error dialog state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorId, setErrorId] = useState('');
  
  // n8n webhook config
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>('');
  const [isN8nConfigured, setIsN8nConfigured] = useState(false);
  const [isGrokConfigured, setIsGrokConfigured] = useState(false);
  
  // Initialize speech synthesis hook
  const speechSynthesis = useSpeechSynthesis();
  
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

  // Speech recognition reference
  const recognitionRef = { current: null as any };
  
  // Check if Grok and n8n are configured on mount
  useEffect(() => {
    // Check Grok configuration
    setIsGrokConfigured(!!getGrokApiConfig());
    
    // Check n8n configuration
    const n8nConfig = getN8nConfig();
    setIsN8nConfigured(!!n8nConfig && !!n8nConfig.webhookUrl);
    if (n8nConfig && n8nConfig.webhookUrl) {
      setN8nWebhookUrl(n8nConfig.webhookUrl);
    } else {
      // Default webhook URL if not configured in n8n settings
      setN8nWebhookUrl('https://minnewyorkofficial.app.n8n.cloud/webhook/ceo-dashboard');
    }
    
    // Initialize speech recognition
    recognitionRef.current = createSpeechRecognition({
      onResult: (transcript) => {
        console.log('Voice recognized:', transcript);
        setQuery('');
        setDisplayedQuery(transcript);
        
        // Immediately submit the query after voice recognition
        handleQuerySubmit(transcript);
      },
      onError: (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: `Could not recognize voice: ${event.error}`,
          variant: "destructive"
        });
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Speech recognition was not started');
        }
      }
      
      speechSynthesis.stop();
    };
  }, [toast]);
  
  // Check for Grok and n8n config changes
  useEffect(() => {
    const checkConfigs = () => {
      setIsGrokConfigured(!!getGrokApiConfig());
      
      const n8nConfig = getN8nConfig();
      setIsN8nConfigured(!!n8nConfig && !!n8nConfig.webhookUrl);
      if (n8nConfig && n8nConfig.webhookUrl) {
        setN8nWebhookUrl(n8nConfig.webhookUrl);
      }
    };
    
    // Check initially
    checkConfigs();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkConfigs);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkConfigs);
    };
  }, []);

  const handleListen = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }
    
    setIsListening(true);
    try {
      recognitionRef.current.start();
      toast({
        title: "Listening...",
        description: "Speak now to interact with the assistant"
      });
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

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

  const handleClear = () => {
    setQuery('');
    setDisplayedQuery(''); 
    if (speechSynthesis.isSupported()) {
      speechSynthesis.stop();
    }
    setIsSpeaking(false);
    
    // Also stop recognition if active
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }
      setIsListening(false);
    }
  };

  const handleReadAloud = () => {
    if (!response) return;
    
    if (speechSynthesis.isSupported()) {
      if (isSpeaking) {
        speechSynthesis.stop();
        setIsSpeaking(false);
        return;
      }
      
      setIsSpeaking(true);
      const result = speechSynthesis.speak(response);
      
      if (result.utterance) {
        result.utterance.onend = () => {
          setIsSpeaking(false);
        };
      } else {
        setIsSpeaking(false);
      }
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive"
      });
    }
  };

  // Collapsed view
  if (!isExpanded) {
    return <CollapsedAssistant setIsExpanded={setIsExpanded} />;
  }

  return (
    <>
      <Card className="fixed bottom-6 right-6 w-96 shadow-xl border border-gray-200 rounded-xl overflow-hidden z-50">
        <AssistantHeader setIsExpanded={setIsExpanded} />
        
        <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
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
        
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <QueryInput
              query={query}
              setQuery={setQuery}
              handleQuerySubmit={() => handleQuerySubmit()}
              handleClear={handleClear}
            />
            
            <AssistantToggles
              query={query}
              isListening={isListening}
              handleListen={handleListen}
              handleClear={handleClear}
              handleQuerySubmit={() => handleQuerySubmit()}
            />
          </div>
          
          <SuggestionLinks />
        </div>
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
