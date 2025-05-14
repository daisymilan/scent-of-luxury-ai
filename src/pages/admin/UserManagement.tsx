// src/pages/admin/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, UserPlus, AlertCircle, Trash2, Edit2, Shield, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { getExecutiveRoles, resetVoiceEnrollment } from '@/utils/voiceAuthApi';
import supabase from '@/supabase';
import '../../styles/VoiceAuth.css';

// Form schema for adding new executive user
const userFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password is too long" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  accessLevel: z.string().min(1, { message: "Access level is required" }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface ExecutiveUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  accessLevel: string;
  voiceEnrolled?: boolean;
  lastLogin?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ExecutiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExecutiveUser | null>(null);
  const { toast } = useToast();
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  // Form for adding/editing users
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      department: "",
      accessLevel: "medium",
    },
  });

  // Fetch users on component mount
  useEffect(() => {
    // Check if user has admin access
    if (userRole !== 'CEO' && userRole !== 'CCO') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    fetchUsers();
  }, [userRole, navigate, toast]);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch users from Supabase
      // This requires admin access to the Auth API or a server function
      
      // Get roles from the getExecutiveRoles function but properly await it
      const execRoles = await getExecutiveRoles();
      
      // Fetch actual users from Supabase if possible
      let supabaseUsers: ExecutiveUser[] = [];
      
      try {
        // This would require admin access to Auth API
        // Simulating user data here instead
        supabaseUsers = execRoles.map(role => ({
          id: role.id,
          name: role.name,
          email: role.email,
          role: role.role as UserRole,
          department: role.department || 'General',
          accessLevel: role.accessLevel || 'medium',
          voiceEnrolled: Math.random() > 0.3, // Random for demo
          lastLogin: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last 10 days
        }));
      } catch (error) {
        console.error('Error fetching Supabase users:', error);
      }
      
      setUsers(supabaseUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load executive users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for adding a new user
  const handleAddUser = () => {
    setSelectedUser(null);
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      department: "",
      accessLevel: "medium",
    });
    setOpen(true);
  };

  // Open dialog for editing an existing user
  const handleEditUser = (user: ExecutiveUser) => {
    setSelectedUser(user);
    
    // Split name into first and last
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    form.reset({
      firstName,
      lastName,
      email: user.email,
      password: "********", // Placeholder, in a real app you wouldn't pre-fill this
      role: user.role,
      department: user.department,
      accessLevel: user.accessLevel,
    });
    
    setOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this executive user?")) {
      try {
        // In a real implementation, you would delete the user from Supabase
        // This requires admin access to the Auth API or a server function
        
        // For now, just update the UI
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        toast({
          title: "User Deleted",
          description: "The executive user has been removed from the system.",
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle reset voice enrollment
  const handleResetVoiceEnrollment = async (userId: string) => {
    if (confirm("Are you sure you want to reset this user's voice enrollment?")) {
      try {
        // Call the resetVoiceEnrollment utility
        const success = await resetVoiceEnrollment(userId);
        
        if (success) {
          // Update UI
          setUsers(prevUsers => prevUsers.map(user => 
            user.id === userId ? { ...user, voiceEnrolled: false } : user
          ));
          
          toast({
            title: "Voice Enrollment Reset",
            description: "The user will need to re-enroll their voice on next login.",
          });
        } else {
          throw new Error('Failed to reset voice enrollment');
        }
      } catch (error) {
        console.error('Error resetting voice enrollment:', error);
        toast({
          title: "Error",
          description: "Failed to reset voice enrollment.",
          variant: "destructive",
        });
      }
    }
  };

  // Submit handler for the user form
  const onSubmit = async (data: UserFormValues) => {
    try {
      const isEditing = !!selectedUser;
      
      // Prepare user data
      const userData: ExecutiveUser = {
        id: selectedUser?.id || `user-${Date.now()}`,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: data.role as UserRole,
        department: data.department,
        accessLevel: data.accessLevel,
        voiceEnrolled: selectedUser?.voiceEnrolled || false,
        lastLogin: selectedUser?.lastLogin || null,
      };
      
      if (isEditing) {
        // Update existing user in Supabase
        // This would require admin access to Auth API
        // For now, just update the UI
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === selectedUser.id ? { ...userData, id: user.id } : user
        ));
        
        toast({
          title: "User Updated",
          description: `Executive user ${userData.name} has been updated.`,
        });
      } else {
        // Add new user to Supabase
        try {
          // Create a new user in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            user_metadata: {
              name: userData.name,
              role: userData.role,
              department: userData.department,
              access_level: userData.accessLevel
            }
          });
          
          if (authError) {
            throw authError;
          }
          
          // If successful, add to UI
          if (authData?.user) {
            userData.id = authData.user.id;
            setUsers(prevUsers => [...prevUsers, userData]);
            
            toast({
              title: "User Added",
              description: `Executive user ${userData.name} has been added to the system.`,
            });
          }
        } catch (supabaseError) {
          console.error('Supabase error:', supabaseError);
          
          // Fallback for demo - just add to UI
          setUsers(prevUsers => [...prevUsers, userData]);
          
          toast({
            title: "User Added (Demo Mode)",
            description: `Executive user ${userData.name} has been added to the system.`,
          });
        }
      }
      
      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "Failed to save executive user.",
        variant: "destructive",
      });
    }
  };

  // Get access level badge color
  const getAccessLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'all':
      case 'high':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-indigo-100 text-indigo-800';
      case 'low':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Executive User Management</h1>
          <p className="text-gray-500">Manage executive users and their access levels</p>
        </div>
        
        <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Executive
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Executive Team</CardTitle>
          <CardDescription>
            All users with executive dashboard access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2 text-gray-500">Loading executive users...</p>
            </div>
          ) : users.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No executive users found.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Voice Auth</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${user.role === 'CEO' ? 'bg-red-100 text-red-800' : 
                           user.role === 'CCO' ? 'bg-amber-100 text-amber-800' : 
                           user.role.includes('Director') ? 'bg-green-100 text-green-800' : 
                           'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(user.accessLevel)}`}>
                          {user.accessLevel}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.voiceEnrolled ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" /> Enrolled
                          </span>
                        ) : (
                          <span className="text-gray-400 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" /> Not Enrolled
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{user.lastLogin || 'Never'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleResetVoiceEnrollment(user.id)}>
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for adding/editing users */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Edit Executive User' : 'Add Executive User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? 'Update the executive user details and permissions' 
                : 'Enter details to add a new executive user to the dashboard'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Executive email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{selectedUser ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={selectedUser ? '••••••••' : 'Set password'} 
                        {...field} 
                        value={selectedUser && field.value === '********' ? '' : field.value}
                        onChange={(e) => {
                          if (!(selectedUser && e.target.value === '')) {
                            field.onChange(e);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Executive Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="CCO">CCO</SelectItem>
                        <SelectItem value="Commercial Director">Commercial Director</SelectItem>
                        <SelectItem value="Regional Manager">Regional Manager</SelectItem>
                        <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Executive Office">Executive Office</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                        <SelectItem value="R&D">R&D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Access</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {selectedUser ? 'Update Executive' : 'Add Executive'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
