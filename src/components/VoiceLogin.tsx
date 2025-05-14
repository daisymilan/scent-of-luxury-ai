
// src/components/VoiceLogin.tsx

import React, { useEffect } from 'react';
import useVoiceAuth from '../hooks/useVoiceAuth';
import '../styles/VoiceAuth.css';

interface VoiceLoginProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
  passphrase?: string;
}

const VoiceLogin: React.FC<VoiceLoginProps> = ({
  onSuccess,
  onError,
  passphrase = 'modern intelligence'
}) => {
  const {
    status,
    isListening,
    transcript,
    errorMessage,
    attempts,
    attemptsRemaining,
    isSupported,
    isMicrophoneAvailable,
    isLocked,
    startListening,
    stopListening,
    reset
  } = useVoiceAuth({
    passphrase,
    maxAttempts: 3,
    mockMode: true // Set to false in production to use real API
  });

  // Call onSuccess when authentication succeeds
  useEffect(() => {
    if (status === 'success') {
      onSuccess();
    }
  }, [status, onSuccess]);

  // Call onError when there's an error
  useEffect(() => {
    if (status === 'error' && onError && errorMessage) {
      onError(errorMessage);
    }
  }, [status, errorMessage, onError]);

  // If browser doesn't support speech recognition
  if (!isSupported) {
    return (
      <div className="voice-auth-container">
        <div className="voice-auth-card">
          <h2>Voice Authentication Not Available</h2>
          <p>Your browser does not support voice recognition.</p>
          <p>Please use a different browser like Chrome or use password authentication instead.</p>
        </div>
      </div>
    );
  }

  // If microphone access is denied
  if (isMicrophoneAvailable === false) {
    return (
      <div className="voice-auth-container">
        <div className="voice-auth-card">
          <h2>Microphone Access Denied</h2>
          <p>Voice authentication requires microphone access.</p>
          <p>Please enable microphone access in your browser settings and try again.</p>
          <button 
            className="voice-auth-button primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-auth-container">
      <div className="voice-auth-card">
        <h2>Voice Authentication</h2>
        
        {/* Idle state - ready to start */}
        {status === 'idle' && (
          <div className="voice-auth-content">
            <p className="voice-auth-instruction">
              Please say the passphrase:
            </p>
            <p className="voice-auth-passphrase">"{passphrase}"</p>
            <div className="voice-auth-actions">
              <button 
                className="voice-auth-button primary"
                onClick={startListening}
                disabled={isLocked}
              >
                Start Voice Authentication
              </button>
            </div>
          </div>
        )}
        
        {/* Listening state */}
        {status === 'listening' && (
          <div className="voice-auth-content">
            <div className="voice-auth-mic-icon active">
              <svg viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
            <p className="voice-auth-instruction listening">
              Listening... Say the passphrase
            </p>
            {transcript && (
              <div className="voice-auth-transcript">
                <p>Heard: {transcript}</p>
              </div>
            )}
            <div className="voice-auth-actions">
              <button 
                className="voice-auth-button stop"
                onClick={stopListening}
              >
                Stop Listening
              </button>
            </div>
          </div>
        )}
        
        {/* Processing state */}
        {status === 'processing' && (
          <div className="voice-auth-content">
            <div className="voice-auth-loading">
              <div className="voice-auth-spinner"></div>
              <p className="voice-auth-instruction processing">
                Processing your voice...
              </p>
            </div>
          </div>
        )}
        
        {/* Success state */}
        {status === 'success' && (
          <div className="voice-auth-content">
            <div className="voice-auth-success-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <p className="voice-auth-instruction success">
              Voice authenticated successfully!
            </p>
          </div>
        )}
        
        {/* Error state */}
        {status === 'error' && (
          <div className="voice-auth-content">
            <p className="voice-auth-instruction error">
              {errorMessage}
            </p>
            
            {!isLocked && (
              <div className="voice-auth-actions">
                <p className="voice-auth-attempts">
                  Attempts remaining: {attemptsRemaining}
                </p>
                <button 
                  className="voice-auth-button retry"
                  onClick={reset}
                >
                  Try Again
                </button>
              </div>
            )}
            
            {isLocked && (
              <div className="voice-auth-locked">
                <p>You've reached the maximum number of attempts.</p>
                <p>Please try again later or use an alternative method.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceLogin;
