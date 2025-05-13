
// Voice Authentication API utility

export interface VoiceAuthResponse {
  success: boolean;
  message: string;
  sessionToken?: string;
  user?: {
    id: string;
    name: string;
    role: string;
  };
  command?: string;
  error?: string;
}

/**
 * Sends voice data to the webhook handler
 * This function will forward the voice authentication request to the n8n webhook
 */
export const processVoiceAuth = async (
  audioBlob: Blob,
  simulatedRole?: string,
  customWebhookUrl?: string
): Promise<VoiceAuthResponse> => {
  try {
    console.log('processVoiceAuth called with:', { 
      blobSize: audioBlob.size, 
      simulatedRole, 
      webhookUrl: customWebhookUrl 
    });
    
    // In a production app, you would send the audioBlob to your voice recognition service
    // For this integration, we'll simulate a call to the n8n webhook
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use the provided role or extract from audio (simulated)
    let roleToUse = simulatedRole;
    
    // If no specific role was provided, randomly select one for demo purposes
    if (!roleToUse) {
      const possibleRoles = ['CEO', 'CCO', 'Commercial Director', 'Regional Manager', 'Marketing Manager'];
      roleToUse = possibleRoles[Math.floor(Math.random() * possibleRoles.length)];
      console.log('No specific role provided, using random role:', roleToUse);
    }
    
    // For testing, use the provided role or randomly select one
    const roles = [
      { userId: '1', userName: 'Alex Morgan', userRole: 'CEO', email: 'ceo@minyork.com' },
      { userId: '2', userName: 'Jamie Rivera', userRole: 'CCO', email: 'cco@minyork.com' },
      { userId: '3', userName: 'Taylor Chen', userRole: 'Commercial Director', email: 'director@minyork.com' },
      { userId: '4', userName: 'Jordan Smith', userRole: 'Regional Manager', email: 'regional@minyork.com' },
      { userId: '5', userName: 'Casey Wong', userRole: 'Marketing Manager', email: 'marketing@minyork.com' }
    ];
    
    // Find matching role or use CEO as default
    const selectedRole = roles.find(r => 
      r.userRole.toLowerCase() === roleToUse?.toLowerCase()
    ) || roles[0];
    
    // Use the real n8n webhook endpoint or the custom one if provided
    const n8nWebhookUrl = customWebhookUrl || 'https://minnewyorkofficial.app.n8n.cloud/webhook/voice-auth';
    console.log('Using webhook URL for voice auth:', n8nWebhookUrl);
    
    // Create the payload for the n8n webhook
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice.webm');
    formData.append('userId', selectedRole.userId);
    formData.append('userName', selectedRole.userName);
    formData.append('userRole', selectedRole.userRole);
    formData.append('command', `login as ${selectedRole.userRole.toLowerCase()}`);
    
    try {
      console.log('Making webhook request to:', n8nWebhookUrl);
      
      // First, try to use the webhook directly with the audio blob
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        console.error('Webhook response error:', response.status, response.statusText);
        throw new Error('Voice authentication webhook request failed');
      }
      
      try {
        const data = await response.json();
        console.log('Webhook response:', data);
        return data;
      } catch (e) {
        console.error('Error parsing webhook response:', e);
        throw new Error('Failed to parse webhook response');
      }
    } catch (webhookError) {
      console.warn('Primary webhook request failed, using simulation fallback:', webhookError);
      
      // If the webhook call fails, use simulation
      console.log('Using simulated response for role:', selectedRole.userRole);
      
      return {
        success: true,
        message: 'Voice authentication successful (simulated)',
        sessionToken: 'simulated-jwt-token-' + Math.random().toString(36).substring(2),
        user: {
          id: selectedRole.userId,
          name: selectedRole.userName,
          role: selectedRole.userRole
        },
        command: 'login as ' + selectedRole.userRole.toLowerCase()
      };
    }
  } catch (error) {
    console.error('Voice auth error:', error);
    return {
      success: false,
      message: 'Voice authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
