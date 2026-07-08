import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WeeklyReport } from '@/features/reports/report-types';
import { formatReportWeek } from '@/features/reports/report-utils';

type SubmitDialogProps = {
  open: boolean;
  report: WeeklyReport | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function SubmitDialog({
  isSubmitting,
  onClose,
  onConfirm,
  open,
  report,
}: SubmitDialogProps) {
  return (
    <AnimatePresence>
      {open && report ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.button
            aria-label="Close confirmation"
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
            className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-2xl shadow-foreground/10"
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            role="dialog"
            transition={{ duration: 0.18 }}
          >
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-normal">Submit weekly report</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Submit the report for{' '}
                  <span className="font-medium text-foreground">{report.project.name}</span>,{' '}
                  {formatReportWeek(report)}? Submitted reports cannot be edited.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button disabled={isSubmitting} onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button className="gap-2" disabled={isSubmitting} onClick={onConfirm} type="button">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Submit
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
