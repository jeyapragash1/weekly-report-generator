import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/features/projects/project-types';

type ArchiveDialogProps = {
  open: boolean;
  project: Project | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ArchiveDialog({
  isSubmitting,
  onClose,
  onConfirm,
  open,
  project,
}: ArchiveDialogProps) {
  return (
    <AnimatePresence>
      {open && project ? (
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-normal">Archive project</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Archive <span className="font-medium text-foreground">{project.name}</span>? This
                  keeps historical data but prevents new reports from being created for the project.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button disabled={isSubmitting} onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button className="gap-2" disabled={isSubmitting} onClick={onConfirm} type="button">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Archive
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
