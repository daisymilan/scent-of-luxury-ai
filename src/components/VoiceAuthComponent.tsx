// src/components/VoiceAuth.tsx - MODIFY EXISTING FILE

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Check if browser supports the Web Speech API
const browserSupportsSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

// Create speech recognition instance
const SpeechRecognition = browserSupportsSpeechRecognition
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

interface VoiceAuthProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  passphrase?: string;
}

const VoiceAuth: React.FC<VoiceAuthProps> = ({ 
  onSuccess, 
  onError, 
  passphrase = 'scent of luxury' 
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setStatus('error');
      setErrorMessage('Your browser does not support voice recognition.');
      onError('Browser compatibility issue');
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
      setIsListening(true);
      setStatus('listening');
    };
    
    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      setTranscript(currentTranscript);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
      setStatus('error');
      
      if (event.error === 'not-allowed') {
        setErrorMessage('Microphone access denied. Please allow microphone access in your browser settings.');
        onError('Microphone permission denied');
      } else {
        setErrorMessage(`Error: ${event.error}`);
        onError(`Speech recognition error: ${event.error}`);
      }
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
      
      // If we were still in listening mode when onend fired, this was an unexpected stop
      if (status === 'listening') {
        setStatus('error');
        setErrorMessage('Voice recognition stopped unexpectedly. Please try again.');
        onError('Voice recognition stopped unexpectedly');
      }
    };
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onError, status]);
  
  // Process transcript changes
  useEffect(() => {
    if (status === 'listening' && transcript) {
      // Check if the user said the passphrase (case-insensitive)
      if (transcript.toLowerCase().includes(passphrase.toLowerCase())) {
        stopListening();
        verifyVoice(transcript);
      }
    }
  }, [transcript, passphrase, status]);
  
  // Start listening for voice input
  const startListening = () => {
    setTranscript('');
    setStatus('listening');
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setStatus('error');
      setErrorMessage('Failed to start voice recognition. Please try again.');
      onError('Failed to start voice recognition');
    }
  };
  
  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };
  
  // Verify voice against stored profile
  const verifyVoice = async (voiceInput: string) => {
    setStatus('processing');
    
    try {
      // Get user ID from local storage or context
      const userId = localStorage.getItem('userId') || '';
      
      // Make API call to verify voice
      const response = await axios.post('/api/auth/voice-verify', {
        userId,
        voiceInput
      });
      
      if (response.data.success) {
        setStatus('success');
        localStorage.setItem('voiceAuthenticated', 'true');
        onSuccess();
      } else {
        setStatus('error');
        setErrorMessage(response.data.message || 'Voice authentication failed. Please try again.');
        onError(response.data.message || 'Voice authentication failed');
      }
    } catch (error) {
      console.error('Voice verification error:', error);
      setStatus('error');
      setErrorMessage('Error processing voice authentication. Please try again.');
      onError('Error processing voice authentication');
    }
  };
  
  // If browser doesn't support speech recognition, show error
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-auth-container">
        <h2>Voice Authentication Not Available</h2>
        <p>Your browser does not support voice recognition.</p>
        <p>Please use a different browser like Chrome or use password authentication instead.</p>
      </div>
    );
  }
  
  return (
    <div className="voice-auth-container">
      <h2>Voice Authentication</h2>
      
      {status === 'idle' && (
        <div>
          <p>Please say the passphrase: "{passphrase}" to authenticate</p>
          <button 
            className="auth-button"
            onClick={startListening}
          >
            Start Voice Authentication
          </button>
        </div>
      )}
      
      {status === 'listening' && (
        <div>
          <p>Listening... Say the passphrase: "{passphrase}"</p>
          {transcript && <p>Heard: {transcript}</p>}
          <button 
            className="auth-button stop"
            onClick={stopListening}
          >
            Stop Listening
          </button>
        </div>
      )}
      
      {status === 'processing' && (
        <div>
          <p>Processing your voice...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div>
          <p className="success-message">Voice authenticated successfully!</p>
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <p className="error-message">{errorMessage}</p>
          <button 
            className="auth-button retry"
            onClick={() => {
              setStatus('idle');
              setErrorMessage('');
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceAuth;