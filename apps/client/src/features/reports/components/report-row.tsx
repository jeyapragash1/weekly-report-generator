import { motion } from 'framer-motion';
import { Eye, Pencil, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WeeklyReport } from '@/features/reports/report-types';
import {
  formatReportDate,
  formatReportStatus,
  formatReportWeek,
} from '@/features/reports/report-utils';
import { cn } from '@/lib/utils';

type ReportRowProps = {
  report: WeeklyReport;
  onView: (report: WeeklyReport) => void;
  onEdit: (report: WeeklyReport) => void;
  onSubmit: (report: WeeklyReport) => void;
  onDelete: (report: WeeklyReport) => void;
};

export function ReportRow({ onDelete, onEdit, onSubmit, onView, report }: ReportRowProps) {
  const isDraft = report.status === 'DRAFT';

  return (
    <motion.tr
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border last:border-0"
      initial={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.16 }}
    >
      <td className="px-4 py-4 align-top">
        <p className="font-medium text-foreground">{formatReportWeek(report)}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <p className="font-medium text-foreground">{report.project.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{report.project.status}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <span
          className={cn(
            'inline-flex rounded-md px-2 py-1 text-xs font-medium',
            report.status === 'SUBMITTED'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
          )}
        >
          {formatReportStatus(report.status)}
        </span>
      </td>
      <td className="px-4 py-4 align-top text-sm text-muted-foreground">
        {report.hoursWorked ?? 'Not tracked'}
      </td>
      <td className="px-4 py-4 align-top text-sm text-muted-foreground">
        {formatReportDate(report.createdAt)}
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex justify-end gap-2">
          <Button
            aria-label="View report"
            onClick={() => onView(report)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Edit report"
            disabled={!isDraft}
            onClick={() => onEdit(report)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Submit report"
            disabled={!isDraft}
            onClick={() => onSubmit(report)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Delete report"
            disabled={!isDraft}
            onClick={() => onDelete(report)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
}
