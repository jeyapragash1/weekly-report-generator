export function DashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className="h-40 animate-pulse rounded-lg border border-border bg-card p-5"
            key={index}
          >
            <div className="h-4 w-24 rounded bg-secondary" />
            <div className="mt-5 h-8 w-16 rounded bg-secondary" />
            <div className="mt-6 h-4 w-full rounded bg-secondary" />
            <div className="mt-2 h-4 w-2/3 rounded bg-secondary" />
          </div>
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-lg border border-border bg-card" />
    </div>
  );
}
