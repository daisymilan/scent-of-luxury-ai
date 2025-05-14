// src/pages/VoiceLoginPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useVoiceAuth from '../hooks/useVoiceAuth';
import { useToast } from '@/hooks/use-toast';

// SVG icons inline instead of importing from @/components/icons
const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SpinnerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const VoiceLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { authenticateWithVoice, isVoiceEnrolled, isAuthenticated } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState<string>('/');

  // Get the state from location (where user came from)
  useEffect(() => {
    const state = location.state as { from?: { pathname: string } };
    if (state?.from?.pathname) {
      setRedirectUrl(state.from.pathname);
    }
  }, [location]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // If user hasn't enrolled their voice yet, redirect to profile page
  useEffect(() => {
    if (isAuthenticated && !isVoiceEnrolled) {
      toast({
        title: "Voice enrollment required",
        description: "You need to set up voice authentication first.",
        variant: "destructive"
      });
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, isVoiceEnrolled, navigate, toast]);

  // Use our custom voice authentication hook
  const {
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
    reset
  } = useVoiceAuth({
    passphrase: 'scent of luxury',
    maxAttempts: 3
  });

  // Handle voice verification with our auth context
  const handleVerification = async () => {
    if (transcript) {
      const success = await authenticateWithVoice(transcript);
      
      if (success) {
        toast({
          title: "Authentication successful",
          description: "Voice verification complete.",
          variant: "default"
        });
        
        // Redirect to the page user was trying to access
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 1500);
      } else {
        toast({
          title: "Authentication failed",
          description: "Voice verification failed. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Process transcript when it changes
  useEffect(() => {
    if (status === 'listening' && transcript && transcript.toLowerCase().includes('scent of luxury')) {
      stopListening();
      handleVerification();
    }
  }, [transcript, status]);

  // If browser doesn't support speech recognition
  if (!isSupported) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Voice Authentication Not Available</h2>
          <p className="text-gray-600 mb-4">
            Your browser does not support voice recognition.
          </p>
          <p className="text-gray-600 mb-6">
            Please use a different browser like Chrome or Edge, or contact your system administrator for assistance.
          </p>
          <button 
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // If microphone access is denied
  if (isMicrophoneAvailable === false) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Microphone Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Voice authentication requires microphone access.
          </p>
          <p className="text-gray-600 mb-6">
            Please enable microphone access in your browser settings and try again.
          </p>
          <div className="flex flex-col space-y-2">
            <button 
              className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button 
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Voice Authentication</h2>
        <p className="text-gray-500 text-sm mb-6">
          Please authenticate with your voice to access this area
        </p>
        
        {status === 'idle' && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">
              Please say the passphrase:
            </p>
            <p className="text-lg font-medium text-primary mb-6">
              "scent of luxury"
            </p>
            <button 
              className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              onClick={startListening}
              disabled={isLocked}
            >
              Start Voice Authentication
            </button>
          </div>
        )}

        {status === 'listening' && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 text-red-500 animate-pulse">
                <MicrophoneIcon />
              </div>
            </div>
            <p className="text-sm font-medium text-blue-600 mb-4">
              Listening... Say "scent of luxury"
            </p>
            {transcript && (
              <div className="bg-gray-100 p-3 rounded-md mb-4 text-left">
                <p className="text-sm text-gray-700">Heard: {transcript}</p>
              </div>
            )}
            <button 
              className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              onClick={() => stopListening()}
            >
              Stop Listening
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 text-primary">
                <SpinnerIcon />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Processing your voice...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-6 h-6 text-white">
                  <CheckIcon />
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-green-600">
              Voice authenticated successfully!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-4">
            <p className="text-sm font-medium text-red-500 mb-4">
              {errorMessage}
            </p>
            
            {!isLocked && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Attempts remaining: {attemptsRemaining}
                </p>
                <button 
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={reset}
                >
                  Try Again
                </button>
              </>
            )}
            
            {isLocked && (
              <div className="bg-red-50 p-4 rounded-md mb-4">
                <p className="text-sm text-red-500">
                  You've reached the maximum number of attempts.
                </p>
                <p className="text-sm text-red-500">
                  Please try again later or contact support.
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="border-t mt-6 pt-4">
          <button 
            className="w-full text-center text-gray-500 hover:text-gray-700 text-sm"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceLoginPage;
