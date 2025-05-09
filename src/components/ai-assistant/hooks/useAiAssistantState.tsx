
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getN8nConfig } from '@/components/N8nConfig';
import { checkSpeechRecognitionSupport, SpeechSupportResult } from '@/components/ai-assistant/SpeechRecognition';
import { getGrokApiConfig } from '@/utils/grokApi';

export function useAiAssistantState() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Speech recognition support state
  const [speechSupport, setSpeechSupport] = useState<SpeechSupportResult>({
    isSupported: true,
    errorMessage: null
  });
  const [showSpeechAlert, setShowSpeechAlert] = useState(false);
  
  // Error dialog state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorId, setErrorId] = useState('');
  
  // n8n webhook config
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>('');
  const [isN8nConfigured, setIsN8nConfigured] = useState(false);
  const [isGrokConfigured, setIsGrokConfigured] = useState(false);
  
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
    
    // Check for speech recognition support
    const supportResult = checkSpeechRecognitionSupport();
    console.log("Speech recognition support check result:", supportResult);
    setSpeechSupport(supportResult);
    setShowSpeechAlert(!supportResult.isSupported);
  }, []);
  
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

  return {
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
    n8nWebhookUrl,
    isN8nConfigured,
    isGrokConfigured
  };
}
