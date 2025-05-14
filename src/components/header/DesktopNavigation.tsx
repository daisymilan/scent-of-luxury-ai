
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';
import NavigationLink from './NavigationLink';
import { UserRole } from '@/contexts/AuthContext';

interface DesktopNavigationProps {
  userRole?: UserRole;
}

const DesktopNavigation = ({ userRole }: DesktopNavigationProps) => {
  // Debug log to help us see what role is being passed
  console.log("DesktopNavigation received userRole:", userRole);
  
  return (
    <div className="hidden md:block ml-6">
      <NavigationMenu>
        <NavigationMenuList className="space-x-6">
          <NavigationMenuItem>
            <NavigationLink to="/" label="DASHBOARD" />
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationLink 
              to="/b2b" 
              label="B2B" 
              requiredRoles={['CEO', 'CCO', 'Commercial Director']} 
              userRole={userRole} 
            />
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationLink 
              to="/marketing" 
              label="MARKETING" 
              requiredRoles={['CEO', 'CCO', 'Marketing Manager']} 
              userRole={userRole} 
            />
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationLink 
              to="/social-media-ads" 
              label="SOCIAL ADS" 
              requiredRoles={['CEO', 'CCO', 'Marketing Manager', 'Social Media Manager']} 
              userRole={userRole} 
            />
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationLink 
              to="/reorder-reminder" 
              label="REORDER REMINDERS" 
              requiredRoles={['CEO', 'CCO', 'Marketing Manager', 'Customer Support']} 
              userRole={userRole} 
            />
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationLink 
              to="/inventory" 
              label="INVENTORY" 
              requiredRoles={['CEO', 'CCO', 'Commercial Director', 'Regional Manager']} 
              userRole={userRole} 
            />
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationLink 
              to="/reports" 
              label="REPORTS" 
              requiredRoles={['CEO', 'CCO']} 
              userRole={userRole} 
            />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNavigation;
