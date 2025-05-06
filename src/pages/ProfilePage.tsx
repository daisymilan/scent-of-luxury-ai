
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  
  const [userInfo, setUserInfo] = useState({
    name: user?.name || "Guest",
    email: user?.email || "",
    role: user?.role || "Guest",
    department: getDepartmentForRole(user?.role)
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userInfo });

  function getDepartmentForRole(role?: string): string {
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

  const handleSave = () => {
    setUserInfo({ ...formData });
    setIsEditing(false);
    toast.success("Profile updated successfully");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile picture and quick info */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="text-2xl bg-primary text-white">{getInitials()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{userInfo.name}</h2>
              <p className="text-gray-500">{userInfo.role}</p>
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
                    value={isEditing ? formData.role : userInfo.role}
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
      </main>
    </div>
  );
};

export default ProfilePage;
