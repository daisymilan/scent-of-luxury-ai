
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
    
    // For testing, use the provided role or randomly select one
    const roles = [
      { userId: '1', userName: 'CEO', userRole: 'CEO', email: 'ceo@minyork.com' },
      { userId: '2', userName: 'CCO', userRole: 'CCO', email: 'cco@minyork.com' },
      { userId: '3', userName: 'Commercial Director', userRole: 'Commercial Director', email: 'director@minyork.com' },
      { userId: '4', userName: 'Regional Manager', userRole: 'Regional Manager', email: 'regional@minyork.com' },
      { userId: '5', userName: 'Marketing Manager', userRole: 'Marketing Manager', email: 'marketing@minyork.com' }
    ];
    
    const selectedRole = simulatedRole 
      ? roles.find(r => r.userRole.toLowerCase() === simulatedRole.toLowerCase()) 
      : roles[Math.floor(Math.random() * roles.length)];
    
    if (!selectedRole) {
      console.error('Role not recognized:', simulatedRole);
      throw new Error('Role not recognized');
    }
    
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
      console.warn('Primary webhook request failed, trying fallback JSON API:', webhookError);
      
      // If sending audio fails, try a JSON-only approach as fallback
      const jsonPayload = {
        authenticated: true,
        userId: selectedRole.userId,
        userName: selectedRole.userName,
        userRole: selectedRole.userRole,
        token: 'simulated-token-' + Math.random().toString(36).substring(2),
        command: 'login as ' + selectedRole.userRole.toLowerCase()
      };
      
      try {
        const jsonResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(jsonPayload)
        });
        
        if (!jsonResponse.ok) {
          console.error('JSON fallback webhook response error:', jsonResponse.status);
          throw new Error('Voice authentication JSON fallback request failed');
        }
        
        return await jsonResponse.json();
      } catch (jsonError) {
        console.error('JSON fallback failed too, using simulation:', jsonError);
        
        // If both webhook approaches fail, use simulation as final fallback
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
