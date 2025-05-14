
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
                  
  // If no required roles are specified or the user's role is in the required roles, render the link
  if (!requiredRoles || !userRole || requiredRoles.includes(userRole as UserRole)) {
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
