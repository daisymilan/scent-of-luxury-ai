
import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssistantHeader } from './AssistantHeader';
import { AssistantFooter } from './AssistantFooter';
import { UserQuery } from './UserQuery';
import { ResponseDisplay } from './ResponseDisplay';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ExpandedAssistantProps {
  setIsExpanded: (expanded: boolean) => void;
}

export const ExpandedAssistant = ({ setIsExpanded }: ExpandedAssistantProps) => {
  const [query, setQuery] = useState<string>('');
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat();

  // Handle query submission
  const handleQuerySubmit = () => {
    if (query) {
      setInput(query);
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
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
        <ScrollArea className="h-[300px] p-4">
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
              {messages.map((message) => (
                message.role === 'user' ? (
                  <UserQuery key={message.id} content={message.content} />
                ) : (
                  <ResponseDisplay key={message.id} content={message.content} />
                )
              ))}
              {isLoading && <ThinkingIndicator />}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 pt-2 border-t bg-background flex gap-2">
        <Input
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleQuerySubmit();
            }
          }}
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={handleQuerySubmit}
          disabled={isLoading || !query.trim()}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
};
