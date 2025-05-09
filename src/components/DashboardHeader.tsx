
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';
import SearchBar from './header/SearchBar';
import UserMenu from './header/UserMenu';

// Add interface for the component props
interface DashboardHeaderProps {
  title?: string;
  heading?: string;
}

const DashboardHeader = ({ title, heading }: DashboardHeaderProps = {}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <Logo />
          
          {/* Desktop Navigation */}
          <DesktopNavigation userRole={user?.role} />
          
          {/* Mobile Navigation */}
          <MobileNavigation 
            userRole={user?.role} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          
          {/* User Profile Dropdown */}
          <UserMenu 
            username={user?.name || 'Guest'} 
            email={user?.email || ''} 
            onLogout={logout} 
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
