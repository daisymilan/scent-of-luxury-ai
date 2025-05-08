import { useState, useRef, useEffect } from 'react';
import { Mic, Play, ChevronDown, X, Volume2, PauseCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { callGrokApi, getGrokApiConfig } from '@/utils/grokApi';
import { getN8nConfig } from '@/components/N8nConfig';

const AiAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Reference for speech synthesis
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Reference for speech recognition
  const recognitionRef = useRef<any>(null);
  
  // Check if Grok is configured
  const [isGrokConfigured, setIsGrokConfigured] = useState(false);
  
  // Check if n8n is configured
  const [isN8nConfigured, setIsN8nConfigured] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>('');
  
  // Initialize speech synthesis and recognition
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
    
    // Initialize speech synthesis
    speechSynthesisRef.current = window.speechSynthesis;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognized:', transcript);
        setQuery(transcript);
        // Immediately submit the query after voice recognition
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
      
      if (speechSynthesisRef.current && speechUtteranceRef.current) {
        speechSynthesisRef.current.cancel();
      }
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
    if (recognitionRef.current) {
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
    } else {
      // Fallback for browsers without speech recognition
      setIsListening(true);
      // Simulate voice recognition with mock data
      setTimeout(() => {
        const randomQueries = [
          "How are sales performing this month?",
          "What's our inventory status?",
          "Show me today's revenue",
          "How many orders came in today?"
        ];
        const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
        setQuery(randomQuery);
        setIsListening(false);
        handleQuerySubmit(randomQuery);
      }, 2000);
    }
  };

  // Function to call n8n webhook or fallback to Grok API
  const handleQuerySubmit = async (command?: string) => {
    const currentQuery = command || query;
    if (!currentQuery) return;
    
    // Clear previous response and show thinking state
    setResponse('');
    setIsThinking(true);
    
    try {
      let responseText;
      
      // First try the n8n webhook
      if (n8nWebhookUrl) {
        try {
          console.log('Calling n8n webhook with query:', currentQuery);
          const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: currentQuery,
              user: user ? {
                role: user.role,
                id: user.id,
                name: user.name
              } : {
                role: 'Guest',
                id: 'guest',
                name: 'Guest User'
              },
              timestamp: new Date().toISOString()
            })
          });

          if (response.ok) {
            const data = await response.json();
            responseText = data.response || data.message || data.answer;
            console.log('n8n webhook response:', data);
          } else {
            console.error('n8n webhook error:', response.statusText);
            throw new Error(`n8n webhook error: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error calling n8n webhook:', error);
          // If n8n webhook fails, try Grok or fallback
          if (isGrokConfigured) {
            responseText = await callGrokApi(currentQuery);
          } else {
            throw error;
          }
        }
      } else if (isGrokConfigured) {
        // Use the Grok API if configured and n8n is not available
        responseText = await callGrokApi(currentQuery);
      } else {
        // Use mock implementation if neither Grok nor n8n is configured
        const lowerCommand = currentQuery.toLowerCase();
        
        if (lowerCommand.includes('sales') || lowerCommand.includes('revenue')) {
          responseText = `Sales are up 12.4% compared to last month. The best performing product is Dune Fragrance with 128 units sold, generating $22,400 in revenue. Would you like a detailed breakdown by product category or sales channel?`;
        } else if (lowerCommand.includes('inventory') || lowerCommand.includes('stock')) {
          responseText = `Current inventory status: Moon Dust: 254 units, Dune: 128 units, Dahab: 89 units. The Las Vegas warehouse is running low on Moon Dust with only 28 units remaining. Should I prepare a reorder report?`;
        } else if (lowerCommand.includes('order') || lowerCommand.includes('purchase')) {
          responseText = `Today we've received 37 new orders totaling $8,450. There are 5 pending shipments and 2 orders flagged for review due to potential fraud. Would you like details on those orders?`;
        } else if (lowerCommand.includes('marketing') || lowerCommand.includes('campaign')) {
          responseText = `The current Instagram campaign has reached 245,000 impressions with a 3.8% engagement rate. This is 0.7% above our benchmarks. The TikTok campaign is launching tomorrow. Would you like me to schedule a performance report for next week?`;
        } else if (lowerCommand.includes('kpi')) {
          responseText = `The latest KPIs show that revenue is at $345,000, which is 8% above target. Customer acquisition cost is down 12% at $32 per customer, and average order value increased by 5% to $175. Would you like to see the full KPI dashboard?`;
        } else {
          responseText = `I understand you're asking about "${currentQuery}". As this is a demonstration, I can provide insights on sales, inventory, orders, KPIs, and marketing campaigns. Please try asking about one of these areas.`;
        }
      }
      
      console.log('Final AI response:', responseText);
      setResponse(responseText);
      
      // Clear the input field after submission whether it was typed or voice
      setQuery('');
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Query Processing Error",
        description: error instanceof Error ? error.message : "Failed to process your request",
        variant: "destructive",
      });
      setResponse("I'm sorry, I couldn't process your request at this time. Please try again later.");
      
      // Clear the input field even on error
      setQuery('');
    } finally {
      setIsThinking(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResponse('');
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    setIsSpeaking(false);
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
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive"
      });
    }
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
    <Card className="fixed bottom-6 right-6 w-96 shadow-xl border border-gray-200 rounded-xl overflow-hidden z-50">
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold">MIN NEW YORK AI Assistant</h3>
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
        {!n8nWebhookUrl && !isGrokConfigured && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            Neither n8n nor Grok API is configured. Using simulated responses. Go to Integrations to configure the APIs.
          </div>
        )}
      
        {response && (
          <div className="mb-4">
            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                M
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-[85%]">
                <p className="text-sm">{response}</p>
              </div>
            </div>
            <div className="flex justify-start ml-10 space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs flex items-center"
                onClick={handleReadAloud}
              >
                {isSpeaking ? (
                  <>
                    <PauseCircle size={14} className="mr-1" /> Stop Reading
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="mr-1" /> Read Aloud
                  </>
                )}
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                See Details
              </Button>
            </div>
          </div>
        )}
        
        {isThinking && (
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
              M
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

        <div className="mb-2 text-center text-sm text-gray-600">
          <p>Try asking about: sales, KPIs, inventory, orders, or marketing campaigns</p>
          {user?.role === 'CEO' && <p className="mt-1 text-xs opacity-75">Premium insights available for CEO role</p>}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ask anything..."
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
        
        <div className="flex justify-between mt-2 px-2 text-xs text-gray-500">
          <button className="hover:text-gray-800">Suggested Questions</button>
          <button className="hover:text-gray-800">Help</button>
        </div>
      </div>
    </Card>
  );
};

export default AiAssistant;
