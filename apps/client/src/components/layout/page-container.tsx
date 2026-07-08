import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type PageContainerProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function PageContainer({ children, description, title }: PageContainerProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl space-y-7"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-2 border-b border-border/70 pb-6">
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">{title}</h1>
        {description ? (
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}
