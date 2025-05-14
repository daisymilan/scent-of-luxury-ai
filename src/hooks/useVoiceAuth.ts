// src/hooks/useVoiceAuth.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import { processVoiceAuth } from '../utils/voiceAuthApi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

// Check if browser supports the Web Speech API
const browserSupportsSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

// Create speech recognition instance
const SpeechRecognition = browserSupportsSpeechRecognition
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

interface UseVoiceAuthOptions {
  passphrase?: string;
  maxAttempts?: number;
  timeoutDuration?: number;
  mockMode?: boolean;
  webhookUrl?: string;
}

interface VoiceAuthState {
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  isListening: boolean;
  transcript: string;
  errorMessage: string;
  attempts: number;
  attemptsRemaining: number;
  isSupported: boolean;
  isMicrophoneAvailable: boolean | null;
  isLocked: boolean;
  audioBlob: Blob | null;
  recordingProgress: number; // 0-100
  audioLevel: number; // 0-100
}

/**
 * Custom hook for handling executive voice authentication
 * Integrated with AuthContext and Supabase
 */
const useVoiceAuth = (options?: UseVoiceAuthOptions) => {
  const {
    passphrase = 'scent of luxury',
    maxAttempts = 3,
    timeoutDuration = 5000,
    mockMode = import.meta.env.DEV, // Use development mode as default for mockMode
    webhookUrl
  } = options || {};

  // Get auth context
  const { 
    currentUser, 
    isVoiceEnrolled, 
    authenticateWithVoice: contextAuthenticateWithVoice,
    resetVoiceAuth
  } = useAuth();

  const [state, setState] = useState<VoiceAuthState>({
    status: 'idle',
    isListening: false,
    transcript: '',
    errorMessage: '',
    attempts: 0,
    attemptsRemaining: maxAttempts,
    isSupported: !!browserSupportsSpeechRecognition,
    isMicrophoneAvailable: null,
    isLocked: false,
    audioBlob: null,
    recordingProgress: 0,
    audioLevel: 0
  });

  // Refs
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setState(prev => ({
        ...prev,
        isSupported: false,
        status: 'error',
        errorMessage: 'Your browser does not support voice recognition. Please use a compatible browser for executive voice authentication.'
      }));
      return;
    }

    // Create a new recognition instance
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      setState(prev => ({
        ...prev,
        isListening: true,
        status: 'listening'
      }));
    };
    
    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      setState(prev => ({
        ...prev,
        transcript: currentTranscript
      }));
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      
      setState(prev => ({
        ...prev,
        isListening: false,
        status: 'error',
        errorMessage: event.error === 'not-allowed' 
          ? 'Microphone access denied. Please allow microphone access in your browser settings for executive authentication.'
          : `Error: ${event.error}`,
        isMicrophoneAvailable: event.error === 'not-allowed' ? false : prev.isMicrophoneAvailable
      }));
    };
    
    recognitionRef.current.onend = () => {
      setState(prev => {
        // If we were still in listening mode when onend fired, this was an unexpected stop
        if (prev.status === 'listening') {
          return {
            ...prev,
            isListening: false,
            status: 'error',
            errorMessage: 'Voice recognition stopped unexpectedly. Please try again.'
          };
        }
        return {
          ...prev,
          isListening: false
        };
      });
    };

    // Test for microphone availability
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setState(prev => ({ ...prev, isMicrophoneAvailable: true }));
      })
      .catch(() => {
        setState(prev => ({ 
          ...prev, 
          isMicrophoneAvailable: false,
          status: 'error',
          errorMessage: 'Microphone access denied. Please allow microphone access for secure executive authentication.'
        }));
      });

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  // Setup audio visualization
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
        if (!analyserRef.current || !dataArrayRef.current || !state.isListening) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate average volume level
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / dataArrayRef.current.length;
        
        // Update state with normalized audio level (0-100)
        const normalizedLevel = Math.min(Math.round((average / 255) * 100), 100);
        if (state.status === 'listening') {
          setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
        }
        
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
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
  };

  // Process transcript for passphrase
  useEffect(() => {
    const checkForPassphrase = async () => {
      if (state.status === 'listening' && state.transcript && state.audioBlob) {
        // Check if the transcript contains the passphrase (case-insensitive)
        if (state.transcript.toLowerCase().includes(passphrase.toLowerCase())) {
          stopListening();
          // First try context's authenticateWithVoice (which uses voiceAuthService)
          if (contextAuthenticateWithVoice) {
            setState(prev => ({ ...prev, status: 'processing' }));
            const success = await contextAuthenticateWithVoice(state.transcript);
            if (success) {
              setState(prev => ({ 
                ...prev, 
                status: 'success',
                errorMessage: '' 
              }));
            } else {
              // Fall back to our verifyVoice implementation
              await verifyVoice(state.audioBlob);
            }
          } else {
            // If context method is not available, use our implementation
            await verifyVoice(state.audioBlob);
          }
        }
      }
    };

    checkForPassphrase();
  }, [state.transcript, state.status, state.audioBlob, contextAuthenticateWithVoice, passphrase]);

  // Start listening for voice input
  const startListening = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Your browser does not support voice recognition.'
      }));
      return;
    }

    if (state.isMicrophoneAvailable === false) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Microphone access denied. Please enable microphone access for executive authentication.'
      }));
      return;
    }

    if (state.isLocked) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: `Maximum authentication attempts reached (${maxAttempts}). Please contact system administrator.`
      }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      transcript: '',
      status: 'listening',
      errorMessage: '',
      recordingProgress: 0,
      audioBlob: null
    }));
    
    try {
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualization
      setupAudioVisualization(stream);
      
      // Set up media recorder
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        // Stop visualization
        stopAudioVisualization();
        
        // Create audio blob
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setState(prev => ({ ...prev, audioBlob: blob }));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      
      // Start speech recognition
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
      
      // Set up progress timer
      const updateInterval = 100; // 100ms
      let elapsed = 0;
      
      timerRef.current = setInterval(() => {
        elapsed += updateInterval;
        
        setState(prev => ({
          ...prev,
          recordingProgress: Math.min((elapsed / timeoutDuration) * 100, 100)
        }));
        
        // Auto-stop at the end of timeout
        if (elapsed >= timeoutDuration) {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (e) {
              // Ignore errors when stopping
            }
          }
          
          clearInterval(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
        }
      }, updateInterval);
      
    } catch (error) {
      console.error('Failed to start voice auth:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Failed to start voice recording. Please try again.'
      }));
    }
  }, [state.isSupported, state.isMicrophoneAvailable, state.isLocked, maxAttempts, timeoutDuration]);

  // Stop listening
  const stopListening = useCallback(() => {
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop audio visualization
    stopAudioVisualization();
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setState(prev => ({ 
      ...prev, 
      isListening: false,
      recordingProgress: 100
    }));
  }, []);

  // Handle failed authentication attempt
  const handleFailedAttempt = useCallback((message: string) => {
    setState(prev => {
      const newAttempts = prev.attempts + 1;
      const attemptsRemaining = maxAttempts - newAttempts;
      const isLocked = newAttempts >= maxAttempts;

      return {
        ...prev,
        status: 'error',
        errorMessage: isLocked 
          ? `Maximum authentication attempts reached (${maxAttempts}). Please contact your system administrator.` 
          : message,
        attempts: newAttempts,
        attemptsRemaining,
        isLocked
      };
    });
    
    // Reset voice auth in context if available
    if (resetVoiceAuth) {
      resetVoiceAuth();
    }
  }, [maxAttempts, resetVoiceAuth]);

  // Play recorded audio
  const playRecording = useCallback(() => {
    if (state.audioBlob) {
      const url = URL.createObjectURL(state.audioBlob);
      const audio = new Audio(url);
      audio.play();
    }
  }, [state.audioBlob]);

  // Verify voice using audio blob and API
  const verifyVoice = async (audioBlob: Blob) => {
    setState(prev => ({ ...prev, status: 'processing' }));
    
    try {
      // Try to use context authenticateWithVoice first
      if (contextAuthenticateWithVoice && state.transcript) {
        const success = await contextAuthenticateWithVoice(state.transcript);
        if (success) {
          setState(prev => ({ 
            ...prev, 
            status: 'success',
            errorMessage: '' 
          }));
          return true;
        }
      }
      
      // Fall back to our API utility
      const response = await processVoiceAuth(audioBlob, undefined, webhookUrl);
      
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          status: 'success',
          errorMessage: '' 
        }));
        
        // Store authentication in localStorage
        localStorage.setItem('voiceAuthenticated', 'true');
        
        // If we have user details, store them too
        if (response.user) {
          localStorage.setItem('voiceAuthUser', JSON.stringify(response.user));
          
          // Update Supabase user metadata if we have a session
          try {
            const { error } = await supabase.auth.updateUser({
              data: { 
                voice_authenticated: true,
                last_voice_auth: new Date().toISOString()
              }
            });
            
            if (error) {
              console.error('Error updating user metadata:', error);
            }
          } catch (e) {
            console.error('Error updating Supabase user:', e);
          }
        }
        
        return true;
      } else {
        handleFailedAttempt(response.message || 'Executive voice authentication failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Voice verification error:', error);
      handleFailedAttempt('Error processing voice authentication. Please try again.');
      return false;
    }
  };

  // Reset state to initial
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'idle',
      isListening: false,
      transcript: '',
      errorMessage: '',
      audioBlob: null,
      recordingProgress: 0,
      audioLevel: 0
      // Note: we don't reset attempts here to maintain lock state
    }));
  }, []);

  // Return state and methods
  return {
    ...state,
    startListening,
    stopListening,
    reset,
    verifyVoice,
    playRecording,
    isVoiceEnrolled // From auth context
  };
};

export default useVoiceAuth;
