
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { SignupHeader } from '@/components/auth/SignupHeader';
import { SignupTypeSelector } from '@/components/auth/SignupTypeSelector';
import { SignupForm } from '@/components/auth/SignupForm';

const SignupPage: React.FC = () => {
  const [signupType, setSignupType] = useState<'standard' | 'executive'>('standard');
  const navigate = useNavigate();
  
  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-gray-900 to-black">
      <div className="w-full max-w-md">
        <SignupHeader />
        
        <Card className="w-full shadow-sm border-gray-800 bg-gray-900 text-gray-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your details to register
            </CardDescription>
            
            <SignupTypeSelector 
              value={signupType} 
              onChange={(value) => setSignupType(value)} 
            />
          </CardHeader>
          <CardContent className="p-6">
            <SignupForm signupType={signupType} />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
