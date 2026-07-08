import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/constants/app';
import { ThemeToggle } from '@/components/navigation/theme-toggle';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              WR
            </div>
            <span className="text-sm font-semibold">{APP_NAME}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-10 md:px-6">
        <Outlet />
      </main>
    </div>
  );
}
