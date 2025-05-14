
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  role: string;
}

interface UserWelcomeProps {
  user: User;
  onLogout: () => void;
}

export const UserWelcome: React.FC<UserWelcomeProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log("Logout button clicked in UserWelcome");
      await onLogout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  return (
    <div className="flex justify-between items-center border-b pb-3">
      <div>
        <h3 className="font-medium">Welcome, {user.name}</h3>
        <p className="text-sm text-muted-foreground">Role: {user.role}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-1" /> Logout
      </Button>
    </div>
  );
};
