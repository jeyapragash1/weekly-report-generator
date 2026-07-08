import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({ checked, className, disabled, onCheckedChange, ...props }: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted',
        className,
      )}
      disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }

        onCheckedChange?.(!checked);
      }}
      role="switch"
      type="button"
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-primary-foreground shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
}
