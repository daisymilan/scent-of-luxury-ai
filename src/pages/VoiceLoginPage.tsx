
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
              <p className="mb-2">Use your voice to authenticate with the AI Assistant.</p>
              <div className="p-2 bg-amber-50 rounded-md text-xs text-amber-800 mb-4">
                Say <strong>"Login as CEO"</strong> or other role to authenticate
              </div>
            </div>
            
            <VoiceAuthComponent />
            
            <div className="text-center mt-6">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Back to traditional login
                </Button>
              </Link>
            </div>
            
            <div className="text-xs text-center text-gray-500 mt-6 border-t pt-4">
              <p className="mb-2">Available test accounts:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>CEO: ceo@minyork.com</div>
                <div>CCO: cco@minyork.com</div>
                <div>Director: director@minyork.com</div>
                <div>Regional: regional@minyork.com</div>
                <div>Marketing: marketing@minyork.com</div>
                <div className="col-span-2 mt-1">Password: password</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceLoginPage;
