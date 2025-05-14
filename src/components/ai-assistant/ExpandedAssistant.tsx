
import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssistantHeader } from './AssistantHeader';
import { UserQuery } from './UserQuery';
import { ResponseDisplay } from './ResponseDisplay';
import { ThinkingIndicator } from './ThinkingIndicator';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useToast } from '@/hooks/use-toast';

interface ExpandedAssistantProps {
  setIsExpanded: (expanded: boolean) => void;
}

export const ExpandedAssistant = ({ setIsExpanded }: ExpandedAssistantProps) => {
  const [query, setQuery] = useState<string>('');
  const [displayedQuery, setDisplayedQuery] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Use the speech synthesis hook
  const speechSynthesis = useSpeechSynthesis();
  
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    onResponse: () => {
      // When we get a response, update the displayed query to show the user's message
      setDisplayedQuery(query);
    }
  });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);
  
  // Handle read aloud functionality
  const handleReadAloud = (responseText: string) => {
    if (isSpeaking) {
      // Stop speaking if already speaking
      speechSynthesis.stop();
      setIsSpeaking(false);
    } else {
      // Start speaking the response
      if (speechSynthesis.isSupported()) {
        setIsSpeaking(true);
        const result = speechSynthesis.speak(responseText);
        
        if (result.utterance) {
          result.utterance.onend = () => {
            setIsSpeaking(false);
          };
        } else {
          setIsSpeaking(false);
        }
      } else {
        toast({
          title: "Speech Synthesis Not Available",
          description: "Your browser doesn't support speech synthesis",
          variant: "destructive"
        });
      }
    }
  };

  // Handle query submission
  const handleQuerySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (query.trim()) {
      setInput(query);
      setDisplayedQuery(query); // Update displayed query immediately
      handleSubmit(e || new Event('submit') as unknown as React.FormEvent);
      setQuery('');
    }
  };

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-80 md:w-96 shadow-lg border rounded-lg overflow-hidden z-50"
    )}>
      <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between">
        <h3 className="font-medium">AI Assistant</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsExpanded(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea ref={scrollAreaRef} className="h-[300px] p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-sm text-muted-foreground mb-2">
                How can I help you today?
              </p>
              <p className="text-xs text-muted-foreground">
                Ask me about your store data, marketing, or inventory.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2 pb-4">
              {messages.map((message, i) => (
                message.role === 'user' ? (
                  <UserQuery key={message.id || `user-${i}`} displayedQuery={message.content} />
                ) : (
                  <ResponseDisplay 
                    key={message.id || `assistant-${i}`}
                    response={message.content}
                    isSpeaking={isSpeaking}
                    handleReadAloud={() => handleReadAloud(message.content)}
                  />
                )
              ))}
              {isLoading && <ThinkingIndicator isThinking={true} />}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 pt-2 border-t bg-background flex gap-2">
        <form onSubmit={handleQuerySubmit} className="flex gap-2 w-full">
          <Input
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit"
            disabled={isLoading || !query.trim()}
          >
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
