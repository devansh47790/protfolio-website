import PageTransition from '../components/layout/PageTransition';
import Hero from '../components/sections/Hero';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import ProjectCard from '../components/sections/ProjectCard';
import ServiceCard from '../components/sections/ServiceCard';
import TestimonialCard from '../components/sections/TestimonialCard';
import Seo from '../components/seo/Seo';
import { useContent } from '../hooks/useContent';
import {
  getHomeContent, getFeaturedProjects, getServices, getTestimonials,
} from '../lib/cms';

export default function HomePage() {
  const { data: home } = useContent(getHomeContent);
  const { data: featured } = useContent(getFeaturedProjects);
  const { data: services } = useContent(getServices);
  const { data: testimonials } = useContent(getTestimonials);

  return (
    <PageTransition>
      <Seo
        title="Devansh Patel - Frontend Engineer"
        description="Portfolio, projects, and writing by Devansh Patel."
      />

      {home && <Hero content={home} />}

      <Section
        eyebrow="Selected work"
        heading="Recent projects"
        description="A few things I've shipped lately. Click any card to read the case study."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured?.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Button to="/projects" variant="secondary">See all projects</Button>
        </div>
      </Section>

      <Section
        className="bg-surface-200"
        eyebrow="What I do"
        heading="Services"
        description="Engagements I take on. Pick what fits, or let's design something custom."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services?.map((s, i) => (
            <Reveal key={s._id} delay={i * 0.05}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Kind words" heading="What clients say">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials?.map((t, i) => (
            <Reveal key={t._id} delay={i * 0.05}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section spacing="sm">
        <Reveal>
          <div className="border border-charcoal-900 bg-charcoal-900 px-8 py-14 text-surface-50 md:px-16 md:py-20">
            <h2 className="text-surface-50">Have a project in mind?</h2>
            <p className="mt-3 max-w-xl text-body-lg text-surface-300">
              I'm available for full-time roles and select contract work. Tell me a little about what you need.
            </p>
            <div className="mt-7">
              <Button to="/contact" size="lg" variant="secondary">Start a conversation</Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageTransition>
  );
}
