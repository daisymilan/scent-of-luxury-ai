// src/components/VoiceEnrollment.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Check if browser supports the Web Speech API
const browserSupportsSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

// Create speech recognition instance
const SpeechRecognition = browserSupportsSpeechRecognition
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

// SVG icons
const MicrophoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

interface VoiceEnrollmentProps {
  passphrase?: string;
  requiredSamples?: number;
  onComplete: (voiceSamples: string[]) => Promise<boolean>;
  onSkip?: () => void;
}

const VoiceEnrollment: React.FC<VoiceEnrollmentProps> = ({
  passphrase = 'scent of luxury',
  requiredSamples = 3,
  onComplete,
  onSkip
}) => {
  // States
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
  const [samples, setSamples] = useState<string[]>([]);
  const [currentSample, setCurrentSample] = useState<number>(1);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState<boolean | null>(null);
  
  // Refs
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  
  // Hooks
  const { toast } = useToast();
  
  // Check if browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setStatus('error');
      setErrorMessage('Your browser does not support voice recognition. Please use Chrome, Edge, or another modern browser.');
      return;
    }
    
    // Check for microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setIsMicrophoneAvailable(true);
      })
      .catch(() => {
        setIsMicrophoneAvailable(false);
        setStatus('error');
        setErrorMessage('Microphone access denied. Please allow microphone access in your browser settings.');
      });
      
    // Initialize speech recognition
    if (browserSupportsSpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Set up event handlers
      recognitionRef.current.onstart = () => {
        setStatus('listening');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        
        setTranscript(currentTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        
        if (event.error === 'not-allowed') {
          setIsMicrophoneAvailable(false);
          setStatus('error');
          setErrorMessage('Microphone access denied. Please allow microphone access in your browser settings.');
        } else {
          setStatus('error');
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognitionRef.current.onend = () => {
        if (status === 'listening') {
          setStatus('idle');
        }
      };
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status]);
  
  // Process transcript for passphrase
  useEffect(() => {
    if (status === 'listening' && transcript) {
      // Check if transcript contains passphrase
      if (transcript.toLowerCase().includes(passphrase.toLowerCase())) {
        stopListening();
        setStatus('processing');
        
        // Add sample after a short delay to simulate processing
        setTimeout(() => {
          // Add the sample
          const newSamples = [...samples, transcript];
          setSamples(newSamples);
          
          // Increment current sample or complete if done
          if (newSamples.length < requiredSamples) {
            setCurrentSample(newSamples.length + 1);
            setStatus('idle');
            setTranscript('');
          } else {
            submitSamples(newSamples);
          }
        }, 800);
      }
    }
  }, [transcript, status, samples, passphrase, requiredSamples]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setTranscript('');
    
    try {
      recognitionRef.current.start();
      
      // Set a timeout to stop listening if no passphrase is detected
      timeoutRef.current = setTimeout(() => {
        if (status === 'listening') {
          stopListening();
          setStatus('error');
          setErrorMessage('No voice detected or passphrase not recognized. Please try again.');
        }
      }, 10000); // 10 seconds timeout
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setStatus('error');
      setErrorMessage('Failed to start voice recognition. Please try again.');
    }
  }, [status]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }, []);
  
  // Submit samples to complete enrollment
  const submitSamples = async (voiceSamples: string[]) => {
    setStatus('processing');
    
    try {
      const success = await onComplete(voiceSamples);
      
      if (success) {
        setStatus('success');
        toast({
          title: "Voice enrollment successful",
          description: "Your voice has been successfully enrolled for authentication.",
          variant: "default"
        });
      } else {
        setStatus('error');
        setErrorMessage('Failed to enroll voice. Please try again.');
      }
    } catch (error) {
      console.error('Voice enrollment error:', error);
      setStatus('error');
      setErrorMessage('An error occurred during voice enrollment. Please try again.');
    }
  };
  
  // Reset the enrollment process
  const resetEnrollment = () => {
    setSamples([]);
    setCurrentSample(1);
    setStatus('idle');
    setTranscript('');
    setErrorMessage('');
  };
  
  // Handle skip
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };
  
  // If browser doesn't support speech recognition
  if (!browserSupportsSpeechRecognition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice Setup Not Available</CardTitle>
          <CardDescription>
            Your browser does not support voice recognition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Please use Chrome, Edge, or another modern browser to set up voice authentication.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSkip}
          >
            Continue Without Voice
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // If microphone access is denied
  if (isMicrophoneAvailable === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Microphone Access Denied</CardTitle>
          <CardDescription>
            Voice setup requires microphone access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Please enable microphone access in your browser settings and try again.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSkip}
          >
            Continue Without Voice
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Voice Authentication</CardTitle>
        <CardDescription>
          Enhance your account security with voice recognition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sample {samples.length} of {requiredSamples}</span>
              <span>{Math.round((samples.length / requiredSamples) * 100)}%</span>
            </div>
            <Progress value={(samples.length / requiredSamples) * 100} />
          </div>
          
          {/* Passphrase display */}
          <div className="bg-muted/50 p-4 rounded-md text-center">
            <p className="text-sm text-muted-foreground mb-2">Please say the passphrase:</p>
            <p className="text-lg font-medium text-primary">"{passphrase}"</p>
          </div>
          
          {/* Status-specific content */}
          {status === 'idle' && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Record sample {currentSample} of {requiredSamples}
              </p>
              <Button 
                variant="default" 
                className="w-full"
                onClick={startListening}
              >
                Start Recording
              </Button>
            </div>
          )}
          
          {status === 'listening' && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <MicrophoneIcon className="h-10 w-10 text-destructive animate-pulse" />
              </div>
              <p className="text-sm font-medium text-primary mb-4">
                Listening... Say "{passphrase}"
              </p>
              {transcript && (
                <div className="bg-muted p-3 rounded-md mb-4 text-left">
                  <p className="text-sm">Heard: {transcript}</p>
                </div>
              )}
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={stopListening}
              >
                Cancel
              </Button>
            </div>
          )}
          
          {status === 'processing' && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <SpinnerIcon className="h-8 w-8 animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">
                Processing...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-green-600 mb-2">
                Voice enrollment successful!
              </p>
              <p className="text-sm text-muted-foreground">
                You can now use your voice to authenticate.
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center py-4">
              <p className="text-sm font-medium text-destructive mb-4">
                {errorMessage}
              </p>
              <Button 
                variant="default" 
                className="w-full"
                onClick={resetEnrollment}
              >
                Try Again
              </Button>
            </div>
          )}
          
          {/* Collected samples */}
          {samples.length > 0 && status !== 'success' && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Recorded samples:</p>
              <div className="space-y-2">
                {samples.map((sample, index) => (
                  <div key={index} className="bg-muted/50 p-2 rounded text-sm text-muted-foreground">
                    <span className="font-medium">Sample {index + 1}:</span> {sample}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {status !== 'processing' && status !== 'success' && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSkip}
          >
            Skip Voice Setup
          </Button>
        )}
        
        {status === 'success' && (
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleSkip}
          >
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VoiceEnrollment;