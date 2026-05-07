import { motion } from 'framer-motion';
import Button from '../ui/Button';
import type { HomeContent } from '../../types/content';

interface Props { content: HomeContent }

export default function Hero({ content }: Props) {
  return (
    <section className="border-b border-surface-400">
      <div className="container-page pb-20 pt-20 md:pb-28 md:pt-28 lg:pb-32 lg:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="caption text-gold-500"
        >
          {content.heroEyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-8 max-w-4xl"
        >
          {content.heroHeadline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-8 max-w-2xl text-body-lg text-charcoal-500"
        >
          {content.heroSubhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <Button to={content.primaryCta.href} size="lg">
            {content.primaryCta.label}
          </Button>
          <Button to={content.secondaryCta.href} size="lg" variant="secondary">
            {content.secondaryCta.label}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 grid grid-cols-1 divide-y divide-surface-400 border-t border-surface-400 md:mt-16 md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {content.highlightStats.map((s) => (
            <div key={s.label} className="px-0 py-6 md:px-8">
              <p className="font-display text-h3 text-charcoal-900">{s.value}</p>
              <p className="caption mt-2 text-charcoal-500">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
