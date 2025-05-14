
import React from 'react';

interface UserQueryProps {
  displayedQuery: string;
}

export const UserQuery: React.FC<UserQueryProps> = ({ displayedQuery }) => {
  if (!displayedQuery) return null;

  return (
    <div className="flex items-start justify-end mb-4">
      <div className="bg-primary/10 p-3 rounded-lg shadow-sm max-w-[85%] text-gray-800 mr-2">
        <div className="text-sm font-normal whitespace-pre-line break-words">
          {displayedQuery}
        </div>
      </div>
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
        You
      </div>
    </div>
  );
};
