import { CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_NAME } from '@/constants/app';

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({ children, description, eyebrow, title }: AuthShellProps) {
  return (
    <section className="grid w-full gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl space-y-7"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
      >
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          {eyebrow}
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">{APP_NAME}</h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          {['Secure access', 'Role-based permissions', 'Responsive interface'].map((item) => (
            <div className="flex items-center gap-2" key={item}>
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-7 text-card-foreground shadow-xl shadow-foreground/5"
        initial={{ opacity: 0, y: 12 }}
        transition={{ delay: 0.05, duration: 0.25 }}
      >
        <div className="space-y-2 pb-6">
          <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {children}
      </motion.div>
    </section>
  );
}
