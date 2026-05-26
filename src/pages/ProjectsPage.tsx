import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import ProjectCard from '../components/sections/ProjectCard';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { useContent } from '../hooks/useContent';
import { getProjects, getSiteSettings } from '../lib/cms';
import { cn } from '../lib/cn';
import { breadcrumbsSchema } from '../lib/seo';
import { getRouteSeo } from '../data/routeSeo';

const routeMeta = getRouteSeo('/projects');

export default function ProjectsPage() {
  const { data: projects } = useContent(getProjects);
  const { data: site } = useContent(getSiteSettings);
  const [category, setCategory] = useState<string>('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search')?.trim() ?? '';

  const categories = useMemo(() => {
    if (!projects) return ['All'];
    return ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  }, [projects]);

  const visible = useMemo(() => {
    if (!projects) return [];
    const query = search.toLowerCase();

    return projects.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const searchable = [
        p.title,
        p.summary,
        p.category,
        ...p.tags,
      ].join(' ').toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [projects, category, search]);

  function updateSearch(value: string) {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      if (value.trim()) {
        next.set('search', value);
      } else {
        next.delete('search');
      }
      return next;
    }, { replace: true });
  }

  return (
    <PageTransition>
      <Seo
        title={routeMeta.title}
        description={routeMeta.description}
        keywords={routeMeta.keywords}
        path="/projects"
      />
      {site && (
        <JsonLd
          id="breadcrumbs-projects"
          data={breadcrumbsSchema(site, [
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
          ])}
        />
      )}

      <Section
        spacing="lg"
        eyebrow="Projects"
        heading="WordPress website portfolio"
        headingLevel="h1"
        description="A collection of React portfolio work, WordPress builds, WooCommerce sites, company portfolios, and WordPress custom themes. Use the filter to narrow by category."
      >
        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="flex flex-wrap gap-2">
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
          <label className="block">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search projects"
              className="field"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-8 text-center text-charcoal-500">No projects in this category yet.</p>
        )}
      </Section>
    </PageTransition>
  );
}
