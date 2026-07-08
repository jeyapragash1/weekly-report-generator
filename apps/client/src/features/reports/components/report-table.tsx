import { ReportRow } from '@/features/reports/components/report-row';
import type { WeeklyReport } from '@/features/reports/report-types';

type ReportTableProps = {
  reports: WeeklyReport[];
  onView: (report: WeeklyReport) => void;
  onEdit: (report: WeeklyReport) => void;
  onSubmit: (report: WeeklyReport) => void;
  onDelete: (report: WeeklyReport) => void;
};

export function ReportTable({ onDelete, onEdit, onSubmit, onView, reports }: ReportTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Week</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Hours Worked</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <ReportRow
                key={report.id}
                onDelete={onDelete}
                onEdit={onEdit}
                onSubmit={onSubmit}
                onView={onView}
                report={report}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
