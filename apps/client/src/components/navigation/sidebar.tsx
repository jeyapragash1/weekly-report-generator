import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { APP_NAME } from '@/constants/app';
import { getMainNavItems } from '@/components/navigation/nav-items';
import { useAuth } from '@/features/auth/auth-context';
import { cn } from '@/lib/utils';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navItems = getMainNavItems(user?.role);

  return (
    <>
      <button
        aria-label="Close navigation"
        className={cn(
          'fixed inset-0 z-30 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        type="button"
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/80 bg-card/95 shadow-xl shadow-foreground/5 backdrop-blur-xl transition-transform lg:static lg:z-auto lg:translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b border-border/80 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              WR
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-normal">{APP_NAME}</p>
              <p className="truncate text-xs text-muted-foreground">Weekly reporting platform</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="px-3 pb-2 text-xs font-medium uppercase text-muted-foreground">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const [pathname, search = ''] = item.href.split('?');
            const hasSearch = search.length > 0;
            const isActiveItem = hasSearch
              ? location.pathname === pathname && location.search === `?${search}`
              : location.pathname === pathname && (!item.end || location.search === '');

            return (
              <NavLink
                className={() =>
                  cn(
                    'relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground',
                    isActiveItem && 'bg-secondary text-foreground shadow-sm',
                  )
                }
                end={item.end}
                key={item.href}
                onClick={onClose}
                to={item.href}
              >
                {() => (
                  <>
                    {isActiveItem ? (
                      <motion.span
                        className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                        layoutId="sidebar-active-indicator"
                      />
                    ) : null}
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-border/80 p-4">
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="text-sm font-medium">Status</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Access dashboard, reports, projects, and account settings from this menu.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
