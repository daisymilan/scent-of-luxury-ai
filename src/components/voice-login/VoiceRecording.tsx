
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { createSpeechRecognition, checkSpeechRecognitionSupport } from '@/components/ai-assistant/SpeechRecognition';

interface VoiceRecordingProps {
  onProcessVoice: (audioBlob: Blob) => Promise<void>;
  isProcessing: boolean;
}

const VoiceRecording: React.FC<VoiceRecordingProps> = ({ onProcessVoice, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<any>(null);

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
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    const supportResult = checkSpeechRecognitionSupport();
    if (!supportResult.isSupported) {
      toast({
        title: "Speech Recognition Not Available",
        description: supportResult.errorMessage || "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
    }
    
    speechRecognitionRef.current = createSpeechRecognition({
      onResult: (transcript) => {
        console.log('Speech recognition result:', transcript);
        setSpeechText(transcript);
        
        // If the transcript contains "login as" and a role, start processing automatically
        if (transcript.toLowerCase().includes('login as')) {
          console.log('Login command detected in:', transcript);
          stopListening();
        }
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        toast({
          title: "Voice Recognition Error",
          description: error.message || `Recognition error: ${error.error}`,
          variant: "destructive"
        });
        stopListening();
      },
      onEnd: () => {
        // Only process audio if we have a valid transcript and audio data
        if (audioChunksRef.current.length > 0) {
          processAudio();
        }
        setIsListening(false);
      }
    });
  }, [toast]);

  const startListening = async () => {
    try {
      // Reset state
      setAudioLevel(0);
      setSpeechText('');
      audioChunksRef.current = [];
      
      // Request microphone access
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      micStreamRef.current = stream;
      
      // Setup audio context and analyser for visualizations
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      // Start recording and visualization
      mediaRecorder.start();
      setIsListening(true);
      setSpeechText('Listening... say "Login as CEO"');
      visualizeAudio();
      
      // Start speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start();
      } else {
        toast({
          title: "Speech Recognition Not Available",
          description: "Could not initialize speech recognition",
          variant: "destructive"
        });
      }
      
      // Auto-stop recording after 8 seconds
      setTimeout(() => {
        if (isListening && mediaRecorderRef.current?.state === 'recording') {
          stopListening();
        }
      }, 8000);
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
    // Stop media recorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      console.log('Media recorder stopped');
    }
    
    // Stop speech recognition if active
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      console.log('Speech recognition stopped');
    }
    
    // Stop microphone stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      console.log('Microphone stream stopped');
    }
    
    // Cancel visualization animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsListening(false);
    setSpeechText(prev => prev || 'Processing voice...');
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
      
      // Log audio activity for debugging
      if (average > 20) {
        console.log('Audio activity detected:', average.toFixed(1));
      }
      
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };
  
  const processAudio = () => {
    // Only process if we have audio data
    if (audioChunksRef.current.length === 0) {
      console.warn('No audio data to process');
      return;
    }
    
    // Create audio blob from recorded chunks
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    console.log('Processing audio blob:', audioBlob.size, 'bytes');
    
    // Extract role from speech text if possible
    let detectedRole = null;
    if (speechText) {
      const lowerText = speechText.toLowerCase();
      if (lowerText.includes('login as ceo')) {
        detectedRole = 'CEO';
      } else if (lowerText.includes('login as cco')) {
        detectedRole = 'CCO';
      } else if (lowerText.includes('login as director')) {
        detectedRole = 'Commercial Director';
      } else if (lowerText.includes('login as regional')) {
        detectedRole = 'Regional Manager';
      } else if (lowerText.includes('login as marketing')) {
        detectedRole = 'Marketing Manager';
      }
      
      if (detectedRole) {
        console.log('Detected role from speech:', detectedRole);
        setSpeechText(`Recognized: "${detectedRole}"`);
      }
    }
    
    // Process the audio with voice recognition
    onProcessVoice(audioBlob);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 relative">
        {isListening ? (
          <div className="absolute inset-0 rounded-full animate-pulse bg-gray-200 flex items-center justify-center">
            <Mic size={36} className="text-black animate-pulse" />
          </div>
        ) : (
          <Mic size={36} className="text-black" />
        )}
      </div>
      
      {(isListening || isProcessing) && (
        <div className="w-full space-y-2">
          <Progress value={audioLevel} className="h-2" />
          <p className="text-center text-sm">{speechText || 'Listening...'}</p>
        </div>
      )}
      
      <div className="space-x-4">
        {!isListening && !isProcessing ? (
          <Button 
            onClick={startListening} 
            className="bg-black hover:bg-gray-800 text-white font-light rounded-none"
            disabled={isProcessing}
          >
            <Mic className="mr-2 h-4 w-4" />
            Speak to Login
          </Button>
        ) : (
          <Button 
            onClick={stopListening} 
            variant="destructive"
            className="rounded-none"
            disabled={isProcessing}
          >
            <MicOff className="mr-2 h-4 w-4" />
            Stop Listening
          </Button>
        )}
      </div>
      
      {!isListening && !isProcessing && (
        <div className="text-sm text-center text-muted-foreground">
          <p>Say <strong>"Login as CEO"</strong> to authenticate with your voice</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecording;
