import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock3, FolderKanban, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WeeklyReport } from '@/features/reports/report-types';
import {
  formatReportDate,
  formatReportStatus,
  formatReportWeek,
} from '@/features/reports/report-utils';

type ReportDetailsDialogProps = {
  open: boolean;
  report: WeeklyReport | null;
  onClose: () => void;
};

export function ReportDetailsDialog({ onClose, open, report }: ReportDetailsDialogProps) {
  return (
    <AnimatePresence>
      {open && report ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.button
            aria-label="Close report details"
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            aria-modal="true"
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-card p-6 text-card-foreground shadow-2xl shadow-foreground/10"
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            role="dialog"
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold tracking-normal">{report.project.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{formatReportWeek(report)}</p>
              </div>
              <Button
                aria-label="Close report details"
                onClick={onClose}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 py-5 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FolderKanban className="h-4 w-4" />
                  Status
                </div>
                <p className="mt-2 text-sm font-medium">{formatReportStatus(report.status)}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  Hours
                </div>
                <p className="mt-2 text-sm font-medium">{report.hoursWorked ?? 'Not provided'}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Created
                </div>
                <p className="mt-2 text-sm font-medium">{formatReportDate(report.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                ['Tasks Completed', report.tasksCompleted],
                ['Tasks Planned', report.tasksPlanned],
                ['Blockers', report.blockers],
                ['Notes', report.notes || 'No notes added.'],
              ].map(([label, value]) => (
                <section className="rounded-lg border border-border bg-background p-4" key={label}>
                  <h3 className="text-sm font-medium">{label}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {value}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-5 flex justify-end border-t border-border pt-4">
              <Button onClick={onClose} type="button">
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
