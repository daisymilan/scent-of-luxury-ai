
import { useState } from 'react';
import { Mic, Play, ChevronDown, X, Volume2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const VoiceAuthAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { voiceLogin } = useAuth();
  const { toast } = useToast();

  const handleListen = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const voiceCommands = [
        "Login as CEO",
        "Login as CCO",
        "Login as Commercial Director",
        "Login as Regional Manager",
        "Login as Marketing Manager"
      ];
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setQuery(randomCommand);
      setIsListening(false);
      handleQuerySubmit(randomCommand);
    }, 2000);
  };

  const handleQuerySubmit = async (command?: string) => {
    const voiceCommand = command || query;
    if (!voiceCommand) return;
    
    setIsThinking(true);
    
    try {
      // If the query contains login keywords, attempt voice login
      if (voiceCommand.toLowerCase().includes('login')) {
        await voiceLogin(voiceCommand);
        setResponse(`Voice authentication successful. Welcome to MiN NEW YORK dashboard.`);
      } else {
        // Regular assistant response
        setResponse("I'm sorry, I can only handle login requests at this time. Please say 'Login as [role]' to authenticate.");
      }
    } catch (error) {
      setResponse("Voice authentication failed. Please try again or use traditional login.");
      toast({
        title: "Authentication Failed",
        description: "Voice login was unsuccessful. Please try again.",
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

  if (!isExpanded) {
    return (
      <Button 
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
        onClick={() => setIsExpanded(true)}
      >
        <Mic size={20} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-xl border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold">Voice Authentication</h3>
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
        <div className="mb-4 text-center text-sm text-gray-600">
          <p>Say "Login as [role]" to authenticate with your voice</p>
          <p className="mt-1 text-xs">Available roles: CEO, CCO, Commercial Director, Regional Manager, Marketing Manager</p>
        </div>
        
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
              placeholder="Say 'Login as CEO'..."
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
              onClick={() => setIsListening(false)}
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

export default VoiceAuthAssistant;
