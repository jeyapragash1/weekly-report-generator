export function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div className="h-7 w-52 animate-pulse rounded bg-secondary" />
      <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-secondary" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-28 animate-pulse rounded-lg border border-border bg-card" key={index} />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-lg border border-border bg-card" />
    </div>
  );
}
