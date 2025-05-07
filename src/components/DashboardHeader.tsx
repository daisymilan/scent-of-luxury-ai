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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30 backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-10">
            <img 
              src="https://min.com/cdn/shop/files/MiN_NEW_YORK_LOGO_35f89307-9201-4d71-a283-d2318c9fa162_235x.png?v=1678383084" 
              alt="MiN NEW YORK" 
              className="h-8 mr-2"
            />
          </Link>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle() + " font-light uppercase text-xs tracking-wider"}>
                    Dashboard
                  </Link>
                </NavigationMenuItem>
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director') && (
                  <NavigationMenuItem>
                    <Link to="/b2b" className={navigationMenuTriggerStyle() + " font-light uppercase text-xs tracking-wider"}>
                      B2B
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager') && (
                  <NavigationMenuItem>
                    <Link to="/marketing" className={navigationMenuTriggerStyle() + " font-light uppercase text-xs tracking-wider"}>
                      Marketing
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Social Media Manager') && (
                  <NavigationMenuItem>
                    <Link to="/social-media-ads" className={navigationMenuTriggerStyle() + " font-light uppercase text-xs tracking-wider"}>
                      Social Ads
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Customer Support') && (
                  <NavigationMenuItem>
                    <Link to="/reorder-reminder" className={navigationMenuTriggerStyle() + " font-light uppercase text-xs tracking-wider"}>
                      Reorder Reminders
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
                  <NavigationMenuItem>
                    <Link to="/inventory" className={navigationMenuTriggerStyle() + " font-light uppercase text-xs tracking-wider"}>
                      Inventory
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO') && (
                  <NavigationMenuItem>
                    <Link to="/reports" className={navigationMenuTriggerStyle() + " font-light uppercase text-xs tracking-wider"}>
                      Reports
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Menu Button - Using Sheet for elegant slide-in */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
              >
                <Menu size={24} className="text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex justify-center">
                  <img 
                    src="https://min.com/cdn/shop/files/MiN_NEW_YORK_LOGO_35f89307-9201-4d71-a283-d2318c9fa162_235x.png?v=1678383084" 
                    alt="MiN NEW YORK" 
                    className="h-6"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
                <Link to="/" className="px-3 py-2 rounded-md text-xs uppercase tracking-wider font-light text-gray-700 hover:text-primary hover:bg-gray-50">
                  Dashboard
                </Link>
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director') && (
                  <Link to="/b2b" className="px-3 py-2 rounded-md text-xs uppercase tracking-wider font-light text-gray-700 hover:text-primary hover:bg-gray-50">
                    B2B
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager') && (
                  <Link to="/marketing" className="px-3 py-2 rounded-md text-xs uppercase tracking-wider font-light text-gray-700 hover:text-primary hover:bg-gray-50">
                    Marketing
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Social Media Manager') && (
                  <Link to="/social-media-ads" className="px-3 py-2 rounded-md text-xs uppercase tracking-wider font-light text-gray-700 hover:text-primary hover:bg-gray-50">
                    Social Ads
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Customer Support') && (
                  <Link to="/reorder-reminder" className="px-3 py-2 rounded-md text-xs uppercase tracking-wider font-light text-gray-700 hover:text-primary hover:bg-gray-50">
                    Reorder Reminders
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
                  <Link to="/inventory" className="px-3 py-2 rounded-md text-xs uppercase tracking-wider font-light text-gray-700 hover:text-primary hover:bg-gray-50">
                    Inventory
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO') && (
                  <Link to="/reports" className="px-3 py-2 rounded-md text-xs uppercase tracking-wider font-light text-gray-700 hover:text-primary hover:bg-gray-50">
                    Reports
                  </Link>
                )}
                
                <div className="pt-4 pb-1">
                  <div className="relative mt-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10 w-full border-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 border-gray-200 focus:border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-50">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50">
                <User size={20} className="text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-gray-200 shadow-md">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  <div className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded mt-1 inline-block">
                    {user?.role || 'Guest'}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer hover:text-primary">
                  <User className="mr-2" size={16} />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/preferences">
                <DropdownMenuItem className="cursor-pointer hover:text-primary">
                  <Settings className="mr-2" size={16} />
                  <span>Preferences</span>
                </DropdownMenuItem>
              </Link>
              {user?.role === 'CEO' && (
                <Link to="/settings/system">
                  <DropdownMenuItem className="cursor-pointer hover:text-primary">
                    <Settings className="mr-2" size={16} />
                    <span>System Settings</span>
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:text-primary" onClick={logout}>
                <LogOut className="mr-2" size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
