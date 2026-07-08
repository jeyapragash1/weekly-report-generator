import { BarChart3 } from 'lucide-react';

type ChartEmptyStateProps = {
  message: string;
};

export function ChartEmptyState({ message }: ChartEmptyStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed border-border bg-background p-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}
