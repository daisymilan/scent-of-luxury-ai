// Import statements
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, AlertCircle, User, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form validation schema enhanced with first and last name
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be at most 100 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type FormValues = z.infer<typeof formSchema>;

const SignupPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupType, setSignupType] = useState<'standard' | 'executive'>('standard');
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Executive roles
  const executiveRoles = ['CEO', 'CCO', 'Commercial Director', 'Regional Manager'];
  // Standard roles
  const standardRoles = ['Marketing Manager', 'Social Media Manager', 'Customer Support', 'User'];
  
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: signupType === 'executive' ? "CEO" : "User",
      termsAccepted: false
    },
  });

  // Update default role when signup type changes
  useEffect(() => {
    form.setValue('role', signupType === 'executive' ? "CEO" : "User");
  }, [signupType, form]);

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Attempting signup with:", data.email, "role:", data.role);
      console.log("Name:", data.firstName, data.lastName);
      
      // Include role and name in the metadata when signing up
      const success = await signup(
        data.email, 
        data.password, 
        data.role as UserRole,
        {
          first_name: data.firstName,
          last_name: data.lastName
        }
      );
      
      console.log("Signup result:", success);
      
      if (success) {
        // Success handling
        toast({
          title: "Signup successful",
          description: "Your account has been created. You'll be redirected to login.",
        });
        
        // Short timeout to show the success message before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError("Failed to create account. Please try again.");
        setIsSubmitting(false); // Reset submission state on failure
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false); // Reset submission state on error
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your details to register
            </CardDescription>
            
            <Tabs 
              defaultValue="standard" 
              className="w-full" 
              onValueChange={(value) => setSignupType(value as 'standard' | 'executive')}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="standard" className="data-[state=active]:bg-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  Standard
                </TabsTrigger>
                <TabsTrigger value="executive" className="data-[state=active]:bg-gray-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Executive
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel className="text-xs uppercase tracking-wider font-light text-gray-300">First Name</FormLabel>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="John" 
                              className="py-6 text-base bg-gray-800 border-gray-700 text-gray-100" 
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel className="text-xs uppercase tracking-wider font-light text-gray-300">Last Name</FormLabel>
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Doe" 
                              className="py-6 text-base bg-gray-800 border-gray-700 text-gray-100" 
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
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
                              autoComplete="email"
                              disabled={isSubmitting}
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
                  <FormLabel className="text-xs uppercase tracking-wider font-light text-gray-300">Password</FormLabel>
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
                              autoComplete="new-password"
                              disabled={isSubmitting}
                              {...field} 
                            />
                          </FormControl>
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-xs uppercase tracking-wider font-light text-gray-300">Role</FormLabel>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={16} />
                          <FormControl>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className="pl-10 py-6 text-base bg-gray-800 border-gray-700 text-gray-100">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                                {signupType === 'executive' ? (
                                  executiveRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))
                                ) : (
                                  standardRoles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-800">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-300">
                          I accept the <Link to="/terms" className="text-gray-300 underline hover:text-white">terms and conditions</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full py-6 font-light bg-white text-black hover:bg-gray-200" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Register"}
                </Button>
              </form>
            </Form>
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
