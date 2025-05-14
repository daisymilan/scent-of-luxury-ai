// src/components/voice-auth/hooks/useVoiceAuth.tsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseVoiceAuthOptions {
  passphrase: string;
  maxAttempts?: number;
  onAuthSuccess?: () => void;
  onAuthFailed?: (error: string) => void;
  mockMode?: boolean;
}

export function useVoiceAuth(options = {}) {
  const { currentUser, isVoiceEnrolled, authenticateWithVoice } = useAuth();
  const { passphrase, maxAttempts = 3, onAuthSuccess, onAuthFailed, mockMode = false } = options;

  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState<boolean | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const attemptsRemaining = maxAttempts - attempts;

  // Check browser support and microphone access on mount
  useEffect(() => {
    // Check if SpeechRecognition is supported
    const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setIsSupported(isSpeechRecognitionSupported);

    if (isSpeechRecognitionSupported) {
      // Get microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setIsMicrophoneAvailable(true))
        .catch(() => setIsMicrophoneAvailable(false));
    } else {
      setIsMicrophoneAvailable(false);
    }
  }, []);

  // Function to start listening
  const startListening = useCallback(() => {
    if (isLocked || !isSupported || isMicrophoneAvailable === false) return;

    setStatus('listening');
    setTranscript('');
    setErrorMessage('');

    if (mockMode) {
      // Simulate listening and processing in mock mode
      setTimeout(() => {
        setTranscript(passphrase);
        setStatus('processing');
        setTimeout(() => {
          // Simulate success or failure
          if (Math.random() > 0.2) {
            setStatus('success');
            onAuthSuccess?.();
          } else {
            setStatus('error');
            setErrorMessage('Voice authentication failed in mock mode.');
            onAuthFailed?.('Voice authentication failed in mock mode.');
            setAttempts(prevAttempts => prevAttempts + 1);
          }
        }, 1500);
      }, 500);
    } else {
      // Implement real speech recognition here
      console.warn('Real speech recognition not implemented yet.');
      setStatus('error');
      setErrorMessage('Real speech recognition not implemented yet.');
    }
  }, [isLocked, isSupported, isMicrophoneAvailable, passphrase, mockMode, onAuthSuccess, onAuthFailed]);

  // Function to stop listening
  const stopListening = () => {
    if (status === 'listening') {
      setStatus('idle');
    }
  };

  // Function to reset state for a new attempt
  const reset = () => {
    setStatus('idle');
    setTranscript('');
    setErrorMessage('');
  };

  // Effect to handle authentication attempts and locking
  useEffect(() => {
    if (attempts >= maxAttempts) {
      setIsLocked(true);
      setErrorMessage('Too many incorrect attempts. Voice authentication locked.');
      onAuthFailed?.('Too many incorrect attempts.');
    }
  }, [attempts, maxAttempts, onAuthFailed]);

  return {
    status,
    transcript,
    errorMessage,
    attempts,
    attemptsRemaining,
    isSupported,
    isMicrophoneAvailable,
    isLocked,
    startListening,
    stopListening,
    reset,
  };
}
