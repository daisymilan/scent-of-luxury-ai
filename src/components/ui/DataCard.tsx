
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

const DataCard = ({ title, value, change, icon, className }: DataCardProps) => {
  return (
    <div className={cn("luxury-card animate-fade-in", className)}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {change !== undefined && (
          <span className={`ml-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default DataCard;
