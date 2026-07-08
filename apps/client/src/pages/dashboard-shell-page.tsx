import { PageContainer } from '@/components/layout/page-container';

export function DashboardShellPage() {
  return (
    <PageContainer
      description="A manager workspace shell is ready for future dashboard content."
      title="Dashboard"
    >
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-sm text-muted-foreground shadow-sm">
        Dashboard content will be connected in a later implementation step.
      </div>
    </PageContainer>
  );
}
