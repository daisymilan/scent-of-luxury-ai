
// Utility for initializing and managing speech recognition

// Define browser support detection results
export type SpeechSupportResult = {
  isSupported: boolean;
  errorMessage: string | null;
};

// Function to check browser Speech Recognition support
export function checkSpeechRecognitionSupport(): SpeechSupportResult {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    return {
      isSupported: true,
      errorMessage: null
    };
  }
  
  // Check specifically for different browsers to provide more helpful messages
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('firefox')) {
    return {
      isSupported: false,
      errorMessage: "Firefox doesn't fully support speech recognition. Try Chrome or Edge instead."
    };
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return {
      isSupported: false,
      errorMessage: "Safari has limited support for speech recognition. Try Chrome or Edge instead."
    };
  } else if (userAgent.includes('edge') || userAgent.includes('edg')) {
    // Edge should support it, but just in case
    return {
      isSupported: false,
      errorMessage: "Your version of Edge might not support speech recognition. Try updating your browser."
    };
  } else {
    return {
      isSupported: false,
      errorMessage: "Your browser doesn't support speech recognition. Try using Chrome or Edge instead."
    };
  }
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

  // Create speech recognition instance
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure recognition
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  // Set up event listeners
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    console.log('Voice recognized:', transcript);
    handlers.onResult(transcript);
  };
  
  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    handlers.onError(event);
  };
  
  recognition.onend = () => {
    handlers.onEnd();
  };
  
  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.error('Speech recognition start error:', e);
        handlers.onError(e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        console.log('Speech recognition was not started');
      }
    }
  };
}
