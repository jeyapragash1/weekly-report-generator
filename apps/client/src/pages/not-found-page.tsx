import { Compass, Home, Undo2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl py-16">
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="h-6 w-6" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Error 404
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The page you are looking for cannot be found. Choose a destination below.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <Undo2 className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
