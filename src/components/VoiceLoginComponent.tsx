
// src/components/VoiceLoginComponent.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { processVoiceAuth } from '@/utils/voiceAuthApi';
import VoiceRecording from '@/components/voice-login/VoiceRecording';
import useVoiceAuth from '@/hooks/useVoiceAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Mic, Shield } from 'lucide-react';

interface VoiceLoginComponentProps {
  webhookUrl?: string;
  onLoginSuccess?: () => void;
}

const VoiceLoginComponent: React.FC<VoiceLoginComponentProps> = ({ 
  webhookUrl,
  onLoginSuccess 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  // Use our voice auth hook for the passphrase recognition
  const voiceAuth = useVoiceAuth({
    passphrase: 'scent of luxury',
    mockMode: true,
    webhookUrl
  });

  // Handle login success - redirect or callback
  useEffect(() => {
    if (voiceAuth.status === 'success') {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  }, [voiceAuth.status, onLoginSuccess]);

  // Process the voice recording
  const handleProcessVoice = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setStatusMessage('Processing executive voice authentication...');
      
      console.log('Starting voice processing with audio size:', audioBlob.size);
      
      // Call our voice auth API utility with the configured webhook
      console.log('Sending voice auth request to webhook:', webhookUrl || 'default');
      
      const authResponse = await processVoiceAuth(audioBlob, undefined, webhookUrl);
      console.log('Voice auth response received:', authResponse);
      
      if (authResponse.success && authResponse.user) {
        setStatusMessage(`Authentication successful: ${authResponse.user.role}`);
        toast({
          title: 'Authentication Successful',
          description: `Welcome, ${authResponse.user.role}`,
        });
        
        // Find the email for the recognized role
        const roles = [
          { email: 'ceo@scentluxury.ai', role: 'CEO' },
          { email: 'cco@scentluxury.ai', role: 'CCO' },
          { email: 'director@scentluxury.ai', role: 'Commercial Director' },
          { email: 'regional@scentluxury.ai', role: 'Regional Manager' },
          { email: 'marketing@scentluxury.ai', role: 'Marketing Manager' }
        ];
        
        const matchedRole = roles.find(r => 
          r.role.toLowerCase() === authResponse.user?.role.toLowerCase()
        );
        
        if (matchedRole) {
          console.log('Executive role identified:', matchedRole.role);
          // Login with the recognized role credentials
          await login(matchedRole.email, 'password123');
          
          toast({
            title: 'Access Granted',
            description: `Welcome to the executive dashboard, ${authResponse.user.role}`,
          });
        } else {
          console.error('Unrecognized executive role:', authResponse.user.role);
          setStatusMessage('Unrecognized executive role. Please try again or contact IT support.');
          throw new Error(`Unrecognized role: ${authResponse.user.role}`);
        }
      } else {
        console.error('Voice authentication failed:', authResponse.message || 'Unknown error');
        setStatusMessage('Executive voice authentication failed. Please try again.');
        throw new Error(authResponse.message || 'Voice authentication failed');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      setStatusMessage('Voice authentication failed. Please try again.');
      toast({
        title: 'Authentication Failed',
        description: 'Could not verify your executive voice profile. Please try again or use your password.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Or use direct voice authentication with passphrase
  const handleDirectAuthentication = () => {
    voiceAuth.startListening();
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Information about voice login */}
      <Alert variant="default" className="bg-slate-50 border-slate-200">
        <Shield className="h-4 w-4 text-slate-500" />
        <AlertDescription className="text-sm text-slate-700">
          Use your executive voice authentication for secure dashboard access.
        </AlertDescription>
      </Alert>
      
      {/* Choose between passphrase recognition or manual recording */}
      <div className="flex flex-col space-y-4">
        {/* Option 1: Record & Analyze */}
        <VoiceRecording 
          onProcessVoice={handleProcessVoice}
          isProcessing={isProcessing}
          buttonText="Start Voice Authentication"
          messageText="Record your voice for secure executive access"
        />
        
        {/* OR divider */}
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        
        {/* Option 2: Say Passphrase */}
        {voiceAuth.status === 'idle' && (
          <Button 
            onClick={handleDirectAuthentication}
            variant="outline" 
            className="w-full border-dashed border-slate-300 hover:border-slate-400 flex items-center justify-center py-6"
          >
            <Mic className="mr-2 h-4 w-4 text-slate-500" />
            <span>Authenticate with Company Passphrase</span>
          </Button>
        )}
        
        {/* Show status when using passphrase method */}
        {voiceAuth.status !== 'idle' && (
          <div className={`p-4 rounded-md text-center ${
            voiceAuth.status === 'listening' ? 'bg-blue-50 text-blue-700' :
            voiceAuth.status === 'processing' ? 'bg-yellow-50 text-yellow-700' :
            voiceAuth.status === 'success' ? 'bg-green-50 text-green-700' :
            'bg-red-50 text-red-700'
          }`}>
            {voiceAuth.status === 'listening' && (
              <p>Listening... Please say the company passphrase</p>
            )}
            {voiceAuth.status === 'processing' && (
              <p>Processing executive authentication...</p>
            )}
            {voiceAuth.status === 'success' && (
              <p>Executive authentication successful!</p>
            )}
            {voiceAuth.status === 'error' && (
              <div>
                <p>{voiceAuth.errorMessage}</p>
                {!voiceAuth.isLocked && (
                  <Button 
                    onClick={voiceAuth.reset} 
                    variant="outline"
                    className="mt-2 text-xs"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            )}
            
            {voiceAuth.transcript && voiceAuth.status === 'listening' && (
              <div className="mt-2 p-2 bg-white rounded text-gray-700 text-sm">
                <p>Heard: {voiceAuth.transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Status message */}
      {statusMessage && (
        <div className="text-center p-2 bg-gray-50 rounded-md">
          <p className="text-sm">{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceLoginComponent;
