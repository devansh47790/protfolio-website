/*
  <PageTransition> wraps every page so it fades in on mount and out on unmount.
  Pair it with the AnimatePresence in App.tsx — the router unmounts the old
  page only after PageTransition's exit animation finishes.

  Convention: every page component's root element is <PageTransition> ... </PageTransition>.
*/
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props { children: ReactNode }

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
