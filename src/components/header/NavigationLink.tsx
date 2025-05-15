
import { Link, useLocation } from 'react-router-dom';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  to: string;
  label: string;
  requiredRoles?: UserRole[];
  userRole?: UserRole;
}

const NavigationLink = ({ to, label, requiredRoles, userRole }: NavigationLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  console.log(`NavigationLink "${label}" - userRole: ${userRole}, requiredRoles: ${JSON.stringify(requiredRoles)}, hasAccess: ${!requiredRoles || !userRole || userRole === 'CEO' || requiredRoles.includes(userRole)}`);
  
  // If no required roles are specified or user is CEO or the user's role is in the required roles, render the link
  if (!requiredRoles || !userRole || userRole === 'CEO' || requiredRoles.includes(userRole)) {
    return (
      <Link 
        to={to} 
        className={cn(
          navigationMenuTriggerStyle(),
          isActive && "font-medium bg-gray-50"
        )}
      >
        {label}
      </Link>
    );
  }
  
  // Don't render anything if the user doesn't have permission
  return null;
};

export default NavigationLink;
