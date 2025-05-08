
import { RecoveryStats } from './utils';

interface RecoveryStatsProps {
  stats: RecoveryStats;
}

const RecoveryStatsComponent = ({ stats }: RecoveryStatsProps) => {
  return (
    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-4">
      <h3 className="font-medium text-sm mb-1">Recovery Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <div>
          <p className="text-xs text-gray-500">Abandoned</p>
          <p className="text-lg font-semibold">{stats.abandoned}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Recovered</p>
          <p className="text-lg font-semibold">{stats.recovered}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Recovery Rate</p>
          <p className="text-lg font-semibold">{stats.recoveryRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Value Recovered</p>
          <p className="text-lg font-semibold">${stats.valueRecovered}</p>
        </div>
      </div>
    </div>
  );
};

export default RecoveryStatsComponent;
