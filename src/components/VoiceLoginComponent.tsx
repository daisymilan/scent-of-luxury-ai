
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import VoiceRecording from '@/components/voice-login/VoiceRecording';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VoiceLoginComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'success' | 'error'>('idle');
  const { authenticateWithVoice } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const startRecording = () => {
    setIsRecording(true);
    setStatus('recording');
  };
  
  const handleProcessVoice = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setStatus('processing');
      
      // Convert blob to base64 for processing
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        try {
          // Extract base64 content
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (!base64Audio) {
            throw new Error('Failed to encode audio');
          }
          
          // In a real app, this would call a voice recognition API
          // For this demo, we'll simulate a successful authentication with the test account
          const result = await authenticateWithVoice({ audio: base64Audio });
          
          if (result) {
            // Log in the test account for demo purposes
            const email = "admin@minny.com"; // Default test account
            const password = "password123";
            
            // Use the login function from authContext
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (error) {
              console.error("Login error:", error);
              throw error;
            }
            
            if (data.session) {
              setStatus('success');
              toast({
                title: "Voice authentication successful",
                description: "Welcome back!",
                duration: 3000,
              });
              // Redirect to dashboard after short delay
              setTimeout(() => navigate('/'), 1000);
            } else {
              throw new Error("Session not created after login");
            }
          } else {
            throw new Error("Voice authentication failed");
          }
        } catch (error) {
          console.error("Voice processing error:", error);
          setStatus('error');
          toast({
            title: "Voice login failed",
            description: error instanceof Error ? error.message : "Could not authenticate voice",
            variant: "destructive",
            duration: 5000,
          });
        } finally {
          setIsProcessing(false);
          setIsRecording(false);
        }
      };
    } catch (error) {
      console.error("Voice processing error:", error);
      setStatus('error');
      setIsProcessing(false);
      setIsRecording(false);
      toast({
        title: "Voice login failed",
        description: error instanceof Error ? error.message : "Could not process voice recording",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {!isRecording ? (
        <div className="text-center space-y-6">
          <div className="mb-4">
            <p className="text-gray-300 mb-6">
              Authenticate using your voice. Speak clearly after pressing the button below.
            </p>
            <Button 
              onClick={startRecording}
              className="w-full py-6 font-light bg-white text-black hover:bg-gray-200"
            >
              Start Voice Authentication
            </Button>
          </div>
          <div className="text-xs text-gray-400 mt-4">
            <p>For demo purposes, voice login will authenticate you as the admin@minny.com test account.</p>
          </div>
        </div>
      ) : (
        <VoiceRecording 
          onProcessVoice={handleProcessVoice}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default VoiceLoginComponent;
