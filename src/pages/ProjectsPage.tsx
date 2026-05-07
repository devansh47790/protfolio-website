import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import ProjectCard from '../components/sections/ProjectCard';
import Seo from '../components/seo/Seo';
import { useContent } from '../hooks/useContent';
import { getProjects } from '../lib/cms';
import { cn } from '../lib/cn';

export default function ProjectsPage() {
  const { data: projects } = useContent(getProjects);
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(() => {
    if (!projects) return ['All'];
    return ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  }, [projects]);

  const visible = useMemo(() => {
    if (!projects) return [];
    return category === 'All' ? projects : projects.filter((p) => p.category === category);
  }, [projects, category]);

  return (
    <PageTransition>
      <Seo title="Projects - Devansh Patel" description="Selected projects and case studies." />

      <Section
        spacing="lg"
        eyebrow="Projects"
        heading="Things I've built"
        description="A growing collection of case studies. Use the filter to narrow by category."
      >
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors',
                category === c
                  ? 'border-charcoal-900 bg-charcoal-900 text-surface-50'
                  : 'border-surface-500 bg-surface-100 text-charcoal-700 hover:border-gold-300',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="mt-8 text-center text-charcoal-500">No projects in this category yet.</p>
        )}
      </Section>
    </PageTransition>
  );
}
