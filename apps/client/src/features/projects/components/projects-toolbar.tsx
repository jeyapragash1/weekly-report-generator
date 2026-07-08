import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ProjectSortOption, ProjectStatusFilter } from '@/features/projects/project-types';

type ProjectsToolbarProps = {
  search: string;
  status: ProjectStatusFilter;
  sort: ProjectSortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectStatusFilter) => void;
  onSortChange: (value: ProjectSortOption) => void;
  onCreate: () => void;
};

export function ProjectsToolbar({
  onCreate,
  onSearchChange,
  onSortChange,
  onStatusChange,
  search,
  sort,
  status,
}: ProjectsToolbarProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search projects by name"
            className="pl-9"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects"
            value={search}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-[160px_180px_auto]">
          <select
            aria-label="Filter projects by status"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) => onStatusChange(event.target.value as ProjectStatusFilter)}
            value={status}
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select
            aria-label="Sort projects"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) => onSortChange(event.target.value as ProjectSortOption)}
            value={sort}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <Button className="gap-2" onClick={onCreate} type="button">
            <Plus className="h-4 w-4" />
            Create project
          </Button>
        </div>
      </div>
    </div>
  );
}
