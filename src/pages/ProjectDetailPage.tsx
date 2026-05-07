import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';
import { getProjectBySlug } from '../lib/cms';
import type { Project } from '../types/content';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    getProjectBySlug(slug).then(setProject);
  }, [slug]);

  if (project === undefined) {
    return <div className="container-page py-20 text-charcoal-500">Loading...</div>;
  }

  if (project === null) {
    return (
      <PageTransition>
        <Section spacing="lg">
          <h1>Project not found</h1>
          <p className="mt-3 text-charcoal-500">
            This project may have moved. <Link to="/projects" className="text-gold-500 underline">Back to projects</Link>.
          </p>
        </Section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Seo title={`${project.title} - Devansh Patel`} description={project.summary} />

      <Section spacing="lg">
        <Reveal>
          <Link to="/projects" className="caption text-gold-500 hover:text-charcoal-900">&lt;- Back to projects</Link>
          <p className="caption mt-6 text-charcoal-500">{project.category}</p>
          <h1 className="mt-2 max-w-3xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-body-lg text-charcoal-500">{project.summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && <Button href={project.liveUrl}>View live</Button>}
            {project.repoUrl && <Button href={project.repoUrl} variant="secondary">View code</Button>}
          </div>
        </Reveal>
      </Section>

      <div className="container-page">
        <Reveal>
          <div className={`relative h-72 overflow-hidden bg-gradient-to-br ${project.coverColor} md:h-96`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(28,27,27,0.08)_1px,transparent_1px)] bg-[length:18px_18px] opacity-50" aria-hidden />
          </div>
        </Reveal>
      </div>

      <Section>
        <div className="grid gap-12 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <h2>The problem</h2>
            <p className="mt-3 text-body-lg leading-relaxed text-charcoal-700">{project.problem}</p>

            <h2 className="mt-12">My approach</h2>
            <ul className="mt-3 space-y-3 text-body-lg leading-relaxed text-charcoal-700">
              {project.approach.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-3 h-px w-4 shrink-0 bg-gold-300" />
                  {step}
                </li>
              ))}
            </ul>

            <h2 className="mt-12">Outcomes</h2>
            <ul className="mt-3 space-y-3 text-body-lg leading-relaxed text-charcoal-700">
              {project.outcomes.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-3 h-px w-4 shrink-0 bg-gold-300" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="sticky top-24 border border-surface-400 bg-surface-100 p-6">
              <h3 className="caption text-charcoal-500">Project info</h3>
              <dl className="mt-4 space-y-3 text-body-md">
                <div>
                  <dt className="text-charcoal-500">Category</dt>
                  <dd className="text-charcoal-900">{project.category}</dd>
                </div>
                <div>
                  <dt className="text-charcoal-500">Date</dt>
                  <dd className="text-charcoal-900">
                    {new Date(project.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                  </dd>
                </div>
                <div>
                  <dt className="text-charcoal-500">Stack</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {project.tags.map((t) => <Badge key={t} tone="soft">{t}</Badge>)}
                  </dd>
                </div>
              </dl>
            </aside>
          </Reveal>
        </div>
      </Section>
    </PageTransition>
  );
}
