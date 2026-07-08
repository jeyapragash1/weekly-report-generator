import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Sidebar } from '@/components/navigation/sidebar';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { UserDropdown } from '@/components/navigation/user-dropdown';
import { Button } from '@/components/ui/button';

export function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
            <Button
              aria-label="Open navigation"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <Breadcrumb />
            </div>
            <div className="hidden h-10 w-full max-w-xs items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground shadow-sm lg:flex">
              <Search className="h-4 w-4" />
              <span className="truncate">Search</span>
            </div>
            <ThemeToggle />
            <UserDropdown />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
