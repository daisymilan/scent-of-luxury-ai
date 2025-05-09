
import { useRef, useEffect } from 'react';

export function useSpeechSynthesis() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;
    
    // Cleanup on unmount
    return () => {
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  const speak = (text: string) => {
    if (!synthRef.current) return { success: false };
    
    // Cancel previous speech
    synthRef.current.cancel();
    
    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    
    // Get available voices and choose a good one
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') && voice.name.includes('Female') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen')
    );
    
    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }
    
    utteranceRef.current.rate = 0.9; // Slightly slower than default
    utteranceRef.current.pitch = 1.1; // Slightly higher pitch
    
    // Speak
    synthRef.current.speak(utteranceRef.current);
    
    return {
      success: true,
      stop: () => {
        if (synthRef.current) {
          synthRef.current.cancel();
        }
      },
      utterance: utteranceRef.current
    };
  };
  
  return {
    speak,
    stop: () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    },
    isSpeaking: () => {
      return synthRef.current ? synthRef.current.speaking : false;
    },
    isSupported: () => {
      return 'speechSynthesis' in window;
    }
  };
}
