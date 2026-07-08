import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartEmptyState } from '@/features/dashboard/components/chart-empty-state';
import type { DashboardWorkloadItem } from '@/features/dashboard/dashboard-types';

type ProjectBarChartProps = {
  items: DashboardWorkloadItem[];
};

export function ProjectBarChart({ items }: ProjectBarChartProps) {
  const data = items
    .filter((item) => item.totalReports > 0)
    .map((item) => ({
      name: item.project.name,
      reports: item.totalReports,
    }));

  if (data.length === 0) {
    return <ChartEmptyState message="No project workload data is available yet." />;
  }

  return (
    <div className="h-64" role="img" aria-label="Project workload bar chart">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
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
          <Bar dataKey="reports" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
