
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceAuthAssistant from '@/components/VoiceAuthAssistant';
import { Mic } from 'lucide-react';

const VoiceLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">MiN NEW YORK</h1>
          <p className="text-gray-500 mt-2">Voice Authentication</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Voice Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="mb-4">Use your voice to authenticate with the Grok AI Assistant.</p>
              <p className="text-sm text-gray-500">Say "Login as [role]" to authenticate</p>
              <p className="text-xs text-gray-500 mb-2">Available roles: CEO, CCO, Commercial Director, Regional Manager, Marketing Manager</p>
              <div className="p-2 bg-amber-50 rounded-md text-xs text-amber-800 mb-4">
                Click the microphone button in the assistant panel below to start voice recognition
              </div>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white shadow-lg relative">
                <Mic size={40} />
                <div className="absolute -bottom-2 bg-amber-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                  Click Below
                </div>
                <div className="absolute -top-10 w-40 text-xs text-center text-gray-500">
                  Voice authentication panel is at the bottom of the screen
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Back to traditional login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <VoiceAuthAssistant />
    </div>
  );
};

export default VoiceLoginPage;
