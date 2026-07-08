import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ToastVariant = 'default' | 'success' | 'error';

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastInput = Omit<Toast, 'id' | 'variant'> & {
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = crypto.randomUUID();
      const nextToast: Toast = {
        id,
        title: toast.title,
        description: toast.description,
        variant: toast.variant ?? 'default',
      };

      setToasts((currentToasts) => [nextToast, ...currentToasts].slice(0, 4));
      window.setTimeout(() => dismissToast(id), 5000);
    },
    [dismissToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                'rounded-lg border bg-popover p-4 text-popover-foreground shadow-xl shadow-foreground/10',
                toast.variant === 'success' && 'border-emerald-200 dark:border-emerald-900',
                toast.variant === 'error' && 'border-destructive/40',
              )}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium">{toast.title}</p>
                  {toast.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">{toast.description}</p>
                  ) : null}
                </div>
                <Button
                  aria-label="Dismiss notification"
                  className="h-8 w-8 shrink-0"
                  onClick={() => dismissToast(toast.id)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
