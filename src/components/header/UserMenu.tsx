
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  username: string;
  email: string;
  onLogout: () => void;
}

const UserMenu = ({ username, email, onLogout }: UserMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log("Logout button clicked in UserMenu");
      await onLogout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };
  
  const isCEO = userRole === 'CEO';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50">
          <User size={20} className="text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-gray-200 shadow-md rounded-none">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium text-gray-900">{username || 'Guest'}</p>
            <p className="text-xs text-gray-500">{email || ''}</p>
            {isCEO && (
              <div className="flex items-center mt-1 text-xs font-medium text-blue-600">
                <ShieldCheck size={12} className="mr-1" />
                CEO Account
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer hover:text-black rounded-none">
            Profile
          </DropdownMenuItem>
        </Link>
        {isCEO && (
          <Link to="/settings/system">
            <DropdownMenuItem className="cursor-pointer hover:text-black rounded-none">
              System Settings
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer hover:text-black rounded-none" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
