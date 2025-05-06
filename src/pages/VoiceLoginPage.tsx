
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceAuthAssistant from '@/components/VoiceAuthAssistant';

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
              <p className="text-xs text-gray-500">Available roles: CEO, CCO, Commercial Director, Regional Manager, Marketing Manager</p>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 18.5v3.5M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
