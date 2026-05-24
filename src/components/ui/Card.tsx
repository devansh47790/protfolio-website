import type { ReactNode } from 'react';
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
    <div className={cn(base, 'transition hover:-translate-y-0.5 hover:border-gold-300/70 hover:shadow-soft')}>
      {children}
    </div>
  );
}
