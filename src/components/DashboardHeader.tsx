
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
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold mr-8">
            MiN NEW YORK
          </Link>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              </li>
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director') && (
                <li>
                  <Link to="/b2b" className="text-gray-600 hover:text-gray-900">
                    B2B
                  </Link>
                </li>
              )}
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager') && (
                <li>
                  <Link to="/marketing" className="text-gray-600 hover:text-gray-900">
                    Marketing
                  </Link>
                </li>
              )}
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Social Media Manager') && (
                <li>
                  <Link to="/social-media-ads" className="text-gray-600 hover:text-gray-900">
                    Social Ads
                  </Link>
                </li>
              )}
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Marketing Manager' || user?.role === 'Customer Support') && (
                <li>
                  <Link to="/reorder-reminder" className="text-gray-600 hover:text-gray-900">
                    Reorder Reminders
                  </Link>
                </li>
              )}
              {(user?.role === 'CEO' || user?.role === 'CCO' || user?.role === 'Commercial Director' || user?.role === 'Regional Manager') && (
                <li>
                  <Link to="/inventory" className="text-gray-600 hover:text-gray-900">
                    Inventory
                  </Link>
                </li>
              )}
              {(user?.role === 'CEO' || user?.role === 'CCO') && (
                <li>
                  <Link to="/reports" className="text-gray-600 hover:text-gray-900">
                    Reports
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
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
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
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
    </header>
  );
};

export default DashboardHeader;
