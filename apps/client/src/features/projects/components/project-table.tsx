import type { Project } from '@/features/projects/project-types';
import { ProjectRow } from '@/features/projects/components/project-row';

type ProjectTableProps = {
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onArchive: (project: Project) => void;
};

export function ProjectTable({ onArchive, onEdit, onView, projects }: ProjectTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                onArchive={onArchive}
                onEdit={onEdit}
                onView={onView}
                project={project}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
