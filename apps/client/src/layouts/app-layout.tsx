import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/constants/app';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-sm font-semibold">{APP_NAME}</span>
        </div>
      </header>
      <main className="container py-10">
        <Outlet />
      </main>
    </div>
  );
}
