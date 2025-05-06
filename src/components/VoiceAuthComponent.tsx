
import { useState, useEffect, useRef } from 'react';
import { Mic, Play, ChevronDown, X, Volume2, User, PauseCircle, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VoiceAuthComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([
    'CEO', 
    'CCO', 
    'Commercial Director', 
    'Regional Manager', 
    'Marketing Manager',
    'Production Manager',
    'Customer Support',
    'Social Media Manager'
  ]);
  
  const { voiceLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Reference for speech synthesis
  const speechSynthesisRef = useRef(null);
  const speechUtteranceRef = useRef(null);
  
  // Reference for speech recognition
  const recognitionRef = useRef(null);
  
  // Initialize speech synthesis and recognition
  useEffect(() => {
    // Initialize speech synthesis
    speechSynthesisRef.current = window.speechSynthesis;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognized:', transcript);
        setQuery(transcript);
        handleVoiceLogin(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setResponse("I couldn't hear you clearly. Please try again.");
        toast({
          title: "Voice Recognition Error",
          description: `Could not recognize voice: ${event.error}`,
          variant: "destructive"
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
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
      
      if (speechSynthesisRef.current && speechUtteranceRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [toast]);

  const handleListen = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
        setResponse("Listening... Say 'Login as [role]' to authenticate");
        toast({
          title: "Listening...",
          description: "Say 'Login as [role]' to authenticate"
        });
      } catch (e) {
        console.error('Speech recognition error:', e);
        setIsListening(false);
        setResponse("Error starting voice recognition. Please try again.");
        toast({
          title: "Voice Recognition Error",
          description: "Could not start voice recognition",
          variant: "destructive"
        });
      }
    } else {
      // Fallback for browsers without speech recognition
      setIsListening(true);
      setResponse("Voice recognition is not supported in your browser. Please type your login command.");
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition. Please try another browser or use text input.",
        variant: "destructive"
      });
      
      // Simulate voice recognition with mock data after 2 seconds
      setTimeout(() => {
        setIsListening(false);
      }, 2000);
    }
  };

  const handleVoiceLogin = async (command) => {
    if (!command) return;
    
    setIsAuthenticating(true);
    console.log("Processing voice command:", command);
    
    try {
      // Use the voiceLogin from AuthContext
      await voiceLogin(command);
      setResponse(`Voice authentication successful. Welcome to MiN NEW YORK dashboard.`);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Voice authentication error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Voice authentication failed';
      setResponse(`Authentication failed: ${errorMessage}. Please try again or use traditional login.`);
      toast({
        title: "Authentication Failed",
        description: "Voice login was unsuccessful. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleReadAloud = () => {
    if (!response) return;
    
    if (speechSynthesisRef.current) {
      if (isSpeaking) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
        return;
      }
      
      speechUtteranceRef.current = new SpeechSynthesisUtterance(response);
      
      // Get available voices and choose a good one
      const voices = speechSynthesisRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') && voice.name.includes('Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen')
      );
      
      if (preferredVoice) {
        speechUtteranceRef.current.voice = preferredVoice;
      }
      
      speechUtteranceRef.current.rate = 0.9; // Slightly slower than default
      speechUtteranceRef.current.pitch = 1.1; // Slightly higher pitch
      
      speechUtteranceRef.current.onend = () => {
        setIsSpeaking(false);
      };
      
      setIsSpeaking(true);
      speechSynthesisRef.current.speak(speechUtteranceRef.current);
    } else {
      setResponse("Text-to-speech is not supported in your browser.");
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = () => {
    handleVoiceLogin(query);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 shadow-xl border border-gray-200 rounded-xl overflow-hidden z-50 bg-white">
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold flex items-center">
          <Shield className="mr-2 h-5 w-5" /> Voice Authentication
        </h3>
      </div>
      
      <div className="p-4 h-80 overflow-y-auto bg-gray-50">
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">Say "Login as [role]" to authenticate with your voice</p>
          <p className="mt-1 text-xs">Available roles: {availableRoles.join(', ')}</p>
        </div>
        
        {response && (
          <div className="mb-4">
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                <Shield className="h-4 w-4" />
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%]">
                <p className="text-sm">{response}</p>
              </div>
            </div>
            <div className="flex justify-start ml-10 space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs"
                onClick={handleReadAloud}
              >
                {isSpeaking ? (
                  <>
                    <PauseCircle className="h-4 w-4 mr-1" /> Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-1" /> Read Aloud
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        {isAuthenticating && (
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
              <Shield className="h-4 w-4" />
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex space-x-1 items-center">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        {query && (
          <div className="flex items-start justify-end mb-4">
            <div className="bg-primary bg-opacity-10 p-3 rounded-lg max-w-[85%]">
              <p className="text-sm">{query}</p>
            </div>
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
              <User className="h-4 w-4" />
            </div>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <div 
            className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white shadow-lg relative cursor-pointer hover:bg-primary/90"
            onClick={handleListen}
          >
            <Mic className="h-10 w-10" />
            <span className="absolute -bottom-8 text-gray-500 text-sm font-medium">Tap to Login with Voice</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Say 'Login as CEO'..."
              value={query}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {query && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-8 w-8" 
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isListening ? (
            <Button 
              className="rounded-full bg-red-500 hover:bg-red-600 h-10 w-10 flex-shrink-0" 
              onClick={() => {
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.stop();
                  } catch (e) {
                    console.log('Recognition already stopped');
                  }
                }
                setIsListening(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button 
                className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 flex-shrink-0" 
                onClick={handleListen}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button 
                className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 flex-shrink-0"
                onClick={handleSubmit}
                disabled={!query}
              >
                <Play className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
        
        <div className="text-center mt-3">
          <a href="/login" className="text-xs text-primary hover:text-primary/80">
            Return to traditional login
          </a>
        </div>
      </div>
    </div>
  );
};

export default VoiceAuthComponent;
