
import React from 'react';
import { Button } from '@/components/ui/button';

interface TableActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSelectAll}
        disabled={selectedCount === totalCount}
      >
        Select All
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClearSelection}
        disabled={selectedCount === 0}
      >
        Clear Selection
      </Button>
    </div>
  );
};

export default TableActions;
