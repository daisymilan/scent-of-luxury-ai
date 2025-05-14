// src/components/voice-login/VoiceRecording.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import '../../styles/VoiceAuth.css';

interface VoiceRecordingProps {
  onProcessVoice: (audioBlob: Blob) => Promise<void>;
  isProcessing: boolean;
  maxDuration?: number; // in seconds
  className?: string;
  messageText?: string;
  buttonText?: string;
}

/**
 * A reusable component for recording voice audio
 */
const VoiceRecording: React.FC<VoiceRecordingProps> = ({ 
  onProcessVoice, 
  isProcessing,
  maxDuration = 5,
  className = '',
  messageText = 'Speak clearly for voice authentication',
  buttonText = 'Start Recording'
}) => {
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0); // 0-100 for visualization
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
  // Audio level visualization
  const setupAudioVisualization = (stream: MediaStream) => {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyser node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Connect source to analyser
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceNodeRef.current.connect(analyserRef.current);
      
      // Create data array for frequency data
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Start visualization loop
      const updateVisualization = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate audio level - average of frequency data
        const sum = dataArrayRef.current.reduce((acc, val) => acc + val, 0);
        const avg = sum / dataArrayRef.current.length;
        
        // Scale to 0-100
        setAudioLevel(Math.min(Math.round((avg / 255) * 100), 100));
        
        // Continue loop if recording
        if (isRecording) {
          animationFrameRef.current = requestAnimationFrame(updateVisualization);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    } catch (error) {
      console.error('Error setting up audio visualization:', error);
    }
  };
  
  // Stop audio visualization
  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    setAudioLevel(0);
  };
  
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      setRecordingTime(0);
      setRecordingAvailable(false);
      setAudioLevel(0);
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio visualization
      setupAudioVisualization(stream);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Set up data handling
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      // Set up stop handler
      mediaRecorderRef.current.onstop = () => {
        // Stop visualization
        stopAudioVisualization();
        
        // Create blob from collected chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setRecordingAvailable(true);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer for recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          
          // Auto stop recording after maxDuration seconds
          if (newTime >= maxDuration && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            stopRecording();
            return maxDuration;
          }
          
          return newTime;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorMessage('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };
  
  const processVoice = async () => {
    if (audioBlob) {
      await onProcessVoice(audioBlob);
    }
  };
  
  return (
    <div className={`flex flex-col items-center space-y-4 w-full ${className}`}>
      {/* Recording status indicator with animated visualization */}
      <div className="relative">
        <div 
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-100 shadow-md' 
              : isProcessing
                ? 'bg-blue-100 shadow-md'
                : 'bg-gray-100'
          }`}
        >
          {isRecording ? (
            <Mic className="h-12 w-12 text-red-500 animate-pulse" />
          ) : isProcessing ? (
            <RefreshCw className="h-12 w-12 text-blue-500 animate-spin" />
          ) : (
            <Mic className="h-12 w-12 text-gray-400" />
          )}
        </div>
        
        {/* Audio level visualization rings */}
        {isRecording && (
          <>
            <div 
              className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-red-300 animate-ping"
              style={{ 
                opacity: audioLevel > 30 ? 0.3 : 0,
                animationDuration: '1.5s'
              }}
            />
            <div 
              className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-red-400 animate-ping"
              style={{ 
                opacity: audioLevel > 60 ? 0.4 : 0,
                animationDuration: '1.2s',
                animationDelay: '0.1s'
              }}
            />
          </>
        )}
      </div>
      
      {/* Status text */}
      <p className="text-sm font-medium">
        {isRecording 
          ? 'Recording your voice...' 
          : isProcessing
            ? 'Processing voice authentication...'
            : recordingAvailable
              ? 'Recording complete'
              : messageText
        }
      </p>
      
      {/* Error message */}
      {errorMessage && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {/* Progress bar during recording */}
      {isRecording && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Recording</span>
            <span>{recordingTime}/{maxDuration}s</span>
          </div>
          <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-col gap-2 w-full">
        {/* Start recording button */}
        {!isRecording && !recordingAvailable && !isProcessing && (
          <Button 
            onClick={startRecording}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Mic className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
        
        {/* Stop recording button */}
        {isRecording && (
          <Button 
            onClick={stopRecording}
            variant="destructive"
          >
            <MicOff className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}
        
        {/* Recording available buttons */}
        {recordingAvailable && !isProcessing && (
          <div className="flex gap-2">
            <Button 
              onClick={playRecording}
              variant="outline"
              className="flex-1"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Play
            </Button>
            
            <Button 
              onClick={processVoice}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Authenticate
            </Button>
          </div>
        )}
        
        {/* Retry button */}
        {recordingAvailable && !isProcessing && (
          <Button 
            onClick={startRecording}
            variant="ghost"
            className="text-gray-500"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Record Again
          </Button>
        )}
      </div>
      
      {/* Hint text */}
      {!isRecording && !recordingAvailable && !isProcessing && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Speak clearly and naturally for authentication.
          Please ensure you're in a quiet environment.
        </p>
      )}
    </div>
  );
};

export default VoiceRecording;