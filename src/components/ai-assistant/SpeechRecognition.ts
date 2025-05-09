
// Utility for initializing and managing speech recognition

export function createSpeechRecognition(handlers: {
  onResult: (transcript: string) => void;
  onError: (error: any) => void;
  onEnd: () => void;
}) {
  // Check if Web Speech API is available
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.log('Speech recognition not supported');
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
