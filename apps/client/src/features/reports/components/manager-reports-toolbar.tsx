import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type {
  DashboardSubmissionStatusItem,
  DashboardWorkloadItem,
} from '@/features/dashboard/dashboard-types';
import type {
  ManagerReportFilters,
  ManagerReportStatusFilter,
} from '@/features/reports/manager-reports-types';

type ManagerReportsToolbarProps = {
  filters: ManagerReportFilters;
  members: DashboardSubmissionStatusItem[];
  projects: DashboardWorkloadItem[];
  onChange: (filters: ManagerReportFilters) => void;
};

export function ManagerReportsToolbar({
  filters,
  members,
  onChange,
  projects,
}: ManagerReportsToolbarProps) {
  function setFilter<K extends keyof ManagerReportFilters>(key: K, value: ManagerReportFilters[K]) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-6">
        <div className="xl:col-span-2">
          <Label htmlFor="manager-report-search">Search</Label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              id="manager-report-search"
              onChange={(event) => setFilter('search', event.target.value)}
              placeholder="Search by member or project"
              value={filters.search}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="manager-report-member">Team member</Label>
          <Select
            className="mt-2"
            id="manager-report-member"
            onChange={(event) => setFilter('memberId', event.target.value)}
            value={filters.memberId}
          >
            <option value="ALL">All members</option>
            {members.map((item) => (
              <option key={item.user.id} value={item.user.id}>
                {item.user.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="manager-report-project">Project</Label>
          <Select
            className="mt-2"
            id="manager-report-project"
            onChange={(event) => setFilter('projectId', event.target.value)}
            value={filters.projectId}
          >
            <option value="ALL">All projects</option>
            {projects.map((item) => (
              <option key={item.project.id} value={item.project.id}>
                {item.project.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="manager-report-status">Status</Label>
          <Select
            className="mt-2"
            id="manager-report-status"
            onChange={(event) =>
              setFilter('status', event.target.value as ManagerReportStatusFilter)
            }
            value={filters.status}
          >
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="manager-report-date-from">Date from</Label>
          <Input
            className="mt-2"
            id="manager-report-date-from"
            onChange={(event) => setFilter('dateFrom', event.target.value)}
            type="date"
            value={filters.dateFrom}
          />
        </div>

        <div>
          <Label htmlFor="manager-report-date-to">Date to</Label>
          <Input
            className="mt-2"
            id="manager-report-date-to"
            onChange={(event) => setFilter('dateTo', event.target.value)}
            type="date"
            value={filters.dateTo}
          />
        </div>
      </div>
    </section>
  );
}
