
// Importing from the global utils instead
import { 
  enrollVoice, 
  verifyVoice, 
  deleteVoiceProfile, 
  resetVoiceEnrollment, 
  processVoiceAuth
} from '@/utils/voiceAuthApi';

// Import the type separately
import type { VoiceAuthResponse } from '@/utils/voiceAuthApi';

// Re-export the imported functions
export { 
  enrollVoice, 
  verifyVoice, 
  deleteVoiceProfile, 
  resetVoiceEnrollment, 
  processVoiceAuth
};

// Re-export the type with the required 'export type' syntax
export type { VoiceAuthResponse };
