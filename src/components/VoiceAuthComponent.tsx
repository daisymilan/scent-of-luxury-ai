
import { useState, useEffect, useRef } from 'react';
import { Mic, Play, X, Volume2, User, PauseCircle, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VoiceAuthComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
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
  
  const { user, voiceLogin } = useAuth();
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
        processVoiceCommand(transcript);
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
    
    // Set initial welcome message if user is logged in
    if (user) {
      setResponse(`Welcome back, ${user.name}. How can I assist you?`);
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
  }, [user, toast]);

  const handleListen = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
        setResponse("Listening... How can I help you?");
        toast({
          title: "Listening...",
          description: "Say a command or ask a question"
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
      setResponse("Voice recognition is not supported in your browser. Please type your command.");
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

  const processVoiceCommand = async (command) => {
    if (!command) return;
    
    setIsAuthenticating(true);
    console.log("Processing voice command:", command);
    
    try {
      const lowerCommand = command.toLowerCase();
      
      // Navigation commands
      if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to') || lowerCommand.includes('open')) {
        if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
          setResponse("Navigating to the dashboard...");
          setTimeout(() => navigate('/'), 1500);
          
        } else if (lowerCommand.includes('b2b') || lowerCommand.includes('business')) {
          setResponse("Navigating to B2B page...");
          setTimeout(() => navigate('/b2b'), 1500);
          
        } else if (lowerCommand.includes('marketing')) {
          setResponse("Navigating to Marketing page...");
          setTimeout(() => navigate('/marketing'), 1500);
          
        } else if (lowerCommand.includes('inventory')) {
          setResponse("Navigating to Inventory page...");
          setTimeout(() => navigate('/inventory'), 1500);
          
        } else if (lowerCommand.includes('reports')) {
          setResponse("Navigating to Reports page...");
          setTimeout(() => navigate('/reports'), 1500);
          
        } else if (lowerCommand.includes('profile')) {
          setResponse("Navigating to Profile page...");
          setTimeout(() => navigate('/profile'), 1500);
          
        } else if (lowerCommand.includes('preferences') || lowerCommand.includes('settings')) {
          setResponse("Navigating to Preferences page...");
          setTimeout(() => navigate('/preferences'), 1500);
          
        } else {
          setResponse("I'm not sure which page you want to navigate to. Available pages are: Dashboard, B2B, Marketing, Inventory, Reports, Profile, and Preferences.");
        }
      } 
      // Logout command
      else if (lowerCommand.includes('logout') || lowerCommand.includes('sign out') || lowerCommand.includes('log out')) {
        setResponse("Logging you out...");
        setTimeout(() => navigate('/login'), 1500);
      }
      // Voice login commands - only process if user is not already logged in
      else if (lowerCommand.includes('login') && !user) {
        // Use the voiceLogin from AuthContext
        await voiceLogin(command);
        setResponse(`Voice authentication successful. Welcome to MiN NEW YORK dashboard.`);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
      // Help command
      else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
        setResponse("I can help you navigate to different pages, log out, or provide information. Try saying 'Go to Dashboard', 'Navigate to Reports', or 'Log out'.");
      }
      // Default response
      else {
        setResponse("I'm not sure how to process that command. Try asking for help or use navigation commands like 'Go to Dashboard'.");
      }
    } catch (error) {
      console.error("Voice command processing error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Voice command processing failed';
      setResponse(`Error: ${errorMessage}. Please try again.`);
      toast({
        title: "Command Processing Failed",
        description: "Could not process your voice command. Please try again.",
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
    processVoiceCommand(query);
  };

  const handleClear = () => {
    setQuery('');
  };

  // Toggle the visibility of the component
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // If minimized, show only a floating button
  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg cursor-pointer flex items-center justify-center z-50 hover:bg-primary/90"
        onClick={toggleMinimize}
      >
        <Mic className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 shadow-xl border border-gray-200 rounded-xl overflow-hidden z-50 bg-white">
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold flex items-center">
          <Shield className="mr-2 h-5 w-5" /> Voice Assistant
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleMinimize}
            className="hover:bg-primary-dark rounded-full h-8 w-8 flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-4 h-80 overflow-y-auto bg-gray-50">
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
            <span className="absolute -bottom-8 text-gray-500 text-sm font-medium">Tap to Speak</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type a command..."
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
      </div>
    </div>
  );
};

export default VoiceAuthComponent;
