
// src/pages/SignupPage.tsx - UPDATED VERSION

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VoiceEnrollment from '../components/VoiceEnrollment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// Step component to display current registration step
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i + 1 === currentStep ? 'bg-primary text-white' : 
              i + 1 < currentStep ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            {i + 1 < currentStep ? '✓' : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div 
              className={`h-1 w-10 ${
                i + 1 < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

const SignupPage = () => {
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Registration steps
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, login, enrollVoice } = useAuth();
  
  // Handle form submission for step 1
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create userData object as Record<string, any>
      const userData: Record<string, any> = {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        fragrancePreference: '',
        fragranceStyle: '',
        fragranceStrength: ''
      };
      
      // Register the user using AuthContext
      await register(email, password, userData);
      
      // Login the user to get the session
      await login(email, password);
      
      // Proceed to voice enrollment step
      setStep(2);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Now let's set up voice authentication.",
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle voice enrollment completion
  const handleVoiceEnrollment = async (voiceSamples: string[]) => {
    setIsLoading(true);
    
    try {
      // Use the enrollVoice function from AuthContext
      const success = await enrollVoice(voiceSamples);
      
      // After successful enrollment, proceed to the next step
      if (success) {
        setStep(3);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Voice enrollment error:', error);
      toast({
        title: "Error",
        description: "Failed to enroll voice. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle skip voice enrollment
  const handleSkipVoice = () => {
    setStep(3);
  };
  
  // Handle completion
  const handleComplete = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            {step === 1 && "Fill in your details to create a new account"}
            {step === 2 && "Set up voice authentication for enhanced security"}
            {step === 3 && "Your account has been created successfully"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={step} totalSteps={3} />
          
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <a href="/login" className="text-primary hover:underline">
                  Sign in
                </a>
              </div>
            </form>
          )}
          
          {step === 2 && (
            <VoiceEnrollment 
              onComplete={handleVoiceEnrollment} 
              onSkip={handleSkipVoice} 
              passphrase="scent of luxury"
              requiredSamples={3}
            />
          )}
          
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h3 className="text-xl font-medium text-green-600">Registration Completed!</h3>
              
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Your account has been successfully created and you're now ready to experience the Scent of Luxury.
              </p>
              
              <Button 
                className="w-full" 
                onClick={handleComplete}
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
