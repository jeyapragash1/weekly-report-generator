import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartEmptyState } from '@/features/dashboard/components/chart-empty-state';
import type { DashboardTaskTrendItem } from '@/features/dashboard/dashboard-types';

type TrendLineChartProps = {
  items: DashboardTaskTrendItem[];
};

function formatWeek(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function TrendLineChart({ items }: TrendLineChartProps) {
  const data = items.map((item) => ({
    week: formatWeek(item.weekStartDate),
    reports: item.completedReports,
  }));

  if (data.length === 0) {
    return <ChartEmptyState message="No weekly trend data is available yet." />;
  }

  return (
    <div className="h-64" role="img" aria-label="Weekly submitted reports trend line chart">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={false}
            width={32}
          />
          <Tooltip />
          <Line
            dataKey="reports"
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
