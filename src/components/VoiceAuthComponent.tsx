
import { useState, useRef, useEffect } from 'react';
import { Mic, Play, ChevronDown, X, Volume2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { callGrokApi } from '@/utils/grokApi';

const VoiceAuthComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { voiceLogin, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Reference for speech recognition
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognized:', transcript);
        setQuery(transcript);
        handleQuerySubmit(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
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
    };
  }, [toast]);

  const handleListen = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
        toast({
          title: "Listening...",
          description: isAuthenticated 
            ? "Say a command or ask a question" 
            : "Say 'Login as [role]' to authenticate"
        });
      } catch (e) {
        console.error('Speech recognition error:', e);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not start voice recognition",
          variant: "destructive"
        });
      }
    } else {
      // Fallback for browsers without speech recognition
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition. Please try another browser or use text input.",
        variant: "destructive"
      });
      
      // Simulate voice recognition with mock data (for demonstration)
      setIsListening(true);
      setTimeout(() => {
        const voiceCommands = isAuthenticated 
          ? ["Show me sales data", "Go to dashboard", "Check inventory", "Logout"]
          : ["Login as CEO", "Login as CCO", "Login as Commercial Director", "Login as Regional Manager"];
        const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
        setQuery(randomCommand);
        setIsListening(false);
        handleQuerySubmit(randomCommand);
      }, 2000);
    }
  };

  const handleQuerySubmit = async (command?: string) => {
    const voiceCommand = command || query;
    if (!voiceCommand) return;
    
    setIsThinking(true);
    console.log("Processing voice command:", voiceCommand);
    
    try {
      // Process navigation commands
      const lowerCommand = voiceCommand.toLowerCase();
      
      // Handle navigation commands
      if (isAuthenticated) {
        if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
          if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
            navigate('/');
            setResponse(`Navigating to dashboard.`);
            setIsThinking(false);
            return;
          } else if (lowerCommand.includes('b2b')) {
            navigate('/b2b');
            setResponse(`Navigating to B2B page.`);
            setIsThinking(false);
            return;
          } else if (lowerCommand.includes('marketing')) {
            navigate('/marketing');
            setResponse(`Navigating to marketing page.`);
            setIsThinking(false);
            return;
          } else if (lowerCommand.includes('inventory')) {
            navigate('/inventory');
            setResponse(`Navigating to inventory page.`);
            setIsThinking(false);
            return;
          } else if (lowerCommand.includes('reports')) {
            navigate('/reports');
            setResponse(`Navigating to reports page.`);
            setIsThinking(false);
            return;
          } else if (lowerCommand.includes('profile')) {
            navigate('/profile');
            setResponse(`Navigating to your profile.`);
            setIsThinking(false);
            return;
          } else if (lowerCommand.includes('settings')) {
            navigate('/settings/system');
            setResponse(`Navigating to system settings.`);
            setIsThinking(false);
            return;
          }
        } else if (lowerCommand.includes('logout')) {
          // Handle logout command
          navigate('/login');
          setResponse(`Logging you out.`);
          window.location.reload(); // Force a reload to clear authentication
          setIsThinking(false);
          return;
        }
      }
      
      // If the query contains login keywords, attempt voice login
      if (lowerCommand.includes('login') && !isAuthenticated) {
        await voiceLogin(voiceCommand);
        setResponse(`Voice authentication successful. Welcome to MiN NEW YORK dashboard.`);
        setIsThinking(false);
        return;
      } 
      
      // If authenticated and not a navigation command, try to use Grok API for business insights
      if (isAuthenticated) {
        try {
          const grokResponse = await callGrokApi(voiceCommand);
          setResponse(grokResponse);
        } catch (error) {
          console.error("Grok API error:", error);
          setResponse("I'm sorry, I couldn't process your request through our AI system. Please try again later.");
        }
      } else {
        // Regular assistant response for unauthenticated users
        setResponse("I'm sorry, I can only handle login requests at this time. Please say 'Login as [role]' to authenticate.");
      }
    } catch (error) {
      console.error("Voice processing error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Voice command processing failed';
      setResponse(`Error: ${errorMessage}. Please try again.`);
      toast({
        title: "Command Processing Failed",
        description: "Could not process your voice command. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResponse('');
  };

  // Return minimized version when not expanded
  if (!isExpanded) {
    return (
      <Button 
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90 z-50"
        onClick={() => setIsExpanded(true)}
      >
        <Mic size={20} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-xl border border-gray-200 rounded-xl overflow-hidden z-50">
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold">
          {isAuthenticated ? 'Voice Assistant' : 'Voice Authentication'}
        </h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-primary/50"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronDown size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-primary/50"
            onClick={() => setIsExpanded(false)}
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
        {!isAuthenticated && (
          <div className="mb-4 text-center text-sm text-gray-600">
            <p>Say "Login as [role]" to authenticate with your voice</p>
            <p className="mt-1 text-xs">Available roles: CEO, CCO, Commercial Director, Regional Manager, Marketing Manager</p>
          </div>
        )}

        {isAuthenticated && (
          <div className="mb-4 text-center text-sm text-gray-600">
            <p>Welcome, {user?.name} ({user?.role})</p>
            <p className="mt-1 text-xs">Try voice commands like "Go to dashboard", "Show me sales data", or "Check inventory"</p>
          </div>
        )}
        
        {response && (
          <div className="mb-4">
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                G
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%]">
                <p className="text-sm">{response}</p>
              </div>
            </div>
            <div className="flex justify-start ml-10 space-x-2">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Volume2 size={14} className="mr-1" /> Read Aloud
              </Button>
            </div>
          </div>
        )}
        
        {isThinking && (
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
              G
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
              <User size={16} />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={isAuthenticated ? "Ask something..." : "Say 'Login as CEO'..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
            />
            {query && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-8 w-8" 
                onClick={handleClear}
              >
                <X size={16} />
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
                onClick={() => handleQuerySubmit()}
                disabled={!query}
              >
                <Play size={20} />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VoiceAuthComponent;
