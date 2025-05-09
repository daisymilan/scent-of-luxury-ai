import { Link } from 'react-router-dom';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { UserRole } from '@/contexts/AuthContext';

interface NavigationLinkProps {
  to: string;
  label: string;
  requiredRoles?: UserRole[];
  userRole?: UserRole;
}

const NavigationLink = ({ to, label, requiredRoles, userRole }: NavigationLinkProps) => {
  // If no required roles are specified or the user's role is in the required roles, render the link
  if (!requiredRoles || !userRole || requiredRoles.some(role => userRole === role)) {
    return (
      <Link to={to} className={navigationMenuTriggerStyle()}>
        {label}
      </Link>
    );
  }
  
  // Otherwise, return null (don't render anything)
  return null;
};

export default NavigationLink;
