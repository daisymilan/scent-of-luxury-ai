
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoiceAuth } from '@/components/voice-auth/hooks/useVoiceAuth';
import { LoadingIndicator } from '@/components/voice-auth/LoadingIndicator';
import { AuthContent } from '@/components/voice-auth/AuthContent';
import { getN8nConfig } from '@/components/N8nConfig';

const VoiceAuthComponent: React.FC = () => {
  const { authState, handleAuthResponse, handleLogout } = useVoiceAuth();
  
  // Check for n8n config and update the webhook URL
  useEffect(() => {
    // Check if n8n is configured
    const n8nConfig = getN8nConfig();
    if (n8nConfig && n8nConfig.webhookUrl) {
      console.log('Using configured n8n webhook for voice auth:', n8nConfig.webhookUrl);
      // The webhook URL will be used in processVoiceAuth
    } else {
      console.log('Using default voice auth webhook: https://minnewyorkofficial.app.n8n.cloud/webhook/voice-auth');
    }
  }, []);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">MiN NEW YORK Voice Authentication</CardTitle>
        </CardHeader>
        
        <CardContent>
          {authState.isLoading && <LoadingIndicator />}
          
          {authState.error && (
            <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm mb-3">
              Error: {authState.error}
            </div>
          )}
          
          {!authState.isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Please authenticate using your voice through the microphone button above.</p>
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
