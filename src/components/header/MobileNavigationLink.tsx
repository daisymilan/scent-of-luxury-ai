
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MobileNavigationLinkProps {
  to: string;
  label: string;
  requiredRoles?: UserRole[];
  userRole?: UserRole;
}

const MobileNavigationLink = ({ to, label, requiredRoles, userRole }: MobileNavigationLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));
  
  // Simplified role check: Always show navigation for CEO, regardless of required roles
  const isCEO = userRole === 'CEO';
  const hasRequiredRole = !requiredRoles || !userRole || isCEO || requiredRoles.includes(userRole);
  
  console.log(`MobileNavigationLink "${label}" - userRole: ${userRole}, requiredRoles: ${JSON.stringify(requiredRoles)}, isCEO: ${isCEO}, hasAccess: ${hasRequiredRole}`);
                  
  if (hasRequiredRole) {
    return (
      <Link 
        to={to} 
        className={cn(
          "px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50",
          isActive && "bg-gray-50 font-medium"
        )}
      >
        {label}
      </Link>
    );
  }
  
  // Don't render anything if the user doesn't have permission
  return null;
};

export default MobileNavigationLink;
