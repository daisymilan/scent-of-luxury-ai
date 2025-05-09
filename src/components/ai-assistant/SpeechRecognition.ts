
// Utility for initializing and managing speech recognition

// Define browser support detection results
export type SpeechSupportResult = {
  isSupported: boolean;
  errorMessage: string | null;
};

// Function to check browser Speech Recognition support
export function checkSpeechRecognitionSupport(): SpeechSupportResult {
  // Check for modern and webkit implementations
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    return {
      isSupported: true,
      errorMessage: null
    };
  }
  
  // Only provide an error message if speech recognition is not available
  return {
    isSupported: false,
    errorMessage: "Your browser doesn't support speech recognition. Try using Chrome or Edge instead."
  };
}

export function createSpeechRecognition(handlers: {
  onResult: (transcript: string) => void;
  onError: (error: any) => void;
  onEnd: () => void;
}) {
  // Check if Web Speech API is available
  const supportResult = checkSpeechRecognitionSupport();
  
  if (!supportResult.isSupported) {
    console.log('Speech recognition not supported:', supportResult.errorMessage);
    handlers.onError({
      error: 'not-supported',
      message: supportResult.errorMessage || "Speech recognition not supported in this browser"
    });
    return null;
  }

  try {
    // Get the appropriate speech recognition constructor
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error("Speech recognition constructor not found");
    }
    
    // Create speech recognition instance
    const recognition = new SpeechRecognition();
    
    // Configure recognition with more specific settings
    recognition.continuous = false;      // Single result per session
    recognition.interimResults = true;   // Enable interim results for faster feedback
    recognition.maxAlternatives = 1;     // Only need the most likely transcription
    recognition.lang = 'en-US';
    
    // Set up event listeners
    recognition.onresult = (event: any) => {
      if (event.results && event.results.length > 0) {
        // Get the most confident result
        const transcript = event.results[0][0].transcript;
        console.log('Voice recognized:', transcript, 'Confidence:', event.results[0][0].confidence);
        handlers.onResult(transcript);
      } else {
        console.warn('Speech recognition event had no results');
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error, event);
      handlers.onError(event);
    };
    
    recognition.onend = () => {
      console.log('Speech recognition ended');
      handlers.onEnd();
    };
    
    return {
      start: () => {
        try {
          console.log('Starting speech recognition...');
          recognition.start();
        } catch (e) {
          console.error('Speech recognition start error:', e);
          handlers.onError(e);
        }
      },
      stop: () => {
        try {
          console.log('Stopping speech recognition...');
          recognition.stop();
        } catch (e) {
          console.log('Speech recognition was already stopped');
        }
      }
    };
  } catch (error) {
    console.error('Error creating speech recognition:', error);
    handlers.onError({
      error: 'initialization-failed',
      message: "Failed to initialize speech recognition"
    });
    return null;
  }
}
