
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
  const { currentUser, userRole, logout, isAuthenticated } = useAuth();
  
  console.log("DashboardHeader - currentUser:", currentUser);
  console.log("DashboardHeader - userRole from context:", userRole);
  console.log("DashboardHeader - isAuthenticated:", isAuthenticated);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Extract username from metadata or use email
  const username = currentUser?.user_metadata?.name || 
                   (currentUser?.user_metadata?.first_name && 
                    `${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name || ''}`) || 
                   'User';
  
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <Logo />
          
          {/* Desktop Navigation */}
          <DesktopNavigation userRole={userRole} />
          
          {/* Mobile Navigation */}
          <MobileNavigation 
            userRole={userRole} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          
          {/* User Profile Dropdown */}
          <UserMenu 
            username={username.trim()} 
            email={currentUser?.email || ''} 
            onLogout={logout} 
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
