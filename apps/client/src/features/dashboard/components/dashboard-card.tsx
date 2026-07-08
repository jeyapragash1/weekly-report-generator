import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DashboardCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  meta?: string;
  trend?: 'up' | 'down' | 'neutral';
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

const toneClasses = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'bg-destructive/10 text-destructive',
};

export function DashboardCard({
  description,
  icon: Icon,
  meta,
  title,
  trend = 'neutral',
  tone = 'default',
  value,
}: DashboardCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-normal">{value}</p>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
            toneClasses[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
      {meta ? (
        <p
          className={cn(
            'mt-3 text-xs font-medium',
            trend === 'up' && 'text-emerald-700 dark:text-emerald-400',
            trend === 'down' && 'text-amber-700 dark:text-amber-400',
            trend === 'neutral' && 'text-muted-foreground',
          )}
        >
          {meta}
        </p>
      ) : null}
    </article>
  );
}
