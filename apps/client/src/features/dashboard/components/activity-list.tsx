import { memo } from 'react';
import { CalendarDays, CheckCircle2, FolderKanban, UserRound } from 'lucide-react';
import type { DashboardActivityItem } from '@/features/dashboard/dashboard-types';
import { cn } from '@/lib/utils';

type ActivityListProps = {
  items: DashboardActivityItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatWeek(item: DashboardActivityItem) {
  return `${formatDate(item.week.startDate)} - ${formatDate(item.week.endDate)}`;
}

function ActivityListBase({ items }: ActivityListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium">No submitted reports yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent submissions will appear here once team members submit weekly reports.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li className="p-4 transition-colors hover:bg-secondary/40" key={item.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {item.user.name
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join('')}
                  </div>
                  <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="truncate text-sm font-medium">{item.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.user.email}</p>
                  <span
                    className={cn(
                      'rounded-md px-2 py-0.5 text-xs font-medium',
                      item.status === 'SUBMITTED'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                  <span className="inline-flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    {item.project.name}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatWeek(item)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {item.submittedAt ? formatDate(item.submittedAt) : 'Not submitted'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const ActivityList = memo(ActivityListBase);
