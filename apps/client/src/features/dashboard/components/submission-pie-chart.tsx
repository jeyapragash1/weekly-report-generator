import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartEmptyState } from '@/features/dashboard/components/chart-empty-state';
import type { DashboardSubmissionStatusItem } from '@/features/dashboard/dashboard-types';

type SubmissionPieChartProps = {
  items: DashboardSubmissionStatusItem[];
};

const COLORS = {
  Submitted: 'hsl(var(--accent))',
  Draft: 'hsl(38 92% 50%)',
  Late: 'hsl(var(--destructive))',
};

export function SubmissionPieChart({ items }: SubmissionPieChartProps) {
  const submitted = items.reduce((total, item) => total + item.submittedReports, 0);
  const draft = items.reduce((total, item) => total + item.pendingReports, 0);
  const late = items.reduce((total, item) => total + (item.lateReports ?? 0), 0);
  const data = [
    { name: 'Submitted', value: submitted },
    { name: 'Draft', value: draft },
    ...(late > 0 ? [{ name: 'Late', value: late }] : []),
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return <ChartEmptyState message="No submission status data is available yet." />;
  }

  return (
    <div className="h-64" role="img" aria-label="Submission status pie chart">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Tooltip />
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            innerRadius={52}
            nameKey="name"
            outerRadius={86}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell fill={COLORS[entry.name as keyof typeof COLORS]} key={entry.name} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        {data.map((item) => (
          <span className="inline-flex items-center gap-2" key={item.name}>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
            />
            {item.name}: {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
