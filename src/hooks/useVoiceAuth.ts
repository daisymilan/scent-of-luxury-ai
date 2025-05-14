
// src/hooks/useVoiceAuth.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { processVoiceAuth } from '../utils/voiceAuthApi';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client"; // Fixed import path

// Check if browser supports the Web Speech API
const browserSupportsSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

// Create speech recognition instance
const SpeechRecognition = browserSupportsSpeechRecognition ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/**
 * Custom hook for handling executive voice authentication
 * Integrated with AuthContext and Supabase
 */
const useVoiceAuth = (options = {}) => {
  const { onStart, onResult, onEnd, onError, onAuthSuccess, onAuthFailed, passphrase = 'scent of luxury', maxAttempts = 3 } = options;

  // State variables
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [authResult, setAuthResult] = useState(null);
  const [error, setError] = useState(null);
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
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setStatus('listening');
      onStart?.();
    };

    recognitionRef.current.onresult = (event) => {
      const newTranscription = event.results[0][0].transcript;
      setTranscription(newTranscription);
      onResult?.(newTranscription);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setStatus('idle');
      onEnd?.();
    };

    recognitionRef.current.onerror = (event) => {
      setError(event.error);
      setStatus('error');
      setIsListening(false);
      onError?.(event.error);
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
      setTranscription('');
      setError(null);
      setStatus('listening');
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setError("Failed to start voice recognition. Please try again.");
        setStatus('error');
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(async (userId?: string, webhookUrl?: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus('processing');

      try {
        const result = await processVoiceAuth(new Blob(), userId, webhookUrl);

        if (result.success) {
          setAuthResult(result);
          setStatus('success');
          onAuthSuccess?.(result);
        } else {
          setError(result.error || 'Authentication failed');
          setStatus('error');
          setAttempts(prev => prev + 1);
          onAuthFailed?.(result.error || 'Authentication failed');
        }
      } catch (error) {
        console.error("Voice authentication error:", error);
        setError('Failed to process voice authentication');
        setStatus('error');
        setAttempts(prev => prev + 1);
        onAuthFailed?.('Failed to process voice authentication');
      }
    }
  }, [onAuthSuccess, onAuthFailed]);

  const resetAuthResult = useCallback(() => {
    setAuthResult(null);
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTranscription('');
    setError(null);
    setAuthResult(null);
  }, []);

  // For compatibility with components using different property names
  const transcript = transcription;
  const errorMessage = error;
  
  return {
    isListening,
    transcription,
    authResult,
    error,
    startListening,
    stopListening,
    resetAuthResult,
    isSupported: !!SpeechRecognition,
    // Additional properties for compatibility with existing components
    status,
    transcript,
    errorMessage,
    attempts,
    attemptsRemaining,
    isLocked,
    isMicrophoneAvailable,
    reset
  };
};

export default useVoiceAuth;
