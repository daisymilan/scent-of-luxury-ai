
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { processVoiceAuth } from '@/utils/voiceAuthApi';
import VoiceAuthComponent from '@/components/VoiceAuthComponent';
import VoiceRecording from '@/components/voice-login/VoiceRecording';
import { getN8nConfig } from '@/components/N8nConfig';

const VoiceLoginComponent: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [webhookUrl, setWebhookUrl] = useState<string>('https://minnewyorkofficial.app.n8n.cloud/webhook/voice-auth');
  const { login } = useAuth();
  const { toast } = useToast();

  // Check for n8n config and update the webhook URL
  useEffect(() => {
    const n8nConfig = getN8nConfig();
    if (n8nConfig && n8nConfig.webhookUrl) {
      // Use the custom webhook URL if provided
      setWebhookUrl(n8nConfig.webhookUrl);
      console.log('Using custom n8n webhook for voice auth:', n8nConfig.webhookUrl);
    } else {
      console.log('Using default voice auth webhook:', webhookUrl);
    }
  }, []);

  const handleProcessVoice = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setSpeechText('Processing voice...');
      
      // Call our voice auth API utility with the configured webhook
      const authResponse = await processVoiceAuth(audioBlob, undefined, webhookUrl);
      
      if (authResponse.success && authResponse.user) {
        setSpeechText(`Voice recognized: "${authResponse.user.role}"`);
        
        // Find the email for the recognized role
        const roles = [
          { email: 'ceo@minyork.com', role: 'CEO' },
          { email: 'cco@minyork.com', role: 'CCO' },
          { email: 'director@minyork.com', role: 'Commercial Director' },
          { email: 'regional@minyork.com', role: 'Regional Manager' },
          { email: 'marketing@minyork.com', role: 'Marketing Manager' }
        ];
        
        const matchedRole = roles.find(r => 
          r.role.toLowerCase() === authResponse.user?.role.toLowerCase()
        );
        
        if (matchedRole) {
          // Login with the recognized role credentials
          await login(matchedRole.email, 'password');
          
          toast({
            title: 'Voice Login Successful',
            description: `Welcome, ${authResponse.user.role}`,
          });
        } else {
          throw new Error(`Unrecognized role: ${authResponse.user.role}`);
        }
      } else {
        throw new Error(authResponse.error || 'Voice recognition failed');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: 'Voice Recognition Failed',
        description: 'Could not recognize your voice. Please try again or use password login.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <VoiceRecording 
        onProcessVoice={handleProcessVoice}
        isProcessing={isProcessing}
      />
      
      {/* Voice Authentication Component */}
      <VoiceAuthComponent />
    </div>
  );
};

export default VoiceLoginComponent;
