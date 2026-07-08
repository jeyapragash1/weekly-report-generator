import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Project } from '@/features/projects/project-types';
import type { ReportSortOption, ReportStatusFilter } from '@/features/reports/report-types';

type ReportsToolbarProps = {
  search: string;
  status: ReportStatusFilter;
  projectId: string;
  week: string;
  sort: ReportSortOption;
  projects: Project[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ReportStatusFilter) => void;
  onProjectChange: (value: string) => void;
  onWeekChange: (value: string) => void;
  onSortChange: (value: ReportSortOption) => void;
  onCreate: () => void;
};

export function ReportsToolbar({
  onCreate,
  onProjectChange,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onWeekChange,
  projectId,
  projects,
  search,
  sort,
  status,
  week,
}: ReportsToolbarProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search reports by project"
            className="pl-9"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by project"
            value={search}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[140px_180px_160px_140px_auto]">
          <Select
            aria-label="Filter reports by status"
            onChange={(event) => onStatusChange(event.target.value as ReportStatusFilter)}
            value={status}
          >
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
          </Select>
          <Select
            aria-label="Filter reports by project"
            onChange={(event) => onProjectChange(event.target.value)}
            value={projectId}
          >
            <option value="ALL">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
          <Input
            aria-label="Filter reports by week"
            onChange={(event) => onWeekChange(event.target.value)}
            type="date"
            value={week}
          />
          <Select
            aria-label="Sort reports"
            onChange={(event) => onSortChange(event.target.value as ReportSortOption)}
            value={sort}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="week">Week</option>
          </Select>
          <Button className="gap-2" onClick={onCreate} type="button">
            <Plus className="h-4 w-4" />
            Create report
          </Button>
        </div>
      </div>
    </div>
  );
}
