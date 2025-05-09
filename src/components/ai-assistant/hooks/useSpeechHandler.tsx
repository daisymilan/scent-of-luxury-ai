
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createSpeechRecognition, checkSpeechRecognitionSupport } from '@/components/ai-assistant/SpeechRecognition';
import { useSpeechSynthesis } from '@/components/ai-assistant/useSpeechSynthesis';

interface SpeechHandlerProps {
  setIsListening: (value: boolean) => void;
  setQuery: (value: string) => void;
  setDisplayedQuery: (value: string) => void;
  setSpeechSupport: (value: any) => void;
  setShowSpeechAlert: (value: boolean) => void;
  setIsSpeaking: (value: boolean) => void;
  handleQuerySubmit: (query?: string) => void;
}

export function useSpeechHandler({
  setIsListening,
  setQuery,
  setDisplayedQuery,
  setSpeechSupport,
  setShowSpeechAlert,
  setIsSpeaking,
  handleQuerySubmit
}: SpeechHandlerProps) {
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Initialize speech synthesis hook
  const speechSynthesis = useSpeechSynthesis();
  
  // Initialize speech recognition
  useEffect(() => {
    console.log("Initializing speech recognition");
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
        
        if (event.error === 'not-supported') {
          setSpeechSupport({
            isSupported: false,
            errorMessage: event.message || "Speech recognition not supported"
          });
          setShowSpeechAlert(true);
        } else {
          toast({
            title: "Voice Recognition Error",
            description: event.message || `Could not recognize voice: ${event.error}`,
            variant: "destructive"
          });
        }
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
    
    // If recognition initialization fails, we'll need to update the support status
    if (!recognitionRef.current) {
      const supportResult = checkSpeechRecognitionSupport();
      console.log("Speech recognition support check result:", supportResult);
      setSpeechSupport(supportResult);
      setShowSpeechAlert(!supportResult.isSupported);
    }
    
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
  }, [toast, handleQuerySubmit, setDisplayedQuery, setIsListening, setQuery, setSpeechSupport, setShowSpeechAlert]);
  
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
  
  const handleClear = () => {
    setQuery('');
    setDisplayedQuery(''); 
    if (speechSynthesis.isSupported()) {
      speechSynthesis.stop();
    }
    setIsSpeaking(false);
    
    // Also stop recognition if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }
      setIsListening(false);
    }
  };
  
  const handleReadAloud = (response: string) => {
    if (!response) return;
    
    if (speechSynthesis.isSupported()) {
      if (speechSynthesis.isSpeaking()) {
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
  
  return {
    handleListen,
    handleClear,
    handleReadAloud
  };
}
