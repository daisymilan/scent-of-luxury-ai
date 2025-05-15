
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, AlertCircle, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Form validation schema
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

export type FormValues = z.infer<typeof formSchema>;

interface SignupFormProps {
  signupType: 'standard' | 'executive';
}

export const SignupForm = ({ signupType }: SignupFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Executive roles
  const executiveRoles = ['CEO', 'CCO', 'Commercial Director', 'Regional Manager'];
  // Standard roles
  const standardRoles = ['Marketing Manager', 'Social Media Manager', 'Customer Support', 'User'];

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
    <>
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
                    I accept the <a href="/terms" className="text-gray-300 underline hover:text-white">terms and conditions</a>
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
    </>
  );
};
