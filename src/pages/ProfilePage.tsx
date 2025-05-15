
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/contexts/AuthContext"; 
import { Shield, ShieldCheck, User } from "lucide-react";
import { ProfileImage } from "@/components/ui/profile-image";
import { getCustomerByEmail } from "@/utils/woocommerce/customerApi";
import { WooCustomer } from "@/utils/woocommerce/types";

const ProfilePage = () => {
  const { currentUser, userRole, isCEO } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Use both methods to check for CEO role (direct comparison and function call)
  const userIsCEO = userRole === 'CEO' || (typeof isCEO === 'function' && isCEO());
  
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "" as UserRole | null,
    department: "",
    first_name: "",
    last_name: "",
    avatar_url: "",
    voice_enrolled: false,
    voice_authenticated: false,
    last_voice_auth: null as Date | null,
    woocommerce_id: null as number | null,
  });

  const [wooCustomer, setWooCustomer] = useState<WooCustomer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userInfo });

  // Enhanced logging to help debug auth issues
  useEffect(() => {
    console.log("ProfilePage - Current user:", currentUser);
    console.log("ProfilePage - User role from context:", userRole);
    console.log("ProfilePage - User metadata:", currentUser?.user_metadata);
    console.log("ProfilePage - Is CEO function:", typeof isCEO === 'function' ? isCEO() : 'not available');
    console.log("ProfilePage - Combined CEO check:", userIsCEO);
  }, [currentUser, userRole, isCEO, userIsCEO]);

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
        // 1. If user is CEO by email, always set as CEO regardless of stored role
        const ceoEmails = ["ceo@example.com", "ceo@minyork.com", "ceotest@min.com", "admin@minny.com"];
        const userEmail = currentUser.email || '';
        const isCeoByEmail = ceoEmails.includes(userEmail.toLowerCase());
        
        // Determine effective role
        let effectiveRole: UserRole | null = null;
        
        if (isCeoByEmail) {
          effectiveRole = 'CEO';
          console.log("Setting role to CEO based on email match:", userEmail);
        } else if (userRole) {
          effectiveRole = userRole;
          console.log("Using role from auth context:", effectiveRole);
        } else if (currentUser?.user_metadata?.role) {
          effectiveRole = currentUser.user_metadata.role as UserRole;
          console.log("Using role from user metadata:", effectiveRole);
        } else if (data?.role) {
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
            
            // Also update user metadata for consistency
            const { error: metadataError } = await supabase.auth.updateUser({
              data: { role: effectiveRole }
            });
            
            if (metadataError) {
              console.error("Failed to update user metadata:", metadataError);
            }
          } catch (err) {
            console.error("Failed to sync role to database:", err);
          }
        }
        
        // Construct name from first and last name
        const fullName = `${data?.first_name || ''} ${data?.last_name || ''}`.trim() || 
                         currentUser?.user_metadata?.name || 
                         "Guest User";
        
        // Update the user info with data from Supabase and our determined role
        setUserInfo({
          name: fullName,
          email: data?.email || currentUser?.email || "",
          role: effectiveRole,
          department: getDepartmentForRole(effectiveRole),
          first_name: data?.first_name || "",
          last_name: data?.last_name || "",
          avatar_url: data?.avatar_url || "",
          voice_enrolled: data?.voice_enrolled || false,
          voice_authenticated: data?.voice_authenticated || false,
          last_voice_auth: data?.last_voice_auth ? new Date(data.last_voice_auth) : null,
          woocommerce_id: data?.woocommerce_id || null,
        });
        
        setFormData({
          name: fullName,
          email: data?.email || currentUser?.email || "",
          role: effectiveRole,
          department: getDepartmentForRole(effectiveRole),
          first_name: data?.first_name || "",
          last_name: data?.last_name || "",
          avatar_url: data?.avatar_url || "",
          voice_enrolled: data?.voice_enrolled || false,
          voice_authenticated: data?.voice_authenticated || false,
          last_voice_auth: data?.last_voice_auth ? new Date(data.last_voice_auth) : null,
          woocommerce_id: data?.woocommerce_id || null,
        });

        // Try to fetch WooCommerce customer data if we have an email
        if (userEmail) {
          try {
            const customerData = await getCustomerByEmail(userEmail);
            
            if (customerData) {
              console.log("Found WooCommerce customer data:", customerData);
              setWooCustomer(customerData);
              
              // Update woocommerce_id in our local state if it's not already set
              if (!data?.woocommerce_id) {
                try {
                  await supabase
                    .from('users')
                    .update({ woocommerce_id: customerData.id })
                    .eq('id', currentUser.id);
                    
                  console.log("Updated woocommerce_id in database:", customerData.id);
                } catch (err) {
                  console.error("Failed to update woocommerce_id:", err);
                }
              }
            } else {
              console.log("No WooCommerce customer found for email:", userEmail);
            }
          } catch (err) {
            console.error("Error fetching WooCommerce customer:", err);
          }
        }
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
      
      // Update user metadata as well for consistency
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { 
          role: formData.role,
          first_name: firstName,
          last_name: lastName
        }
      });
      
      if (metadataError) {
        console.error("Error updating user metadata:", metadataError);
        // Continue anyway as this is not critical
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
        
        {userIsCEO && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center space-x-3">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-medium text-blue-700">CEO Account</h3>
              <p className="text-sm text-blue-600">You have full access to all system features and settings.</p>
            </div>
          </div>
        )}
        
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
                <ProfileImage 
                  src={userInfo.avatar_url} 
                  name={userInfo.name} 
                  size="xl" 
                  className="mb-4" 
                />
                <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                <div className="flex items-center">
                  <p className="text-gray-500">{userInfo.role || "Guest"}</p>
                  {userInfo.role === 'CEO' && (
                    <Shield className="h-4 w-4 ml-1 text-blue-500" />
                  )}
                </div>
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
                      disabled={!isEditing || userIsCEO} // Disable role editing for CEO
                      className={userIsCEO ? "bg-blue-50" : ""}
                    />
                    {userIsCEO && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center">
                        <ShieldCheck className="inline h-3 w-3 mr-1" />
                        CEO role cannot be changed
                      </p>
                    )}
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
                  
                  {/* WooCommerce Integration Information */}
                  {wooCustomer && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <User className="h-5 w-5 text-blue-500 mr-2" />
                        WooCommerce Customer
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1 block">Customer ID</Label>
                          <p className="text-sm text-gray-600">#{wooCustomer.id}</p>
                        </div>
                        
                        <div>
                          <Label className="mb-1 block">Orders</Label>
                          <p className="text-sm text-gray-600">{wooCustomer.orders_count || 0} orders</p>
                        </div>
                        
                        <div>
                          <Label className="mb-1 block">Total Spent</Label>
                          <p className="text-sm text-gray-600">${wooCustomer.total_spent || '0.00'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
