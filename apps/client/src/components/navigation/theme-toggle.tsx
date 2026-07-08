import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <Button
      aria-label="Toggle theme"
      className="border border-border bg-card shadow-sm"
      onClick={toggleTheme}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
