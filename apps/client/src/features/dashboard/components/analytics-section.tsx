import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type AnalyticsSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AnalyticsSection({ children, description, title }: AnalyticsSectionProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-normal">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </motion.section>
  );
}
