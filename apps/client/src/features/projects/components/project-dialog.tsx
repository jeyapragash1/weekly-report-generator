import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectForm } from '@/features/projects/components/project-form';
import type { ProjectFormValues } from '@/features/projects/project-schemas';
import type { Project } from '@/features/projects/project-types';

type ProjectDialogProps = {
  mode: 'create' | 'edit';
  open: boolean;
  project?: Project;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void;
};

export function ProjectDialog({
  isSubmitting,
  errorMessage,
  mode,
  onClose,
  onSubmit,
  open,
  project,
}: ProjectDialogProps) {
  const formId = `${mode}-project-form`;
  const closeButtonId = `${mode}-project-dialog-close`;

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
            className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-2xl shadow-foreground/10"
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            role="dialog"
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold tracking-normal">
                  {mode === 'create' ? 'Create project' : 'Edit project'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mode === 'create'
                    ? 'Add a new project for weekly reporting.'
                    : 'Update project details and status.'}
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
              <ProjectForm
                disabled={isSubmitting}
                formId={formId}
                onSubmit={onSubmit}
                project={project}
                showStatus={mode === 'edit'}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button disabled={isSubmitting} onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button className="gap-2" disabled={isSubmitting} form={formId} type="submit">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {mode === 'create' ? 'Create project' : 'Save changes'}
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
