import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4 py-16">
      <h1 className="text-2xl font-semibold tracking-normal">Page not found</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        The requested route does not exist in this application shell.
      </p>
      <Button asChild variant="outline">
        <Link to="/">Return home</Link>
      </Button>
    </section>
  );
}
