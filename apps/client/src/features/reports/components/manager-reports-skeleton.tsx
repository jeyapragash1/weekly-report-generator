export function ManagerReportsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-lg border border-border bg-card" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="h-28 animate-pulse rounded-lg border border-border bg-card" key={index} />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-lg border border-border bg-card" />
    </div>
  );
}
