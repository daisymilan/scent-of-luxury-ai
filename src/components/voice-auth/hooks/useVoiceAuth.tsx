// src/hooks/useVoiceAuth.ts

import { useState, useCallback, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import voiceAuthService from '../services/voiceAuthService';

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
  isSupported: boolean;
  isMicrophoneAvailable: boolean;
}

/**
 * Custom hook for handling voice authentication
 */
export const useVoiceAuth = (options?: UseVoiceAuthOptions) => {
  const {
    passphrase = 'scent of luxury',
    maxAttempts = 3,
    timeoutDuration = 5000,
    mockMode = false
  } = options || {};

  const [state, setState] = useState<VoiceAuthState>({
    status: 'idle',
    isListening: false,
    transcript: '',
    errorMessage: '',
    attempts: 0,
    isSupported: true,
    isMicrophoneAvailable: true
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Update state based on speech recognition status
  useEffect(() => {
    setState(prev => ({
      ...prev,
      transcript,
      isListening: listening,
      isSupported: !!browserSupportsSpeechRecognition,
      isMicrophoneAvailable: isMicrophoneAvailable !== false
    }));
  }, [transcript, listening, browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Process transcript when it changes
  useEffect(() => {
    const handleTranscriptChange = async () => {
      if (state.status === 'listening' && transcript) {
        const transcriptLower = transcript.toLowerCase().trim();
        
        // Check if the transcript contains the passphrase
        if (transcriptLower.includes(passphrase.toLowerCase())) {
          await verifyVoice(transcript);
        } else if (transcriptLower.length > passphrase.length * 2) {
          // If transcript is much longer than passphrase and still no match
          handleFailedAttempt("Voice passphrase not recognized. Please try again.");
        }
      }
    };

    handleTranscriptChange();
  }, [transcript, state.status]);

  // Start listening for voice input
  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Your browser does not support voice recognition.'
      }));
      return;
    }

    if (isMicrophoneAvailable === false) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Microphone permission denied. Please allow microphone access.'
      }));
      return;
    }

    resetTranscript();
    setState(prev => ({ ...prev, status: 'listening', errorMessage: '' }));
    
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US'
    });

    // Set timeout to stop listening if no valid input is detected
    const timeoutId = setTimeout(() => {
      if (listening) {
        stopListening();
        handleFailedAttempt('No voice detected. Please try again.');
      }
    }, timeoutDuration);

    return () => clearTimeout(timeoutId);
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable, resetTranscript, listening]);

  // Stop listening
  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  // Handle failed authentication attempt
  const handleFailedAttempt = useCallback((message: string) => {
    stopListening();
    setState(prev => ({
      ...prev,
      status: 'error',
      errorMessage: message,
      attempts: prev.attempts + 1
    }));
  }, [stopListening]);

  // Verify voice against stored profile
  const verifyVoice = async (voiceInput: string) => {
    stopListening();
    setState(prev => ({ ...prev, status: 'processing' }));
    
    try {
      // Use mock service if in mock mode, otherwise use real API
      const response = mockMode 
        ? await voiceAuthService.mockVerifyVoice(voiceInput)
        : await voiceAuthService.verifyVoice(
            localStorage.getItem('userId') || '', 
            voiceInput
          );
      
      if (response.success) {
        setState(prev => ({ ...prev, status: 'success', errorMessage: '' }));
        localStorage.setItem('voiceAuthenticated', 'true');
        return true;
      } else {
        handleFailedAttempt(response.message || 'Voice authentication failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Voice authentication error:', error);
      handleFailedAttempt('Error processing voice authentication. Please try again.');
      return false;
    }
  };

  // Reset state to initial
  const reset = useCallback(() => {
    resetTranscript();
    setState({
      status: 'idle',
      isListening: false,
      transcript: '',
      errorMessage: '',
      attempts: 0,
      isSupported: !!browserSupportsSpeechRecognition,
      isMicrophoneAvailable: isMicrophoneAvailable !== false
    });
  }, [resetTranscript, browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Check if max attempts reached
  const isLocked = state.attempts >= maxAttempts;

  return {
    // State
    status: state.status,
    isListening: state.isListening,
    transcript: state.transcript,
    errorMessage: state.errorMessage,
    attempts: state.attempts,
    isSupported: state.isSupported,
    isMicrophoneAvailable: state.isMicrophoneAvailable,
    attemptsRemaining: maxAttempts - state.attempts,
    isLocked,
    
    // Actions
    startListening,
    stopListening,
    reset,
    verifyVoice
  };
};

export default useVoiceAuth;