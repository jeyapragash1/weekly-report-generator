import { Button } from '@/components/ui/button';

export function HomePage() {
  return (
    <section className="max-w-3xl space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Project foundation</p>
        <h1 className="text-3xl font-semibold tracking-normal">Weekly Report Generator</h1>
        <p className="text-base leading-7 text-muted-foreground">
          The client application shell is ready for feature modules, typed APIs, forms, charts,
          routing, and production UI components.
        </p>
      </div>
      <Button type="button">Architecture ready</Button>
    </section>
  );
}
