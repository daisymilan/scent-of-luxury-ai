
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, Search, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold mr-8 text-primary">
            MiN NEW YORK
          </Link>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </Link>
                </NavigationMenuItem>
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director') && (
                  <NavigationMenuItem>
                    <Link to="/b2b" className={navigationMenuTriggerStyle()}>
                      B2B
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager') && (
                  <NavigationMenuItem>
                    <Link to="/marketing" className={navigationMenuTriggerStyle()}>
                      Marketing
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Social Media Manager') && (
                  <NavigationMenuItem>
                    <Link to="/social-media-ads" className={navigationMenuTriggerStyle()}>
                      Social Ads
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Customer Support') && (
                  <NavigationMenuItem>
                    <Link to="/reorder-reminder" className={navigationMenuTriggerStyle()}>
                      Reorder Reminders
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
                  <NavigationMenuItem>
                    <Link to="/inventory" className={navigationMenuTriggerStyle()}>
                      Inventory
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO') && (
                  <NavigationMenuItem>
                    <Link to="/reports" className={navigationMenuTriggerStyle()}>
                      Reports
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mt-1 inline-block">
                    {user?.role || 'Guest'}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2" size={16} />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/preferences">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2" size={16} />
                  <span>Preferences</span>
                </DropdownMenuItem>
              </Link>
              {user?.role === 'CEO' && (
                <Link to="/settings/system">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2" size={16} />
                    <span>System Settings</span>
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                <LogOut className="mr-2" size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
              Dashboard
            </Link>
            
            {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director') && (
              <Link to="/b2b" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                B2B
              </Link>
            )}
            
            {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager') && (
              <Link to="/marketing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                Marketing
              </Link>
            )}
            
            {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Social Media Manager') && (
              <Link to="/social-media-ads" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                Social Ads
              </Link>
            )}
            
            {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Customer Support') && (
              <Link to="/reorder-reminder" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                Reorder Reminders
              </Link>
            )}
            
            {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
              <Link to="/inventory" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                Inventory
              </Link>
            )}
            
            {(user?.role === 'CEO' || user?.role === 'CCO') && (
              <Link to="/reports" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                Reports
              </Link>
            )}
            
            <div className="pt-4 pb-1">
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
