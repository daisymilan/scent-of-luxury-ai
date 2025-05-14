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
const useVoiceAuth = (options) => {
  const { onStart, onResult, onEnd, onError, onAuthSuccess, onAuthFailed } = options || {};
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [authResult, setAuthResult] = useState(null);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const recognitionRef = useRef(null);

  useEffect(() => {
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
      onStart?.();
    };

    recognitionRef.current.onresult = (event) => {
      const newTranscription = event.results[0][0].transcript;
      setTranscription(newTranscription);
      onResult?.(newTranscription);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognitionRef.current.onerror = (event) => {
      setError(event.error);
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

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscription('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setError("Failed to start voice recognition. Please try again.");
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(async (userId?: string, webhookUrl?: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);

      try {
        const result = await processVoiceAuth(new Blob(), userId, webhookUrl);

        if (result.success) {
          setAuthResult(result);
          onAuthSuccess?.(result);
        } else {
          setError(result.error || 'Authentication failed');
          onAuthFailed?.(result.error || 'Authentication failed');
        }
      } catch (error) {
        console.error("Voice authentication error:", error);
        setError('Failed to process voice authentication');
        onAuthFailed?.('Failed to process voice authentication');
      }
    }
  }, [onAuthSuccess, onAuthFailed]);

  const resetAuthResult = useCallback(() => {
    setAuthResult(null);
  }, []);

  return {
    isListening,
    transcription,
    authResult,
    error,
    startListening,
    stopListening,
    resetAuthResult,
    isSupported: !!SpeechRecognition,
  };
};

export default useVoiceAuth;
