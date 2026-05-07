import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface Props {
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
}

export default function Card({ children, hoverable = false, className }: Props) {
  const base = cn('border border-surface-400 bg-surface-100 p-8', className);

  if (!hoverable) return <div className={base}>{children}</div>;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
      className={cn(base, 'hover:border-gold-300/70 hover:shadow-soft')}
    >
      {children}
    </motion.div>
  );
}
