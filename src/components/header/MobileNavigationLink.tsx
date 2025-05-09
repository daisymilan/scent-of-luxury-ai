import { Link } from 'react-router-dom';
import { UserRole } from '@/contexts/AuthContext';

interface MobileNavigationLinkProps {
  to: string;
  label: string;
  requiredRoles?: UserRole[];
  userRole?: UserRole;
}

const MobileNavigationLink = ({ to, label, requiredRoles, userRole }: MobileNavigationLinkProps) => {
  // If no required roles are specified or the user's role is in the required roles, render the link
  if (!requiredRoles || !userRole || requiredRoles.some(role => userRole === role)) {
    return (
      <Link to={to} className="px-3 py-2 rounded-none text-sm uppercase font-medium hover:bg-gray-50">
        {label}
      </Link>
    );
  }
  
  // Otherwise, return null (don't render anything)
  return null;
};

export default MobileNavigationLink;
