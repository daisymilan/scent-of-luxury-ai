
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
 * In a real implementation, this would send the actual audio blob
 * to n8n for processing, which would then call our webhook
 */
export const processVoiceAuth = async (
  audioBlob: Blob,
  simulatedRole?: string
): Promise<VoiceAuthResponse> => {
  try {
    // In a production app, you would send the audioBlob to your voice recognition service
    // For this prototype, we'll simulate a call to our webhook handler
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For testing, randomly select a role or use the provided one
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
      throw new Error('Role not recognized');
    }
    
    // Try to use the real API endpoint, fallback to simulation if it fails
    try {
      const response = await fetch('/api/voice-auth-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authenticated: true,
          userId: selectedRole.userId,
          userName: selectedRole.userName,
          userRole: selectedRole.userRole,
          token: 'n8n-generated-token',
          command: 'login as ' + selectedRole.userRole.toLowerCase()
        })
      });
      
      if (!response.ok) {
        throw new Error('Voice authentication request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.log('Falling back to simulated response:', error);
      
      // Simulate the webhook response
      return {
        success: true,
        message: 'Voice authentication successful',
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
