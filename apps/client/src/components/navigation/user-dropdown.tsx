import { ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/auth-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/providers/toast-provider';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleLogout() {
    await logout();
    setIsOpen(false);
    showToast({ title: 'Signed out', description: 'Your session has ended.', variant: 'success' });
    void navigate('/login');
  }

  return (
    <div className="relative">
      <Button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="h-10 gap-2 border border-border bg-card px-2 shadow-sm"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
        variant="ghost"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          {user?.name?.slice(0, 2).toUpperCase() ?? 'ME'}
        </span>
        <span className="hidden max-w-32 truncate text-sm md:inline">
          {user?.name ?? 'User'}
        </span>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
      </Button>
      <div
        className={cn(
          'absolute right-0 top-12 z-20 w-72 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-xl shadow-foreground/10',
          isOpen ? 'block' : 'hidden',
        )}
        role="menu"
      >
        <div className="border-b border-border px-3 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-semibold">
              {user?.name?.slice(0, 2).toUpperCase() ?? 'ME'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name ?? 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? 'No email available'}
              </p>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            {user?.role ?? 'User'}
          </div>
        </div>
        <button
          className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          role="menuitem"
          type="button"
        >
          <UserRound className="h-4 w-4" />
          Profile
        </button>
        <button
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => void handleLogout()}
          role="menuitem"
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
