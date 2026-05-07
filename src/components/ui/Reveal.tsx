/*
  <Reveal> — wrap any block to make it fade + slide up the first time it
  enters the viewport. Used for "scroll reveal" everywhere.

  Implementation note: Framer Motion's `whileInView` triggers when the
  element scrolls into view. `viewport={{ once: true }}` ensures it only
  animates the first time, so re-scrolling does not re-trigger and feel busy.
*/
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Delay in seconds. Use to stagger children manually. */
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
