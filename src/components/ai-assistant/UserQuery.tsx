
import { User } from 'lucide-react';

interface UserQueryProps {
  displayedQuery: string;
}

export const UserQuery = ({ displayedQuery }: UserQueryProps) => {
  if (!displayedQuery) return null;
  
  return (
    <div className="flex items-start justify-end mb-4">
      <div className="bg-blue-100 p-3 rounded-lg max-w-[85%] text-gray-800">
        <p className="text-sm">{displayedQuery}</p>
      </div>
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ml-2 text-white">
        <User size={16} />
      </div>
    </div>
  );
};
