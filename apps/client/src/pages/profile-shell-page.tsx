import { BadgeCheck, CalendarClock, Mail, ShieldCheck, UserCircle } from 'lucide-react';
import { useMemo } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { useAuth } from '@/features/auth/auth-context';

export function ProfileShellPage() {
  const { user } = useAuth();
  const initials = useMemo(
    () =>
      (user?.name ?? 'User')
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(''),
    [user?.name],
  );
  const normalizedRole = user?.role?.replace('_', ' ') ?? 'User';

  return (
    <PageContainer
      description="View your account profile and access details."
      title="Profile"
    >
      <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">{user?.name ?? 'User'}</h2>
              <p className="truncate text-sm text-muted-foreground">{normalizedRole}</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Account status
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account is active.
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Account information
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </div>
              <p className="mt-2 truncate text-sm text-muted-foreground">{user?.email ?? '-'}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Role
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{normalizedRole}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserCircle className="h-4 w-4 text-primary" />
                Full name
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{user?.name ?? '-'}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarClock className="h-4 w-4 text-primary" />
                Account type
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Standard account</p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
