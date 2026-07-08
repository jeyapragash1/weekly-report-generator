export function ReportsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-lg border border-border bg-card" />
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex gap-4 border-b border-border p-4 last:border-0" key={index}>
            <div className="h-10 w-10 rounded-md bg-secondary" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-48 rounded bg-secondary" />
              <div className="h-4 w-full max-w-xl rounded bg-secondary" />
            </div>
            <div className="h-8 w-32 rounded bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
