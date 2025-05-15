
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
  
  // Simplified role check: Always show navigation for CEO, regardless of required roles
  const isCEO = userRole === 'CEO';
  const hasRequiredRole = !requiredRoles || !userRole || isCEO || requiredRoles.includes(userRole);
  
  console.log(`NavigationLink "${label}" - userRole: ${userRole}, requiredRoles: ${JSON.stringify(requiredRoles)}, isCEO: ${isCEO}, hasAccess: ${hasRequiredRole}`);
  
  if (hasRequiredRole) {
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
