
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

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
  return (
    <div className="flex justify-between items-center border-b pb-3">
      <div>
        <h3 className="font-medium">Welcome, {user.name}</h3>
        <p className="text-sm text-muted-foreground">Role: {user.role}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onLogout}>
        <LogOut className="h-4 w-4 mr-1" /> Logout
      </Button>
    </div>
  );
};
