export function DashboardChartSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="h-80 animate-pulse rounded-lg border border-border bg-card p-5" key={index}>
          <div className="h-4 w-40 rounded bg-secondary" />
          <div className="mt-4 h-64 rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
