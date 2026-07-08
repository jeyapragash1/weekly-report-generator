import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type StatePanelProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'warning' | 'danger' | 'success';
  className?: string;
};

const toneClasses = {
  default: 'bg-secondary text-muted-foreground',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  danger: 'bg-destructive/10 text-destructive',
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
};

export function StatePanel({
  actionLabel,
  className,
  description,
  icon: Icon,
  onAction,
  title,
  tone = 'default',
}: StatePanelProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border border-dashed border-border bg-card p-8 text-center shadow-sm',
        className,
      )}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          'mx-auto flex h-12 w-12 items-center justify-center rounded-lg',
          toneClasses[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-base font-semibold tracking-normal">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} type="button" variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  );
}
