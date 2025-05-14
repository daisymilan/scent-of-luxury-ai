
/**
 * Custom hook for speech synthesis in the AI Assistant
 */

type SpeechResult = {
  utterance: SpeechSynthesisUtterance | null;
  error?: Error;
};

export function useSpeechSynthesis() {
  // Check if the browser supports the Web Speech API
  const isSupported = () => {
    return 'speechSynthesis' in window;
  };

  // Check if speech synthesis is currently speaking
  const isSpeaking = () => {
    if (!isSupported()) return false;
    return window.speechSynthesis.speaking;
  };

  // Stop any current speech
  const stop = () => {
    if (!isSupported()) return;
    window.speechSynthesis.cancel();
  };

  // Speak the provided text
  const speak = (text: string): SpeechResult => {
    if (!isSupported()) {
      console.error('Speech synthesis is not supported in this browser');
      return {
        utterance: null,
        error: new Error('Speech synthesis not supported')
      };
    }

    try {
      // Cancel any current speech
      stop();

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set properties for better quality
      utterance.rate = 0.95; // Slightly slower for better comprehension
      utterance.pitch = 1.0; // Default pitch
      utterance.volume = 1.0; // Full volume
      
      // Use a natural sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural') || 
        voice.name.includes('Daniel')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      return { utterance };
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      return {
        utterance: null,
        error: error instanceof Error ? error : new Error('Unknown speech synthesis error')
      };
    }
  };

  return {
    isSupported,
    isSpeaking,
    speak,
    stop
  };
}
