import PageTransition from '../components/layout/PageTransition';
import Hero from '../components/sections/Hero';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import ProjectCard from '../components/sections/ProjectCard';
import ServiceCard from '../components/sections/ServiceCard';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { useContent } from '../hooks/useContent';
import {
  getHomeContent, getFeaturedProjects, getServices, getSiteSettings,
} from '../lib/cms';
import { personSchema } from '../lib/seo';

export default function HomePage() {
  const { data: home } = useContent(getHomeContent);
  const { data: featured } = useContent(getFeaturedProjects);
  const { data: services } = useContent(getServices);
  const { data: site } = useContent(getSiteSettings);

  return (
    <PageTransition>
      <Seo
        title={home?.seo?.title ?? 'Devansh Patel | WordPress, React & API Portfolio'}
        description={home?.seo?.description ?? 'Explore polished WordPress websites, React frontends, WooCommerce builds, and API-connected portfolio work by Devansh Patel.'}
        keywords={home?.seo?.keywords ?? ['WordPress developer', 'React developer', 'WooCommerce developer', 'API integration', 'portfolio website developer']}
        path="/"
        ogImageUrl={home?.seo?.ogImageUrl}
      />
      {site && <JsonLd id="person" data={personSchema(site)} />}

      {home && <Hero content={home} />}

      <Section
        eyebrow="Selected work"
        heading="WordPress websites and portfolio builds"
        description="A selection of WordPress websites across e-commerce, company portfolios, service businesses, trades, healthcare, construction, and professional services."
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
        description="Focused builds for clients who need premium presentation and practical content control."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {services?.map((s, i) => (
            <Reveal key={s._id} delay={i * 0.05}>
              <ServiceCard service={s} />
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
              <Button
                to="/contact"
                size="lg"
                variant="secondary"
                className="text-surface-50 hover:text-charcoal-900"
              >
                Start a conversation
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageTransition>
  );
}
