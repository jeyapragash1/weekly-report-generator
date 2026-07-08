import { Eye, FileClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ManagerReportItem } from '@/features/reports/manager-reports-types';
import { cn } from '@/lib/utils';

type ManagerReportsTableProps = {
  reports: ManagerReportItem[];
  onView: (report: ManagerReportItem) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function ManagerReportsTable({ onView, reports }: ManagerReportsTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-secondary/40 text-muted-foreground">
            <tr>
              {['Team member', 'Project', 'Week', 'Status', 'Submitted', 'Actions'].map(
                (header) => (
                  <th className="px-4 py-3 font-medium" key={header} scope="col">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report) => (
              <tr className="transition-colors hover:bg-secondary/30" key={report.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{report.user.name}</p>
                  <p className="text-xs text-muted-foreground">{report.user.email}</p>
                </td>
                <td className="px-4 py-3">{report.project.name}</td>
                <td className="px-4 py-3">
                  {formatDate(report.week.startDate)} - {formatDate(report.week.endDate)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'rounded-md px-2 py-1 text-xs font-medium',
                      report.status === 'SUBMITTED'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
                    )}
                  >
                    {report.status === 'SUBMITTED' ? 'Submitted' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {report.submittedAt ? formatDate(report.submittedAt) : 'Not submitted'}
                </td>
                <td className="px-4 py-3">
                  <Button
                    className="gap-2"
                    onClick={() => onView(report)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <FileClock className="h-4 w-4" />
        Use View to review submission details for each report.
      </div>
    </section>
  );
}
