
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { processVoiceAuth } from '@/utils/voiceAuthApi';

const VoiceLoginComponent: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { login } = useAuth();
  const { toast } = useToast();
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      // Setup audio context and analyser for visualizations
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', processVoice);
      
      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      setSpeechText('Listening...');
      
      // Start audio level visualization
      visualizeAudio();
      
      // Auto-stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopListening();
        }
      }, 5000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Microphone Error',
        description: 'Could not access your microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setSpeechText('Processing voice...');
      setIsProcessing(true);
    }
    
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      analyserRef.current?.getByteFrequencyData(dataArray);
      
      // Calculate audio level (average of frequency data)
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const normalizedLevel = Math.min(100, Math.max(0, average * 1.5));
      
      setAudioLevel(normalizedLevel);
      
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };
  
  const processVoice = async () => {
    // Create audio blob from recorded chunks
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    try {
      // Call our voice auth API utility
      const authResponse = await processVoiceAuth(audioBlob);
      
      if (authResponse.success && authResponse.user) {
        setSpeechText(`Voice recognized: "${authResponse.user.role}"`);
        
        // Find the email for the recognized role
        const roles = [
          { email: 'ceo@minyork.com', role: 'CEO' },
          { email: 'cco@minyork.com', role: 'CCO' },
          { email: 'director@minyork.com', role: 'Commercial Director' },
          { email: 'regional@minyork.com', role: 'Regional Manager' },
          { email: 'marketing@minyork.com', role: 'Marketing Manager' }
        ];
        
        const matchedRole = roles.find(r => 
          r.role.toLowerCase() === authResponse.user?.role.toLowerCase()
        );
        
        if (matchedRole) {
          // Login with the recognized role credentials
          await login(matchedRole.email, 'password');
          
          toast({
            title: 'Voice Login Successful',
            description: `Welcome, ${authResponse.user.role}`,
          });
        } else {
          throw new Error(`Unrecognized role: ${authResponse.user.role}`);
        }
      } else {
        throw new Error(authResponse.error || 'Voice recognition failed');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: 'Voice Recognition Failed',
        description: 'Could not recognize your voice. Please try again or use password login.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 relative">
        {isListening ? (
          <div className="absolute inset-0 rounded-full animate-pulse bg-primary/20 flex items-center justify-center">
            <Mic size={36} className="text-primary animate-pulse" />
          </div>
        ) : (
          <Volume2 size={36} className="text-primary" />
        )}
      </div>
      
      {(isListening || isProcessing) && (
        <div className="w-full space-y-2">
          <Progress value={audioLevel} className="h-2" />
          <p className="text-center text-sm">{speechText}</p>
        </div>
      )}
      
      <div className="space-x-4">
        {!isListening && !isProcessing ? (
          <Button 
            onClick={startListening} 
            className="bg-primary hover:bg-primary/90"
            disabled={isProcessing}
          >
            <Mic className="mr-2 h-4 w-4" />
            Speak to Login
          </Button>
        ) : (
          <Button 
            onClick={stopListening} 
            variant="destructive"
            disabled={isProcessing}
          >
            <MicOff className="mr-2 h-4 w-4" />
            Stop Listening
          </Button>
        )}
      </div>
    </div>
  );
};

export default VoiceLoginComponent;
