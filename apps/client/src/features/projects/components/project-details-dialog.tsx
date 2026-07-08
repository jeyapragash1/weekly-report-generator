import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, FolderKanban, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/features/projects/project-types';
import { formatProjectDate, formatProjectStatus } from '@/features/projects/project-utils';

type ProjectDetailsDialogProps = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
};

export function ProjectDetailsDialog({ onClose, open, project }: ProjectDetailsDialogProps) {
  return (
    <AnimatePresence>
      {open && project ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.button
            aria-label="Close project details"
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
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-normal">{project.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatProjectStatus(project.status)}
                  </p>
                </div>
              </div>
              <Button
                aria-label="Close project details"
                onClick={onClose}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-5 py-5">
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {project.description || 'No description provided.'}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Created
                  </div>
                  <p className="mt-2 text-sm font-medium">{formatProjectDate(project.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Updated
                  </div>
                  <p className="mt-2 text-sm font-medium">{formatProjectDate(project.updatedAt)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t border-border pt-4">
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
