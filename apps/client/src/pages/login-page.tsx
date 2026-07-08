import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants/app';

export function LoginPage() {
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
          Weekly operations
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">{APP_NAME}</h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            A focused workspace for weekly reporting, project visibility, and manager review.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          {['Secure access', 'Manager-ready', 'Responsive shell'].map((item) => (
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
        <div className="space-y-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
            <LockKeyhole className="h-5 w-5 text-primary" />
          </div>
          <h2 className="pt-2 text-xl font-semibold tracking-normal">Sign in</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Authentication UI will be connected after the shell is finalized.
          </p>
        </div>
        <Button className="mt-7 w-full gap-2" disabled type="button">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </section>
  );
}
