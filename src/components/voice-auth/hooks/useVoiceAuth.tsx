
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import voiceAuthService from '@/services/voiceAuthService';

interface UseVoiceAuthProps {
  onAuthSuccess?: () => void;
  onAuthFailure?: () => void;
}

export const useVoiceAuth = ({ onAuthSuccess, onAuthFailure }: UseVoiceAuthProps = {}) => {
  const { currentUser, isVoiceEnrolled, authenticateWithVoice } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authAttempts, setAuthAttempts] = useState(0);
  const maxAttempts = 3;

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Start listening for voice input
  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      setErrorMessage("Your browser doesn't support voice recognition.");
      return;
    }

    if (!currentUser) {
      setErrorMessage("You need to be logged in to use voice authentication.");
      return;
    }

    if (!isVoiceEnrolled) {
      setErrorMessage("You need to enroll your voice before using voice authentication.");
      return;
    }

    setIsListening(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  }, [browserSupportsSpeechRecognition, currentUser, isVoiceEnrolled, resetTranscript]);

  // Stop listening and process voice input
  const stopListening = useCallback(async () => {
    if (!listening) return;

    SpeechRecognition.stopListening();
    setIsListening(false);
    setIsProcessing(true);

    try {
      if (transcript.trim()) {
        // Authenticate with the captured transcript
        const success = await authenticateWithVoice(transcript);
        
        if (success) {
          if (onAuthSuccess) onAuthSuccess();
        } else {
          setAuthAttempts(prev => prev + 1);
          setErrorMessage(`Authentication failed. ${maxAttempts - authAttempts - 1} attempts remaining.`);
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        setErrorMessage("No voice input detected. Please try again.");
        if (onAuthFailure) onAuthFailure();
      }
    } catch (error) {
      console.error("Voice auth error:", error);
      setErrorMessage("An error occurred during voice authentication.");
      if (onAuthFailure) onAuthFailure();
    } finally {
      setIsProcessing(false);
    }
  }, [listening, transcript, authenticateWithVoice, authAttempts, onAuthSuccess, onAuthFailure]);

  // Reset the state
  const resetAuth = useCallback(() => {
    resetTranscript();
    setErrorMessage('');
    setAuthAttempts(0);
    setIsProcessing(false);
    setIsListening(false);
  }, [resetTranscript]);

  // Effect to handle browser compatibility
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setErrorMessage("Your browser doesn't support voice recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  return {
    isListening,
    isProcessing,
    transcript,
    errorMessage,
    authAttempts,
    maxAttempts,
    startListening,
    stopListening,
    resetAuth,
    browserSupportsSpeechRecognition
  };
};

export default useVoiceAuth;
