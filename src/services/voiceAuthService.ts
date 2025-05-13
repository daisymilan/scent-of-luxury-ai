// src/services/voiceAuthService.ts

import supabase from "../supabase";

/**
 * Voice Authentication Service
 * This service handles voice authentication functionality with Supabase.
 */

/**
 * Enroll a user's voice samples for future authentication
 */
export const enrollVoice = async (userId: string, voiceSamples: string[]): Promise<boolean> => {
  try {
    // Check if user already has voice data
    const { data: existingData, error: fetchError } = await supabase
      .from('voice_data')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking existing voice data:', fetchError);
      return false;
    }
    
    // If user already has voice data, update it
    if (existingData) {
      const { error: updateError } = await supabase
        .from('voice_data')
        .update({
          samples: voiceSamples,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating voice data:', updateError);
        return false;
      }
    } else {
      // Otherwise, insert new voice data
      const { error: insertError } = await supabase
        .from('voice_data')
        .insert({
          user_id: userId,
          samples: voiceSamples,
          enrolled_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          authentication_count: 0,
          failed_attempts: 0
        });
      
      if (insertError) {
        console.error('Error inserting voice data:', insertError);
        return false;
      }
    }
    
    // Update user profile to mark voice as enrolled
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ voice_enrolled: true })
      .eq('id', userId);
    
    if (profileError) {
      console.error('Error updating user profile:', profileError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Voice enrollment error:', error);
    return false;
  }
};

/**
 * Verify a user's voice against their stored voice profile
 * In a real implementation, this would involve complex audio processing
 * and biometric matching, but we're using a simple text match for demo purposes
 */
export const verifyVoice = async (userId: string, voiceInput: string): Promise<{
  success: boolean;
  confidence?: number;
  message?: string;
}> => {
  try {
    // Check if the user has enrolled voice data
    const { data: voiceData, error: fetchError } = await supabase
      .from('voice_data')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      return {
        success: false,
        message: 'Voice data not found. Please enroll your voice first.'
      };
    }
    
    // In a real implementation, we would perform voice biometric matching here
    // For demo purposes, we'll just check if the voiceInput contains our passphrase
    const containsPassphrase = voiceInput.toLowerCase().includes('scent of luxury');
    
    if (containsPassphrase) {
      // Record successful authentication
      const { error: updateError } = await supabase
        .from('voice_data')
        .update({
          last_authenticated: new Date().toISOString(),
          authentication_count: (voiceData.authentication_count || 0) + 1
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating voice data after successful authentication:', updateError);
      }
      
      return {
        success: true,
        confidence: 0.92,
        message: 'Voice authenticated successfully'
      };
    } else {
      // Record failed attempt
      const { error: updateError } = await supabase
        .from('voice_data')
        .update({
          failed_attempts: (voiceData.failed_attempts || 0) + 1,
          last_failed_attempt: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating voice data after failed authentication:', updateError);
      }
      
      return {
        success: false,
        confidence: 0.35,
        message: 'Voice authentication failed. Please try again with the correct passphrase.'
      };
    }
  } catch (error) {
    console.error('Voice verification error:', error);
    return {
      success: false,
      message: 'Error processing voice authentication. Please try again.'
    };
  }
};

/**
 * Get the voice authentication status for a user
 */
export const getVoiceAuthStatus = async (userId: string): Promise<{
  isEnrolled: boolean;
  lastVerified?: string;
  attemptsRemaining?: number;
}> => {
  try {
    // Check user profile for voice enrollment status
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('voice_enrolled')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { isEnrolled: false };
    }
    
    const isEnrolled = !!profileData.voice_enrolled;
    
    if (!isEnrolled) {
      return { isEnrolled: false };
    }
    
    // Get voice data for additional information
    const { data: voiceData, error: voiceError } = await supabase
      .from('voice_data')
      .select('last_authenticated, failed_attempts')
      .eq('user_id', userId)
      .single();
    
    if (voiceError) {
      console.error('Error fetching voice data:', voiceError);
      return { isEnrolled: true };
    }
    
    // Maximum 3 attempts
    const attemptsRemaining = Math.max(0, 3 - (voiceData.failed_attempts || 0));
    
    return {
      isEnrolled: true,
      lastVerified: voiceData.last_authenticated,
      attemptsRemaining
    };
  } catch (error) {
    console.error('Voice status check error:', error);
    return { isEnrolled: false };
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