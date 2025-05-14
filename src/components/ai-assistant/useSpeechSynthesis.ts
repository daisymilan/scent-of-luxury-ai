
import { useRef, useEffect, useState } from 'react';

export function useSpeechSynthesis() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [supported, setSupported] = useState<boolean>(false);
  
  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setSupported(true);
      
      // Load voices early
      const getVoices = () => {
        return window.speechSynthesis.getVoices();
      };
      
      getVoices();
      
      // Some browsers need this event to get voices
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
      }
    }
    
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
    console.log("Available voices:", voices.map(v => v.name));
    
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
      return supported;
    }
  };
}
