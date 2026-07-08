import { Button } from '@/components/ui/button';

export function HomePage() {
  return (
    <section className="max-w-3xl space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Overview</p>
        <h1 className="text-3xl font-semibold tracking-normal">Weekly Report Generator</h1>
        <p className="text-base leading-7 text-muted-foreground">
          Track progress, monitor team activity, and review project performance in one place.
        </p>
      </div>
      <Button type="button">Go to dashboard</Button>
    </section>
  );
}
