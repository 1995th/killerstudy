import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/components/theme-provider';

interface StudyProgressChartProps {
  data: Array<{
    day: string;
    hours: number;
  }>;
}

export function StudyProgressChart({ data }: StudyProgressChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded-lg shadow-lg ${isDark ? 'bg-background text-foreground' : 'bg-white text-black'}`}>
          <p className="font-medium">{label}</p>
          <p>{`${payload[0].value} hours`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? 'hsl(var(--muted-foreground))' : undefined}
          />
          <XAxis 
            dataKey="day"
            padding={{ left: 0, right: 0 }}
            tick={{ fill: isDark ? 'hsl(var(--foreground))' : undefined }}
          />
          <YAxis
            padding={{ top: 20, bottom: 0 }}
            tick={{ fill: isDark ? 'hsl(var(--foreground))' : undefined }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}