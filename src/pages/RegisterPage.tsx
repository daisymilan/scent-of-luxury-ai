
// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import '../styles/VoiceAuth.css';

// Enhanced form schema with fragrance preferences
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password is too long" }),
  confirmPassword: z.string(),
  fragrancePreference: z.string().optional(),
  fragranceStyle: z.string().optional(),
  fragranceStrength: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const RegisterPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      fragrancePreference: "",
      fragranceStyle: "",
      fragranceStrength: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Get values from the form
      const { email, password, firstName, lastName, fragrancePreference, fragranceStyle, fragranceStrength } = data;
      
      // Call register function from auth context with userData as second parameter
      await register(email, password, {
        firstName,
        lastName,
        fragrancePreference,
        fragranceStyle,
        fragranceStrength
      });
      
      // Set success state
      setRegistrationSuccess(true);
      
      // Show success toast
      toast({
        title: "Registration successful",
        description: "Welcome to MiN New York. Let's find your perfect fragrance.",
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 py-8">
      <div className="w-full max-w-md">
        {!registrationSuccess ? (
          <>
            <div className="text-center mb-8">
              <div className="flex flex-col items-center justify-center">
                <div className="auth-logo">
                  <span>SL</span>
                </div>
                <h1 className="text-3xl font-serif mb-1">Scent of Luxury</h1>
                <p className="text-sm text-gray-600">Create Your Premium Account</p>
              </div>
            </div>
            
            <Card className="w-full shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-serif text-center">Join Our Fragrance Collection</CardTitle>
                <CardDescription className="text-center">
                  Create an account to discover your perfect scent
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="auth-input-group">
                        <FormLabel className="auth-label">First Name</FormLabel>
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <User className="auth-input-icon" size={16} />
                                <FormControl>
                                  <Input 
                                    placeholder="John" 
                                    className="auth-input" 
                                    {...field} 
                                  />
                                </FormControl>
                              </div>
                              <FormMessage className="auth-error-message" />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="auth-input-group">
                        <FormLabel className="auth-label">Last Name</FormLabel>
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <User className="auth-input-icon" size={16} />
                                <FormControl>
                                  <Input 
                                    placeholder="Doe" 
                                    className="auth-input" 
                                    {...field} 
                                  />
                                </FormControl>
                              </div>
                              <FormMessage className="auth-error-message" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="auth-input-group">
                      <FormLabel className="auth-label">Email</FormLabel>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Mail className="auth-input-icon" size={16} />
                              <FormControl>
                                <Input 
                                  placeholder="your.email@example.com" 
                                  className="auth-input" 
                                  {...field} 
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="auth-error-message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="auth-input-group">
                      <FormLabel className="auth-label">Password</FormLabel>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Lock className="auth-input-icon" size={16} />
                              <FormControl>
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  className="auth-input" 
                                  {...field} 
                                />
                              </FormControl>
                              <button 
                                type="button"
                                className="auth-input-toggle"
                                onClick={() => togglePasswordVisibility('password')}
                              >
                                {showPassword ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </div>
                            <FormMessage className="auth-error-message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="auth-input-group">
                      <FormLabel className="auth-label">Confirm Password</FormLabel>
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Lock className="auth-input-icon" size={16} />
                              <FormControl>
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  className="auth-input" 
                                  {...field} 
                                />
                              </FormControl>
                              <button 
                                type="button"
                                className="auth-input-toggle"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </div>
                            <FormMessage className="auth-error-message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-1 mb-2">
                      <h3 className="text-sm font-medium text-center">Fragrance Preferences</h3>
                      <p className="text-xs text-gray-500 text-center">
                        Help us recommend the perfect scents for you
                      </p>
                    </div>
                    
                    <div className="auth-input-group">
                      <FormLabel className="auth-label">Fragrance Family</FormLabel>
                      <FormField
                        control={form.control}
                        name="fragrancePreference"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="p-2.5 text-base">
                                  <SelectValue placeholder="Select your preference" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="floral">Floral</SelectItem>
                                <SelectItem value="oriental">Oriental</SelectItem>
                                <SelectItem value="woody">Woody</SelectItem>
                                <SelectItem value="fresh">Fresh</SelectItem>
                                <SelectItem value="gourmand">Gourmand</SelectItem>
                                <SelectItem value="citrus">Citrus</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="auth-error-message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="auth-input-group">
                      <FormLabel className="auth-label">Fragrance Style</FormLabel>
                      <FormField
                        control={form.control}
                        name="fragranceStyle"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="p-2.5 text-base">
                                  <SelectValue placeholder="Select your style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="bold">Bold & Distinctive</SelectItem>
                                <SelectItem value="subtle">Subtle & Elegant</SelectItem>
                                <SelectItem value="experimental">Experimental</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="auth-error-message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="auth-input-group">
                      <FormLabel className="auth-label">Fragrance Strength</FormLabel>
                      <FormField
                        control={form.control}
                        name="fragranceStrength"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="p-2.5 text-base">
                                  <SelectValue placeholder="Select preferred strength" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="strong">Strong</SelectItem>
                                <SelectItem value="intense">Intense</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="auth-error-message" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="auth-input-group mt-6">
                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                I accept the <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
                              </FormLabel>
                              <FormMessage className="auth-error-message" />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-5 font-light bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex justify-center pt-2 pb-6">
                <Button 
                  variant="link" 
                  className="text-sm text-gray-600 hover:text-purple-600"
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          // Success state
          <Card className="w-full shadow-sm border-gray-100 p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              
              <CardTitle className="text-xl font-serif mb-2">Registration Successful!</CardTitle>
              <CardDescription className="mb-6">
                Welcome to Scent of Luxury. Your account has been created successfully.
              </CardDescription>
              
              <p className="text-sm text-gray-600 mb-6">
                You will be redirected to the login page in a moment...
              </p>
              
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={() => navigate('/login')}
              >
                Go to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
