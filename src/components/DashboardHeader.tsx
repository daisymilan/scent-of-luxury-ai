
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, Settings, User, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const DashboardHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle profile actions
  const handleProfileAction = (action: string) => {
    switch (action) {
      case 'profile':
        toast.info('Navigating to profile page...');
        // Navigate to profile page when implemented
        navigate('/profile');
        break;
      case 'switch-role':
        toast.info('Role switching functionality coming soon');
        // Role switching functionality to be implemented
        break;
      case 'preferences':
        toast.info('Preferences page coming soon');
        // Navigate to preferences page when implemented
        navigate('/preferences');
        break;
      case 'logout':
        toast.success('Successfully logged out');
        // Logout functionality
        // For now just simulate logout with a toast message
        setTimeout(() => {
          navigate('/');
        }, 1000);
        break;
      default:
        break;
    }
  };

  // Handle settings actions
  const handleSettingsAction = (action: string) => {
    switch (action) {
      case 'profile':
        toast.info('Navigating to profile page...');
        navigate('/profile');
        break;
      case 'system-settings':
        toast.info('System settings page coming soon');
        navigate('/settings/system');
        break;
      case 'preferences':
        toast.info('Preferences page coming soon');
        navigate('/preferences');
        break;
      case 'logout':
        toast.success('Successfully logged out');
        setTimeout(() => {
          navigate('/');
        }, 1000);
        break;
      default:
        break;
    }
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-semibold">MiN</Link>
            </div>
            
            {/* Main Navigation - Desktop */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                to="/" 
                className={`font-medium px-1 ${isActive('/') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-900'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/b2b" 
                className={`font-medium px-1 ${isActive('/b2b') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-900'}`}
              >
                B2B
              </Link>
              <Link 
                to="/marketing" 
                className={`font-medium px-1 ${isActive('/marketing') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-900'}`}
              >
                Marketing
              </Link>
              <Link 
                to="/inventory" 
                className={`font-medium px-1 ${isActive('/inventory') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-900'}`}
              >
                Inventory
              </Link>
              <Link 
                to="/reports" 
                className={`font-medium px-1 ${isActive('/reports') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-900'}`}
              >
                Reports
              </Link>
            </nav>
          </div>
          
          {/* Right-side controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input type="text" placeholder="Search..." className="pl-10 w-64" />
            </div>
            
            {/* Notification bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">New B2B Lead</span>
                    <span className="text-sm text-gray-500">Prestige Retail Group has shown interest</span>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Inventory Alert</span>
                    <span className="text-sm text-gray-500">Amber Woods is running low (12 units left)</span>
                    <span className="text-xs text-gray-400">5 hours ago</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSettingsAction('profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsAction('system-settings')}>System Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsAction('preferences')}>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsAction('logout')}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <span className="hidden lg:inline-block">Chad Williams</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Chad Williams</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-gray-500 font-normal">CEO</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileAction('profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileAction('switch-role')}>Switch Role</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileAction('preferences')}>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileAction('logout')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/b2b" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/b2b') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              B2B
            </Link>
            <Link 
              to="/marketing" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/marketing') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Marketing
            </Link>
            <Link 
              to="/inventory" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/inventory') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Inventory
            </Link>
            <Link 
              to="/reports" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/reports') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Reports
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <div className="relative mx-3 mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input type="text" placeholder="Search..." className="pl-10 w-full" />
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => handleProfileAction('profile')}
              >
                Your Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => handleSettingsAction('system-settings')}
              >
                Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => toast.info('Notifications panel coming soon')}
              >
                Notifications
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => handleProfileAction('logout')}
              >
                <LogOut className="mr-2 h-4 w-4 inline" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
