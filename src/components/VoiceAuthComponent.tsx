
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoiceAuth } from '@/components/voice-auth/hooks/useVoiceAuth';
import { LoadingIndicator } from '@/components/voice-auth/LoadingIndicator';
import { AuthContent } from '@/components/voice-auth/AuthContent';
import { getN8nConfig } from '@/components/N8nConfig';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processVoiceAuth } from '@/utils/voiceAuthApi';

const VoiceAuthComponent: React.FC = () => {
  const { authState, handleAuthResponse, handleLogout } = useVoiceAuth();
  const [webhookUrl, setWebhookUrl] = useState<string>('https://minnewyorkofficial.app.n8n.cloud/webhook/voice-auth');
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { toast } = useToast();
  
  // Check for n8n config and update the webhook URL
  useEffect(() => {
    // Check if n8n is configured
    const n8nConfig = getN8nConfig();
    if (n8nConfig && n8nConfig.webhookUrl) {
      console.log('Using configured n8n webhook for voice auth:', n8nConfig.webhookUrl);
      setWebhookUrl(n8nConfig.webhookUrl);
    } else {
      console.log('Using default voice auth webhook: https://minnewyorkofficial.app.n8n.cloud/webhook/voice-auth');
    }
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
          try {
            console.log('Processing voice auth with audio size:', audioBlob.size);
            const authResponse = await processVoiceAuth(audioBlob, undefined, webhookUrl);
            console.log('Voice auth response:', authResponse);
            await handleAuthResponse(authResponse);
          } catch (error) {
            console.error('Error processing voice auth:', error);
            toast({
              title: 'Authentication Error',
              description: 'Failed to process voice authentication',
              variant: 'destructive',
            });
          }
        }
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };
      
      recorder.start();
      setIsRecording(true);
      toast({
        title: 'Recording Started',
        description: 'Say "Login as CEO" or other role',
      });
      
      // Auto stop after 5 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 5000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Microphone Error',
        description: 'Could not access your microphone',
        variant: 'destructive',
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">MiN NEW YORK Voice Authentication</CardTitle>
        </CardHeader>
        
        <CardContent>
          {!authState.isAuthenticated && (
            <div className="flex justify-center mb-4">
              <Button
                className="rounded-full h-16 w-16 flex items-center justify-center"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={authState.isLoading}
                variant={isRecording ? "destructive" : "default"}
              >
                <Mic size={24} className={isRecording ? "animate-pulse" : ""} />
              </Button>
            </div>
          )}
          
          {authState.isLoading && <LoadingIndicator />}
          
          {authState.error && (
            <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm mb-3">
              Error: {authState.error}
            </div>
          )}
          
          {!authState.isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {isRecording 
                  ? "Listening... Say 'Login as CEO' or other role" 
                  : "Please authenticate using your voice through the microphone button above."}
              </p>
            </div>
          ) : (
            <AuthContent 
              user={authState.user!}
              dashboardData={authState.dashboardData}
              processedCommand={authState.processedCommand}
              onLogout={handleLogout}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAuthComponent;
