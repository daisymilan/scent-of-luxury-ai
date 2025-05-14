
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus, Search, X, CheckCircle, AlertCircle } from "lucide-react";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // Fetch users from Supabase when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "There was an error loading the user list. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchLower)) ||
      (user.role && user.role.toLowerCase().includes(searchLower))
    );
  });

  // Function to invite a new user
  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsInviting(true);
    try {
      // In a real implementation, this would send an invitation via Supabase Auth
      // For now, we'll just create a user record
      const { error } = await supabase.from('users').insert({
        email: inviteEmail,
        role: 'User',
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "User invited",
        description: `Invitation sent to ${inviteEmail}`,
        variant: "default"
      });
      
      setInviteEmail('');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error inviting user",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="container p-4 max-w-6xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 dark:bg-gray-800">
          <CardTitle className="text-2xl font-semibold">User Management</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* User Invitation Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Invite New User</h3>
            <div className="flex gap-2">
              <Input 
                placeholder="Email address" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="max-w-md"
              />
              <Button 
                onClick={handleInviteUser} 
                disabled={isInviting || !inviteEmail.trim()}
              >
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* User List Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">User List</h3>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Voice Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.first_name || 'N/A'}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role || 'User'}</Badge>
                          </TableCell>
                          <TableCell>
                            {user.voice_enrolled ? (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span>Enrolled</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                                <span>Not Enrolled</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.created_at 
                              ? new Date(user.created_at).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {searchQuery 
                            ? "No users match your search"
                            : "No users found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
