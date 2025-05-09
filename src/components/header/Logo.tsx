
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="mr-3">
        <div className="font-medium text-lg">MiN</div>
        <div className="text-xs uppercase tracking-wider -mt-1">NEW YORK</div>
      </div>
    </Link>
  );
};

export default Logo;
