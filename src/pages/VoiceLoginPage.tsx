
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import VoiceAuthComponent from '@/components/VoiceAuthComponent';

const VoiceLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-3 bg-black rounded-full flex items-center justify-center">
              <span className="font-serif text-white text-lg">MiN</span>
            </div>
            <h1 className="text-3xl font-serif mb-1">MiN NEW YORK</h1>
            <p className="text-sm text-gray-600">Luxury Fragrances</p>
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Voice Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="mb-4">Use your voice to authenticate with the AI Assistant.</p>
              <p className="text-sm text-gray-500">Say "Login as [role]" to authenticate</p>
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
                  Voice authentication panel is below
                </div>
              </div>
            </div>
            
            <VoiceAuthComponent />
            
            <div className="text-center mt-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Back to traditional login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceLoginPage;
