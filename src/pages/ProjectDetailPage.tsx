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
            {project.liveUrl && <Button href={project.liveUrl}>Visit website</Button>}
            {project.repoUrl && <Button href={project.repoUrl} variant="secondary">View code</Button>}
            <Button to="/projects" variant="text">Back to portfolio</Button>
          </div>
        </Reveal>
      </Section>

      <Section spacing="sm" className="bg-surface-200">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            {project.imageUrl && (
              <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${project.coverColor}`}>
                <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          <div className="max-w-2xl border border-surface-400 bg-surface-100 p-8 md:p-10">
            <p className="caption text-gold-500">Project note</p>
            <h2 className="mt-3 text-h3">Full case study is drafted for now</h2>
            <p className="mt-4 text-body-lg text-charcoal-500">
              I am keeping this page intentionally brief while the portfolio content is being refined.
              For now, this entry includes the project type, stack, summary, and live website link.
            </p>
          </div>
          </div>
        </Reveal>
      </Section>
    </PageTransition>
  );
}
