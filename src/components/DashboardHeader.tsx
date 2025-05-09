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
import { Menu, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

// Add interface for the component props
interface DashboardHeaderProps {
  title?: string;
  heading?: string;
}

const DashboardHeader = ({ title, heading }: DashboardHeaderProps = {}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <div className="mr-3">
              <div className="font-medium text-lg">MiN</div>
              <div className="text-xs uppercase tracking-wider -mt-1">NEW YORK</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block ml-6">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                <NavigationMenuItem>
                  <Link to="/" className={navigationMenuTriggerStyle()}>
                    DASHBOARD
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
                      MARKETING
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Social Media Manager') && (
                  <NavigationMenuItem>
                    <Link to="/social-media-ads" className={navigationMenuTriggerStyle()}>
                      SOCIAL ADS
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Customer Support') && (
                  <NavigationMenuItem>
                    <Link to="/reorder-reminder" className={navigationMenuTriggerStyle()}>
                      REORDER REMINDERS
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
                  <NavigationMenuItem>
                    <Link to="/inventory" className={navigationMenuTriggerStyle()}>
                      INVENTORY
                    </Link>
                  </NavigationMenuItem>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO') && (
                  <NavigationMenuItem>
                    <Link to="/reports" className={navigationMenuTriggerStyle()}>
                      REPORTS
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Menu Button */}
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
                <SheetTitle className="flex flex-col items-center gap-2">
                  <div className="text-lg">MiN</div>
                  <div className="uppercase text-xs tracking-wider">NEW YORK</div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
                <Link to="/" className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
                  DASHBOARD
                </Link>
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director') && (
                  <Link to="/b2b" className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
                    B2B
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager') && (
                  <Link to="/marketing" className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
                    Marketing
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Social Media Manager') && (
                  <Link to="/social-media-ads" className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
                    Social Ads
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Customer Support') && (
                  <Link to="/reorder-reminder" className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
                    Reorder Reminders
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
                  <Link to="/inventory" className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
                    Inventory
                  </Link>
                )}
                
                {(user?.role === 'CEO' || user?.role === 'CCO') && (
                  <Link to="/reports" className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
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
          {/* Search Bar with updated styling */}
          <div className="relative w-64 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 border-gray-200 rounded-full h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* User Profile Dropdown - simplified */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50">
                <User size={20} className="text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-gray-200 shadow-md rounded-none">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer hover:text-black rounded-none">
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:text-black rounded-none" onClick={logout}>
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
