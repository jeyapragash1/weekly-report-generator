import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type AnalyticsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: 'default' | 'success' | 'warning';
};

const toneClasses = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

export function AnalyticsCard({
  description,
  icon: Icon,
  title,
  tone = 'default',
  value,
}: AnalyticsCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-normal">{value}</p>
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
    </article>
  );
}
