import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className }: Props) {
  void delay;
  return <div className={className}>{children}</div>;
}
