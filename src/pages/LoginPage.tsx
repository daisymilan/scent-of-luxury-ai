import React, { useState } from 'react';
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
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';

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
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Attempting login with:", data.email); // Add logging
      const success = await login(data.email, data.password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to MiN New York dashboard",
        });
        navigate('/'); // Navigate to the root route
      } else {
        // This handles the case where login returns false but doesn't throw
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error); // Add error logging
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                      <LogIn className="mr-2" size={18} />
                      {isSubmitting ? "Logging in..." : "Login"}
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
              <div className="text-gray-400">Admin: admin@minny.com</div>
              <div className="text-gray-400">Customer: customer@minny.com</div>
              <div className="text-gray-400">Perfumer: perfumer@minny.com</div>
              <div className="text-gray-400">Tester: tester@minny.com</div>
              <div className="col-span-2 mt-1 font-medium">Password: password123</div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
