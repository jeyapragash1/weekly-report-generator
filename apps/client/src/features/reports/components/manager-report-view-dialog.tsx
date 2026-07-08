import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, FolderKanban, UserCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ManagerReportItem } from '@/features/reports/manager-reports-types';

type ManagerReportViewDialogProps = {
  open: boolean;
  report: ManagerReportItem | null;
  onClose: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function ManagerReportViewDialog({ onClose, open, report }: ManagerReportViewDialogProps) {
  return (
    <AnimatePresence>
      {open && report ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.button
            aria-label="Close manager report details"
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-2xl shadow-foreground/10"
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            role="dialog"
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold tracking-normal">Team Report</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review submission details for this report.
                </p>
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

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <UserCircle className="h-4 w-4 text-primary" />
                  Team member
                </div>
                <p className="mt-2 text-sm">{report.user.name}</p>
                <p className="text-sm text-muted-foreground">{report.user.email}</p>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FolderKanban className="h-4 w-4 text-primary" />
                  Project
                </div>
                <p className="mt-2 text-sm">{report.project.name}</p>
                <p className="text-sm text-muted-foreground">{report.project.status}</p>
              </div>

              <div className="rounded-lg border border-border bg-background p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Week range
                </div>
                <p className="mt-2 text-sm">
                  {formatDate(report.week.startDate)} - {formatDate(report.week.endDate)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submitted: {report.submittedAt ? formatDate(report.submittedAt) : 'Not submitted'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-border pt-4">
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
