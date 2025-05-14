// src/utils/voiceAuthApi.ts
// Update the VoiceAuthResponse interface to include the error property

// Update the VoiceAuthResponse interface to include the error property
export interface VoiceAuthResponse {
  success: boolean;
  message?: string;
  error?: string;  // Add the error property
  data?: any;
  user?: {
    role: string;
    id?: string;
  };
}

// Voice authentication API functions
export const enrollVoice = async (userId: string, voiceSamples: string[]): Promise<VoiceAuthResponse> => {
  try {
    // This would be replaced with an actual API call to your voice authentication service
    console.log(`Enrolling voice for user ${userId} with ${voiceSamples.length} samples`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return success response
    return {
      success: true,
      message: "Voice enrolled successfully",
      data: {
        userId,
        enrollmentDate: new Date().toISOString(),
        samplesProcessed: voiceSamples.length
      }
    };
  } catch (error) {
    console.error("Voice enrollment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during voice enrollment",
    };
  }
};

export const verifyVoice = async (userId: string, voiceSample: string): Promise<VoiceAuthResponse> => {
  try {
    // This would be replaced with an actual API call to your voice authentication service
    console.log(`Verifying voice for user ${userId}`);
    
    // Simulate API call with 80% success rate for testing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isMatch = Math.random() > 0.2; // 80% success rate
    
    if (isMatch) {
      return {
        success: true,
        message: "Voice verification successful",
        data: {
          userId,
          verificationDate: new Date().toISOString(),
          confidenceScore: Math.random() * 0.3 + 0.7 // Random score between 0.7 and 1.0
        }
      };
    } else {
      return {
        success: false,
        error: "Voice verification failed. Please try again.",
      };
    }
  } catch (error) {
    console.error("Voice verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during voice verification",
    };
  }
};

export const deleteVoiceProfile = async (userId: string): Promise<VoiceAuthResponse> => {
  try {
    // This would be replaced with an actual API call to your voice authentication service
    console.log(`Deleting voice profile for user ${userId}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: "Voice profile deleted successfully"
    };
  } catch (error) {
    console.error("Voice profile deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during voice profile deletion",
    };
  }
};

// Add the missing processVoiceAuth function
export const processVoiceAuth = async (audioBlob: Blob, userId?: string, webhookUrl?: string): Promise<VoiceAuthResponse> => {
  try {
    console.log(`Processing voice authentication for ${userId || 'unknown user'}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock successful authentication
    const roles = ['CEO', 'CCO', 'Commercial Director', 'Regional Manager', 'Marketing Manager'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    return {
      success: true,
      message: "Voice authentication successful",
      user: {
        role: randomRole,
        id: userId || 'user-' + Math.random().toString(36).substring(2, 9)
      }
    };
  } catch (error) {
    console.error("Voice processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during voice processing",
    };
  }
};

// Update the getExecutiveRoles function to ensure it returns a Promise with string[]
export const getExecutiveRoles = async (): Promise<any[]> => {
  try {
    // Return a list of executive roles with more complete data
    return [
      {
        id: 'exec-1',
        name: 'Chad Smith',
        email: 'chad.smith@minyork.com',
        role: 'CEO',
        department: 'Executive Office',
        accessLevel: 'all'
      },
      {
        id: 'exec-2',
        name: 'Emma Johnson',
        email: 'emma.johnson@minyork.com',
        role: 'CCO',
        department: 'Executive Office',
        accessLevel: 'high'
      },
      {
        id: 'exec-3',
        name: 'Michael Chen',
        email: 'michael.chen@minyork.com',
        role: 'Commercial Director',
        department: 'Sales',
        accessLevel: 'medium'
      },
      {
        id: 'exec-4',
        name: 'Sophia Rodriguez',
        email: 'sophia.rodriguez@minyork.com',
        role: 'Regional Manager',
        department: 'Operations',
        accessLevel: 'medium'
      },
      {
        id: 'exec-5',
        name: 'James Wilson',
        email: 'james.wilson@minyork.com',
        role: 'Marketing Manager',
        department: 'Marketing',
        accessLevel: 'low'
      }
    ];
  } catch (error) {
    console.error("Error fetching executive roles:", error);
    return [];
  }
};

// Add the missing resetVoiceEnrollment function
export const resetVoiceEnrollment = async (userId: string): Promise<VoiceAuthResponse> => {
  try {
    console.log(`Resetting voice enrollment for user ${userId}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: "Voice enrollment reset successfully"
    };
  } catch (error) {
    console.error("Voice enrollment reset error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during voice enrollment reset",
    };
  }
};
