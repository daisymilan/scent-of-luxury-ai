// src/services/voiceAuthService.ts - NEW FILE

import axios from 'axios';

// Base API URL - replace with your actual API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'https://api.scentluxury.com/api';

/**
 * Initialize voice authentication for a user
 * This should be called during user registration to enroll their voice
 */
export const enrollVoice = async (userId: string, voiceSamples: string[]): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/auth/voice-enroll`, {
      userId,
      voiceSamples
    });
    
    return response.data.success;
  } catch (error) {
    console.error('Voice enrollment error:', error);
    throw new Error('Failed to enroll voice data');
  }
};

/**
 * Verify a user's voice against their stored voice profile
 */
export const verifyVoice = async (userId: string, voiceInput: string): Promise<{
  success: boolean;
  confidence?: number;
  message?: string;
}> => {
  try {
    const response = await axios.post(`${API_URL}/auth/voice-verify`, {
      userId,
      voiceInput
    });
    
    return response.data;
  } catch (error) {
    console.error('Voice verification error:', error);
    throw new Error('Failed to verify voice');
  }
};

/**
 * Get the voice authentication status for a user
 */
export const getVoiceAuthStatus = async (userId: string): Promise<{
  isEnrolled: boolean;
  lastVerified?: Date;
  attemptsRemaining?: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/auth/voice-status/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Voice status check error:', error);
    throw new Error('Failed to check voice authentication status');
  }
};

/**
 * Mock API implementation for local testing
 * This can be used during development before connecting to the real backend
 */
export const mockVerifyVoice = (voiceInput: string): Promise<{
  success: boolean;
  confidence?: number;
  message?: string;
}> => {
  return new Promise((resolve) => {
    // Simulate API latency
    setTimeout(() => {
      // Check if the voice input contains our passphrase
      const containsPassphrase = voiceInput.toLowerCase().includes('scent of luxury');
      
      if (containsPassphrase) {
        resolve({
          success: true,
          confidence: 0.92,
          message: 'Voice authenticated successfully'
        });
      } else {
        resolve({
          success: false,
          confidence: 0.35,
          message: 'Voice authentication failed. Please try again with the correct passphrase.'
        });
      }
    }, 1500); // Simulate 1.5s of processing time
  });
};

export default {
  enrollVoice,
  verifyVoice,
  getVoiceAuthStatus,
  mockVerifyVoice
};