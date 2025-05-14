
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import VoiceLoginComponent from '@/components/VoiceLoginComponent';
import { Eye, EyeOff, Lock, LogIn, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Enhanced form schema with better validation
const formSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password is too long" }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("password");
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setCurrentEmail(data.email);
      setEmailNotConfirmed(false);
      setLoginError(null);
      
      console.log("Attempting login with:", data.email); 
      
      const success = await login(data.email, data.password);
      
      if (!success) {
        // Check specifically for email confirmation errors
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (error) {
          console.error("Login error:", error.message);
          
          if (error.message.includes('Email not confirmed')) {
            setEmailNotConfirmed(true);
          } else {
            setLoginError(error.message);
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
              duration: 5000,
            });
          }
        } else if (!signInData.session) {
          setLoginError("Login failed. Please check your credentials and try again.");
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        // Successful login
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
      setLoginError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!currentEmail) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: currentEmail,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Could not resend confirmation email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email sent",
          description: "Confirmation email has been resent. Please check your inbox.",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while trying to resend the confirmation email.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    navigate('/signup');
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const handleTestAccountClick = (email: string) => {
    form.setValue('email', email);
    form.setValue('password', 'password123');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-gray-900 to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-3 bg-white rounded-full flex items-center justify-center">
              <span className="font-medium text-black text-lg">MiN</span>
            </div>
            <h1 className="text-3xl font-medium text-white mb-1">MiN New York</h1>
            <p className="text-sm text-gray-400">Modern Intelligence</p>
          </div>
        </div>
        
        <Card className="w-full shadow-sm border-gray-800 bg-gray-900 text-gray-100">
          {emailNotConfirmed && (
            <Alert className="m-4 border-amber-500 bg-amber-900/20 text-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Email not confirmed. Please check your inbox and click the confirmation link.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-amber-500 text-amber-200 hover:bg-amber-800/20"
                    onClick={handleResendConfirmation}
                  >
                    Resend confirmation email
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {loginError && (
            <Alert className="m-4 border-red-500 bg-red-900/20 text-red-200">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-gray-800">
              <TabsTrigger value="password" className="text-xs uppercase tracking-wider font-light py-3 data-[state=active]:bg-gray-700">
                Password
              </TabsTrigger>
              <TabsTrigger value="voice" className="text-xs uppercase tracking-wider font-light py-3 data-[state=active]:bg-gray-700">
                Voice
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="password" className="space-y-4 mt-4">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <FormLabel className="text-xs uppercase tracking-wider font-light text-gray-300">Email</FormLabel>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                              <FormControl>
                                <Input 
                                  placeholder="email@example.com" 
                                  className="pl-10 py-6 text-base bg-gray-800 border-gray-700 text-gray-100" 
                                  {...field} 
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-xs uppercase tracking-wider font-light text-gray-300">Password</FormLabel>
                        <Button 
                          type="button" 
                          variant="link" 
                          className="h-auto p-0 text-xs uppercase tracking-wider font-light text-gray-400"
                          onClick={handleForgotPasswordClick}
                        >
                          Forgot Password?
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                              <FormControl>
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  className="pl-10 py-6 text-base bg-gray-800 border-gray-700 text-gray-100" 
                                  {...field} 
                                  autoComplete="current-password"
                                />
                              </FormControl>
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 font-light bg-white text-black hover:bg-gray-200" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <span className="mr-2 animate-spin">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          Logging in...
                        </div>
                      ) : (
                        <>
                          <LogIn className="mr-2" size={18} />
                          Login
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Button 
                      type="button" 
                      variant="link" 
                      className="h-auto p-0 text-gray-300 hover:text-white"
                      onClick={handleRegisterClick}
                    >
                      Sign up
                    </Button>
                  </p>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="voice" className="mt-4">
              <CardContent className="p-6">
                <VoiceLoginComponent />
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex flex-col text-center text-xs text-gray-400 pt-2 pb-6 px-6">
            <p className="mb-2 text-xs uppercase tracking-wide font-light">Available test accounts:</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 w-full">
              <button 
                onClick={() => handleTestAccountClick('admin@minny.com')}
                className="text-gray-400 hover:text-white text-left hover:underline"
              >
                Admin: admin@minny.com
              </button>
              <button
                onClick={() => handleTestAccountClick('customer@minny.com')}
                className="text-gray-400 hover:text-white text-left hover:underline"
              >
                Customer: customer@minny.com
              </button>
              <button
                onClick={() => handleTestAccountClick('perfumer@minny.com')}
                className="text-gray-400 hover:text-white text-left hover:underline"
              >
                Perfumer: perfumer@minny.com
              </button>
              <button
                onClick={() => handleTestAccountClick('tester@minny.com')}
                className="text-gray-400 hover:text-white text-left hover:underline"
              >
                Tester: tester@minny.com
              </button>
              <div className="col-span-2 mt-1 font-medium">Password: password123</div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
