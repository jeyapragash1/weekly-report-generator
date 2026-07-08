import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-normal">Page not found</h1>
      <Button asChild variant="outline">
        <Link to="/">Return home</Link>
      </Button>
    </section>
  );
}
