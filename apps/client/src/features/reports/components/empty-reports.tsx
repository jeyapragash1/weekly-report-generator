import { FilePlus2 } from 'lucide-react';
import { StatePanel } from '@/components/states/state-panel';

type EmptyReportsProps = {
  hasFilters: boolean;
  onCreate: () => void;
};

export function EmptyReports({ hasFilters, onCreate }: EmptyReportsProps) {
  return (
    <StatePanel
      actionLabel={!hasFilters ? 'Create report' : undefined}
      description={
        hasFilters
          ? 'Adjust the search, status, project, week, or sort options to find a report.'
          : 'Create a draft report to capture progress, blockers, and plans for the week.'
      }
      icon={FilePlus2}
      onAction={!hasFilters ? onCreate : undefined}
      title={hasFilters ? 'No reports match your filters' : 'No weekly reports yet'}
    />
  );
}
