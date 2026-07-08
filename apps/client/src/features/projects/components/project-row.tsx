import { motion } from 'framer-motion';
import { Archive, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/features/projects/project-types';
import { formatProjectDate, formatProjectStatus } from '@/features/projects/project-utils';
import { cn } from '@/lib/utils';

type ProjectRowProps = {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onArchive: (project: Project) => void;
};

export function ProjectRow({ onArchive, onEdit, onView, project }: ProjectRowProps) {
  const isArchived = project.status === 'ARCHIVED';

  return (
    <motion.tr
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border last:border-0"
      initial={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.16 }}
    >
      <td className="px-4 py-4 align-top">
        <div className="min-w-0">
          <p className="font-medium text-foreground">{project.name}</p>
          <p className="mt-1 line-clamp-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {project.description || 'No description.'}
          </p>
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <span
          className={cn(
            'inline-flex rounded-md px-2 py-1 text-xs font-medium',
            project.status === 'ACTIVE' &&
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            project.status === 'ON_HOLD' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            project.status === 'ARCHIVED' && 'bg-secondary text-muted-foreground',
          )}
        >
          {formatProjectStatus(project.status)}
        </span>
      </td>
      <td className="px-4 py-4 align-top text-sm text-muted-foreground">
        {formatProjectDate(project.createdAt)}
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex justify-end gap-2">
          <Button
            aria-label={`View ${project.name}`}
            onClick={() => onView(project)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            aria-label={`Edit ${project.name}`}
            onClick={() => onEdit(project)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            aria-label={`Archive ${project.name}`}
            disabled={isArchived}
            onClick={() => onArchive(project)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
}
