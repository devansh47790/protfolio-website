import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'gold' | 'soft';

interface Props {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: 'border border-surface-500 text-charcoal-500',
  gold: 'border border-gold-500 text-gold-500',
  soft: 'border border-surface-400 bg-surface-100 text-charcoal-500',
};

export default function Badge({ children, tone = 'neutral', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
