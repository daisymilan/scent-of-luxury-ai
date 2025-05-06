
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LineChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
}

const LineChart = ({ 
  data, 
  color = "#6E59A5", 
  height = 200, 
  showGrid = false,
  showAxis = true
}: LineChartProps) => {
  const formattedData = data.map((item, index) => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />}
        {showAxis && <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#718096' }} 
        />}
        {showAxis && <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#718096' }} 
          width={30}
        />}
        <Tooltip 
          contentStyle={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            border: 'none', 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }} 
          labelStyle={{ color: '#4a5568', fontWeight: 600 }}
          itemStyle={{ color: color }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 5, strokeWidth: 0, fill: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
