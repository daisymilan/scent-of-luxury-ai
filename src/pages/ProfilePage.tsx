
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/contexts/AuthContext"; // Import UserRole type

const ProfilePage = () => {
  const { currentUser, userRole, isCEO } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "" as UserRole | null, // Cast to UserRole or null
    department: "",
    first_name: "",
    last_name: "",
    avatar_url: "",
    voice_enrolled: false,
    voice_authenticated: false,
    last_voice_auth: null as Date | null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userInfo });

  // Enhanced logging to help debug auth issues
  useEffect(() => {
    console.log("ProfilePage - Current user:", currentUser);
    console.log("ProfilePage - User role from context:", userRole);
    console.log("ProfilePage - User metadata:", currentUser?.user_metadata);
    console.log("ProfilePage - Is CEO function:", typeof isCEO === 'function' ? isCEO() : 'not available');
  }, [currentUser, userRole, isCEO]);

  // Fetch the complete user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        console.log("Fetching user data for ID:", currentUser.id);
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user data");
          return;
        }

        console.log("User data from Supabase:", data);
        
        // CRITICAL FIX: Priority order for role determination
        // 1. Auth context userRole (most reliable source)
        // 2. User metadata role (set during registration/login)
        // 3. Database role (for persistence)
        // 4. Default to null if all others are null/undefined
        
        // First check if we have the role in the auth context
        let effectiveRole = userRole;
        
        // If not in auth context, try user metadata
        if (!effectiveRole && currentUser?.user_metadata?.role) {
          // Ensure it's a valid UserRole value
          const metadataRole = currentUser.user_metadata.role as UserRole;
          effectiveRole = metadataRole;
          console.log("Using role from user metadata:", effectiveRole);
        }
        
        // If still not found, try database
        if (!effectiveRole && data?.role) {
          // Cast to UserRole if it's a valid role string
          effectiveRole = data.role as UserRole;
          console.log("Using role from database:", effectiveRole);
        }
        
        console.log("Determined effective role:", effectiveRole);
        
        // If the database role doesn't match our effective role, update it
        if (data && data.role !== effectiveRole && effectiveRole) {
          console.log("Updating database role to match:", effectiveRole);
          try {
            await supabase
              .from('users')
              .update({ role: effectiveRole })
              .eq('id', currentUser.id);
          } catch (err) {
            console.error("Failed to sync role to database:", err);
          }
        }
        
        // Update the user info with data from Supabase and our determined role
        setUserInfo({
          name: `${data?.first_name || ''} ${data?.last_name || ''}`.trim() || "Guest User",
          email: data?.email || currentUser?.email || "",
          role: effectiveRole,
          department: getDepartmentForRole(effectiveRole),
          first_name: data?.first_name || "",
          last_name: data?.last_name || "",
          avatar_url: data?.avatar_url || "",
          voice_enrolled: data?.voice_enrolled || false,
          voice_authenticated: data?.voice_authenticated || false,
          last_voice_auth: data?.last_voice_auth ? new Date(data.last_voice_auth) : null
        });
        
        setFormData({
          name: `${data?.first_name || ''} ${data?.last_name || ''}`.trim() || "Guest User",
          email: data?.email || currentUser?.email || "",
          role: effectiveRole,
          department: getDepartmentForRole(effectiveRole),
          first_name: data?.first_name || "",
          last_name: data?.last_name || "",
          avatar_url: data?.avatar_url || "",
          voice_enrolled: data?.voice_enrolled || false,
          voice_authenticated: data?.voice_authenticated || false,
          last_voice_auth: data?.last_voice_auth ? new Date(data.last_voice_auth) : null
        });
      } catch (err) {
        console.error("Exception fetching user data:", err);
        toast.error("An error occurred while loading your profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, userRole]);

  function getDepartmentForRole(role?: UserRole | null): string {
    if (!role) return '';
    
    switch(role) {
      case 'CEO':
      case 'CCO':
        return 'Executive';
      case 'Commercial Director':
        return 'Commercial';
      case 'Regional Manager':
        return 'Operations';
      case 'Marketing Manager':
        return 'Marketing';
      default:
        return '';
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    // Extract first and last name from the full name
    const nameParts = formData.name.split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";
    
    try {
      // Update the user info in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          email: formData.email,
          first_name: firstName,
          last_name: lastName,
          role: formData.role,
          avatar_url: formData.avatar_url
        })
        .eq('id', currentUser?.id);
        
      if (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update profile");
        return;
      }
      
      // Update the local state
      setUserInfo({
        ...formData,
        first_name: firstName,
        last_name: lastName
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Exception updating user:", err);
      toast.error("An error occurred while updating your profile");
    }
  };

  const handleCancel = () => {
    setFormData({ ...userInfo });
    setIsEditing(false);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!userInfo.name) return "?";
    return userInfo.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-4 w-20 mb-4" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile picture and quick info */}
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userInfo.avatar_url || ""} />
                  <AvatarFallback className="text-2xl bg-primary text-white">{getInitials()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                <p className="text-gray-500">{userInfo.role || "Guest"}</p>
                <p className="text-sm text-gray-400 mb-4">{userInfo.department}</p>
                
                <div className="w-full mt-4">
                  {!isEditing && (
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Profile details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={isEditing ? formData.name : userInfo.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={isEditing ? formData.email : userInfo.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role"
                      name="role"
                      value={isEditing ? formData.role || "" : userInfo.role || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department"
                      name="department"
                      value={isEditing ? formData.department : userInfo.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input 
                      id="avatar_url"
                      name="avatar_url"
                      value={isEditing ? formData.avatar_url : userInfo.avatar_url}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  {/* Voice Authentication Status */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-medium mb-2">Voice Authentication</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1 block">Voice Enrolled</Label>
                        <p className={`text-sm font-medium ${userInfo.voice_enrolled ? 'text-green-600' : 'text-gray-500'}`}>
                          {userInfo.voice_enrolled ? 'Yes' : 'No'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="mb-1 block">Voice Authenticated</Label>
                        <p className={`text-sm font-medium ${userInfo.voice_authenticated ? 'text-green-600' : 'text-gray-500'}`}>
                          {userInfo.voice_authenticated ? 'Yes' : 'No'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="mb-1 block">Last Voice Authentication</Label>
                        <p className="text-sm text-gray-600">
                          {formatDate(userInfo.last_voice_auth)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="pt-4 flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;

