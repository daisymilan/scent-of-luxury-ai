
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MobileNavigationLink from './MobileNavigationLink';
import { UserRole } from '@/contexts/AuthContext';
import React from 'react';

interface MobileNavigationProps {
  userRole?: UserRole;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MobileNavigation = ({ userRole, searchQuery, setSearchQuery }: MobileNavigationProps) => {
  return (
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
          <MobileNavigationLink to="/" label="DASHBOARD" />
          
          <MobileNavigationLink 
            to="/b2b" 
            label="B2B" 
            requiredRoles={['CEO', 'CCO', 'Commercial Director']} 
            userRole={userRole} 
          />
          
          <MobileNavigationLink 
            to="/marketing" 
            label="Marketing" 
            requiredRoles={['CEO', 'CCO', 'Marketing Manager']} 
            userRole={userRole} 
          />
          
          <MobileNavigationLink 
            to="/social-media-ads" 
            label="Social Ads" 
            requiredRoles={['CEO', 'CCO', 'Marketing Manager', 'Social Media Manager']} 
            userRole={userRole} 
          />
          
          <MobileNavigationLink 
            to="/reorder-reminder" 
            label="Reorder Reminders" 
            requiredRoles={['CEO', 'CCO', 'Marketing Manager', 'Customer Support']} 
            userRole={userRole} 
          />
          
          <MobileNavigationLink 
            to="/inventory" 
            label="Inventory" 
            requiredRoles={['CEO', 'CCO', 'Commercial Director', 'Regional Manager']} 
            userRole={userRole} 
          />
          
          <MobileNavigationLink 
            to="/reports" 
            label="Reports" 
            requiredRoles={['CEO', 'CCO']} 
            userRole={userRole} 
          />
          
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
  );
};

export default MobileNavigation;
