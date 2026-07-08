import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyProjectsProps = {
  hasFilters: boolean;
  onCreate: () => void;
};

export function EmptyProjects({ hasFilters, onCreate }: EmptyProjectsProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <FolderPlus className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-normal">
        {hasFilters ? 'No projects match your filters' : 'No projects have been created yet.'}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {hasFilters
          ? 'Adjust the search, status filter, or sorting option to find a project.'
          : 'Create your first project so team members can start attaching weekly reports to it.'}
      </p>
      {!hasFilters ? (
        <Button className="mt-6" onClick={onCreate} type="button">
          Create project
        </Button>
      ) : null}
    </div>
  );
}
