
// src/hooks/useVoiceAuth.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { processVoiceAuth } from '../utils/voiceAuthApi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client"; 

// Define interface for hook options
interface VoiceAuthOptions {
  onStart?: () => void;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onAuthSuccess?: (result: any) => void;
  onAuthFailed?: (error: string) => void;
  passphrase?: string;
  maxAttempts?: number;
  mockMode?: boolean;
  webhookUrl?: string;
}

// Check if browser supports the Web Speech API
const browserSupportsSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

// Create speech recognition instance
const SpeechRecognition = browserSupportsSpeechRecognition ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/**
 * Custom hook for handling executive voice authentication
 * Integrated with AuthContext and Supabase
 */
const useVoiceAuth = (options: VoiceAuthOptions = {}) => {
  const { 
    onStart, 
    onResult, 
    onEnd, 
    onError, 
    onAuthSuccess, 
    onAuthFailed, 
    passphrase = 'scent of luxury', 
    maxAttempts = 3,
    mockMode = false,
    webhookUrl
  } = options;

  // State variables
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcription, setTranscription] = useState(''); // For backwards compatibility
  const [authResult, setAuthResult] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // For backwards compatibility
  const [attempts, setAttempts] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(maxAttempts);
  const [isLocked, setIsLocked] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, listening, processing, success, error
  
  const { login } = useAuth();
  const recognitionRef = useRef(null);

  // Check for microphone availability
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(null);
  
  useEffect(() => {
    // Check for microphone
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setIsMicrophoneAvailable(true))
        .catch(() => setIsMicrophoneAvailable(false));
    }
    
    if (!browserSupportsSpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.');
      setError('Web Speech API is not supported in this browser.');
      setErrorMessage('Web Speech API is not supported in this browser.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setStatus('listening');
      if (onStart) onStart();
    };

    recognitionRef.current.onresult = (event) => {
      const newTranscript = event.results[0][0].transcript;
      setTranscript(newTranscript);
      setTranscription(newTranscript); // For backwards compatibility
      if (onResult) onResult(newTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setStatus('idle');
      if (onEnd) onEnd();
    };

    recognitionRef.current.onerror = (event) => {
      setError(event.error);
      setErrorMessage(event.error); // For backwards compatibility
      setStatus('error');
      setIsListening(false);
      if (onError) onError(event.error);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, [onStart, onResult, onEnd, onError]);

  // Track attempts and lock status
  useEffect(() => {
    setAttemptsRemaining(maxAttempts - attempts);
    if (attempts >= maxAttempts) {
      setIsLocked(true);
    }
  }, [attempts, maxAttempts]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript('');
      setTranscription('');
      setError(null);
      setErrorMessage('');
      setStatus('listening');
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setError("Failed to start voice recognition. Please try again.");
        setErrorMessage("Failed to start voice recognition. Please try again.");
        setStatus('error');
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus('processing');

      try {
        // Mock successful authentication in dev mode
        if (mockMode) {
          setTimeout(() => {
            setAuthResult({ success: true, user: { role: 'CEO' } });
            setStatus('success');
            if (onAuthSuccess) onAuthSuccess({ success: true, user: { role: 'CEO' } });
          }, 1000);
          return;
        }

        // Here we would normally process the authentication
        // If not mock mode, continue with normal flow
        processVoiceAuth(new Blob())
          .then(result => {
            if (result.success) {
              setAuthResult(result);
              setStatus('success');
              if (onAuthSuccess) onAuthSuccess(result);
            } else {
              setError(result.error || 'Authentication failed');
              setErrorMessage(result.error || 'Authentication failed');
              setStatus('error');
              setAttempts(prev => prev + 1);
              if (onAuthFailed) onAuthFailed(result.error || 'Authentication failed');
            }
          })
          .catch(error => {
            console.error("Voice authentication error:", error);
            setError('Failed to process voice authentication');
            setErrorMessage('Failed to process voice authentication');
            setStatus('error');
            setAttempts(prev => prev + 1);
            if (onAuthFailed) onAuthFailed('Failed to process voice authentication');
          });
      } catch (error) {
        console.error("Voice authentication error:", error);
        setError('Failed to process voice authentication');
        setErrorMessage('Failed to process voice authentication');
        setStatus('error');
        setAttempts(prev => prev + 1);
        if (onAuthFailed) onAuthFailed('Failed to process voice authentication');
      }
    }
  }, [onAuthSuccess, onAuthFailed, mockMode]);

  const resetAuthResult = useCallback(() => {
    setAuthResult(null);
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTranscript('');
    setTranscription('');
    setError(null);
    setErrorMessage('');
    setAuthResult(null);
  }, []);
  
  return {
    isListening,
    transcript,
    transcription, // For backwards compatibility
    authResult,
    error,
    errorMessage, // For backwards compatibility
    startListening,
    stopListening,
    resetAuthResult,
    isSupported: !!SpeechRecognition,
    // Additional properties for compatibility
    status,
    attempts,
    attemptsRemaining,
    isLocked,
    isMicrophoneAvailable,
    reset
  };
};

export default useVoiceAuth;
