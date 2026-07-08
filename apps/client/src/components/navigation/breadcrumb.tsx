import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function formatSegment(segment: string) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const items = segments.length > 0 ? segments : ['dashboard'];

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
      <Link
        className="font-medium text-muted-foreground transition-colors hover:text-foreground"
        to="/"
      >
        Home
      </Link>
      {items[0] === 'dashboard' ? null : (
        <>
          {items.map((segment, index) => {
            const href = `/${items.slice(0, index + 1).join('/')}`;
            const isLast = index === items.length - 1;

            return (
              <span className="flex min-w-0 items-center gap-1" key={href}>
                <ChevronRight className="h-4 w-4 shrink-0" />
                {isLast ? (
                  <span className="truncate font-medium text-foreground">
                    {formatSegment(segment)}
                  </span>
                ) : (
                  <Link
                    className="truncate text-muted-foreground transition-colors hover:text-foreground"
                    to={href}
                  >
                    {formatSegment(segment)}
                  </Link>
                )}
              </span>
            );
          })}
        </>
      )}
    </nav>
  );
}
