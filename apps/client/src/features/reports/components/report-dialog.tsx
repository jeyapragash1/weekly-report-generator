import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/features/projects/project-types';
import { ReportForm } from '@/features/reports/components/report-form';
import type { ReportFormValues } from '@/features/reports/report-schemas';
import type { WeeklyReport } from '@/features/reports/report-types';

type ReportDialogProps = {
  mode: 'create' | 'edit';
  open: boolean;
  report?: WeeklyReport;
  projects: Project[];
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (values: ReportFormValues) => void;
};

export function ReportDialog({
  errorMessage,
  isSubmitting,
  mode,
  onClose,
  onSubmit,
  open,
  projects,
  report,
}: ReportDialogProps) {
  const formId = `${mode}-report-form`;
  const closeButtonId = `${mode}-report-dialog-close`;
  const isSubmitted = report?.status === 'SUBMITTED';

  useEffect(() => {
    if (!open) {
      return;
    }

    document.getElementById(closeButtonId)?.focus();
  }, [closeButtonId, open]);

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.button
            aria-label="Close dialog"
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
                <h2 className="text-lg font-semibold tracking-normal">
                  {mode === 'create' ? 'Create weekly report' : 'Edit weekly report'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isSubmitted
                    ? 'Submitted reports are read-only and cannot be edited.'
                    : 'Save as draft before final submission.'}
                </p>
              </div>
              <Button
                aria-label="Close dialog"
                id={closeButtonId}
                onClick={onClose}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="py-5">
              {errorMessage ? (
                <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}
              <ReportForm
                disabled={isSubmitting || isSubmitted}
                formId={formId}
                onSubmit={onSubmit}
                projects={projects}
                report={report}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button disabled={isSubmitting} onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              {!isSubmitted ? (
                <Button className="gap-2" disabled={isSubmitting} form={formId} type="submit">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {mode === 'create' ? 'Save draft' : 'Save changes'}
                </Button>
              ) : null}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
