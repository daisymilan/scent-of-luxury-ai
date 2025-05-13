
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { processVoiceAuth } from '@/utils/voiceAuthApi';
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
      setSpeechText('Processing voice authentication...');
      
      console.log('Starting voice processing with audio size:', audioBlob.size);
      
      // Call our voice auth API utility with the configured webhook
      console.log('Sending voice auth request to webhook:', webhookUrl);
      
      const authResponse = await processVoiceAuth(audioBlob, undefined, webhookUrl);
      console.log('Voice auth response received:', authResponse);
      
      if (authResponse.success && authResponse.user) {
        setSpeechText(`Voice recognized: "${authResponse.user.role}"`);
        toast({
          title: 'Voice Recognized',
          description: `Recognized as: ${authResponse.user.role}`,
        });
        
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
          console.log('Matched role found, logging in as:', matchedRole.role);
          // Login with the recognized role credentials
          await login(matchedRole.email, 'password');
          
          toast({
            title: 'Voice Login Successful',
            description: `Welcome, ${authResponse.user.role}`,
          });
        } else {
          console.error('Unrecognized role:', authResponse.user.role);
          setSpeechText('Unrecognized role. Please try again.');
          throw new Error(`Unrecognized role: ${authResponse.user.role}`);
        }
      } else {
        console.error('Voice authentication failed:', authResponse.error || 'Unknown error');
        setSpeechText('Voice recognition failed. Please try again.');
        throw new Error(authResponse.error || 'Voice recognition failed');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      setSpeechText('Voice recognition failed. Please try again.');
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
      
      {speechText && (
        <div className="text-center p-2 bg-muted rounded-md">
          <p className="text-sm">{speechText}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceLoginComponent;
