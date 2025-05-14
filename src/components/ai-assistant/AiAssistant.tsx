
// Fixing just the TypeScript error in AiAssistant.tsx where User type doesn't match required props
// We need to make sure the User type is properly handled when passing to components

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BotAvatar } from "@/components/ai-assistant/BotAvatar";
import { useSpeechHandler } from '@/components/ai-assistant/hooks/useSpeechHandler';
import { checkSpeechRecognitionSupport } from '@/components/ai-assistant/SpeechRecognition';
import { ModeToggle } from "@/components/ModeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
}

const AiAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupport, setSpeechSupport] = useState(checkSpeechRecognitionSupport());
  const [showSpeechAlert, setShowSpeechAlert] = useState(!speechSupport.isSupported);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [displayedQuery, setDisplayedQuery] = useState('');
  const bottomRef = useRef(null);
  const { isAuthenticated, currentUser } = useAuth();
  
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop
  } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      console.log("Finished request, here's the message", message);
    },
    onError: (error) => {
      console.error("Error during chat:", error);
    }
  });
  
  const { handleListen, handleClear, handleReadAloud } = useSpeechHandler({
    setIsListening,
    setQuery: setInput,
    setDisplayedQuery,
    setSpeechSupport,
    setShowSpeechAlert,
    setIsSpeaking,
    handleQuerySubmit: (query: string) => {
      if (query) {
        handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>, { data: { query } });
      }
    }
  });
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle authentication state
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthUser(null);
      return;
    }
    
    // Fix the type error by ensuring the user data has all required properties
    if (currentUser) {
      const processedUser = {
        id: currentUser.id,
        name: currentUser.name || currentUser.email || 'User',
        role: currentUser.role || 'User'
      };
      
      setAuthUser(processedUser);
    } else {
      setAuthUser(null);
    }
  }, [isAuthenticated, currentUser]);
  
  const handleQuerySubmit = () => {
    if (input) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t dark:border-t-muted/50 bg-background">
      <div className="mx-auto w-full max-w-md py-2">
        <ScrollArea className="h-[200px] rounded-md border p-4">
          {messages.map((message) => {
            if (message.role === 'user') {
              return (
                <div key={message.id} className="grid gap-1.5">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Your Avatar" />
                      <AvatarFallback>{authUser?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="ml-2 font-medium">{authUser?.name}</p>
                  </div>
                  <Card className="w-[350px] ml-10">
                    <CardContent className="break-words whitespace-pre-line py-2 text-sm">
                      {message.content}
                    </CardContent>
                  </Card>
                </div>
              );
            } else if (message.role === 'assistant') {
              return (
                <div key={message.id} className="grid gap-1.5">
                  <div className="flex items-center">
                    <BotAvatar />
                    <p className="ml-2 font-medium">Assistant</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 p-0 data-[state=open]:bg-muted"
                      onClick={() => handleReadAloud(message.content)}
                    >
                      {isSpeaking ? 'Stop' : 'Read'}
                    </Button>
                  </div>
                  <Card className="w-[350px] ml-10">
                    <CardContent className="break-words whitespace-pre-line py-2 text-sm">
                      {message.content}
                    </CardContent>
                  </Card>
                </div>
              );
            }
            return null;
          })}
          <div ref={bottomRef} />
        </ScrollArea>
        <Card className="w-full border-none shadow-none">
          <CardFooter className="flex items-center gap-4 px-0 py-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="Your Avatar" />
              <AvatarFallback>{authUser?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input
              type="search"
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              value={displayedQuery || input}
              onChange={handleInputChange}
              className="h-10 w-full rounded-r-none border-r-0"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="h-10 rounded-l-none"
              onClick={() => handleQuerySubmit()}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Send"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="ml-auto shrink-0"
              onClick={handleListen}
              disabled={isLoading}
            >
              <Sparkles className={cn("h-4 w-4", isListening && "animate-pulse text-sky-500")} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto shrink-0"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </Button>
            <ModeToggle />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AiAssistant;
