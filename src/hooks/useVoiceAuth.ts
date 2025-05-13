// src/hooks/useVoiceAuth.ts - NEW FILE

import { useState, useCallback, useEffect } from 'react';
import voiceAuthService from '../services/voiceAuthService';

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
}

/**
 * Custom hook for handling voice authentication
 */
export const useVoiceAuth = (options?: UseVoiceAuthOptions) => {
  const {
    passphrase = 'scent of luxury',
    maxAttempts = 3,
    timeoutDuration = 5000,
    mockMode = true
  } = options || {};

  const [state, setState] = useState<VoiceAuthState>({
    status: 'idle',
    isListening: false,
    transcript: '',
    errorMessage: '',
    attempts: 0,
    attemptsRemaining: maxAttempts,
    isSupported: !!browserSupportsSpeechRecognition,
    isMicrophoneAvailable: null,
    isLocked: false
  });

  const recognitionRef = { current: null } as { current: any };

  // Initialize speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setState(prev => ({
        ...prev,
        isSupported: false,
        status: 'error',
        errorMessage: 'Your browser does not support voice recognition.'
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
          ? 'Microphone access denied. Please allow microphone access in your browser settings.'
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
          errorMessage: 'Microphone access denied. Please allow microphone access in your browser settings.'
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
    };
  }, []);

  // Process transcript for passphrase
  useEffect(() => {
    const checkForPassphrase = async () => {
      if (state.status === 'listening' && state.transcript) {
        // Check if the transcript contains the passphrase (case-insensitive)
        if (state.transcript.toLowerCase().includes(passphrase.toLowerCase())) {
          stopListening();
          await verifyVoice(state.transcript);
        }
      }
    };

    checkForPassphrase();
  }, [state.transcript, state.status]);

  // Start listening for voice input
  const startListening = useCallback(() => {
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
        errorMessage: 'Microphone access denied. Please allow microphone access.'
      }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      transcript: '',
      status: 'listening',
      errorMessage: '' 
    }));
    
    try {
      recognitionRef.current.start();
      
      // Set timeout to stop listening if no valid input is detected
      const timeoutId = setTimeout(() => {
        if (state.status === 'listening') {
          stopListening();
          handleFailedAttempt('No voice detected. Please try again.');
        }
      }, timeoutDuration);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Failed to start voice recognition. Please try again.'
      }));
    }
  }, [state.isSupported, state.isMicrophoneAvailable, state.status, timeoutDuration]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }

    setState(prev => ({ ...prev, isListening: false }));
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
          ? `Maximum attempts reached (${maxAttempts}). Please try again later.` 
          : message,
        attempts: newAttempts,
        attemptsRemaining,
        isLocked
      };
    });
  }, [maxAttempts]);

  // Verify voice against stored profile
  const verifyVoice = async (voiceInput: string) => {
    setState(prev => ({ ...prev, status: 'processing' }));
    
    try {
      const userId = localStorage.getItem('userId') || 'user123'; // Fallback for testing
      
      // Use mock or real API based on mockMode flag
      const response = mockMode 
        ? await voiceAuthService.mockVerifyVoice(voiceInput)
        : await voiceAuthService.verifyVoice(userId, voiceInput);
      
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          status: 'success',
          errorMessage: '' 
        }));
        
        localStorage.setItem('voiceAuthenticated', 'true');
        return true;
      } else {
        handleFailedAttempt(response.message || 'Voice authentication failed. Please try again.');
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
    setState({
      status: 'idle',
      isListening: false,
      transcript: '',
      errorMessage: '',
      attempts: 0,
      attemptsRemaining: maxAttempts,
      isSupported: !!browserSupportsSpeechRecognition,
      isMicrophoneAvailable: state.isMicrophoneAvailable,
      isLocked: false
    });
  }, [maxAttempts, state.isMicrophoneAvailable]);

  return {
    ...state,
    startListening,
    stopListening,
    reset,
    verifyVoice
  };
};

export default useVoiceAuth;