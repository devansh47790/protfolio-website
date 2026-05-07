import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import ServiceCard from '../components/sections/ServiceCard';
import Seo from '../components/seo/Seo';
import { useContent } from '../hooks/useContent';
import { getServices } from '../lib/cms';

export default function ServicesPage() {
  const { data: services } = useContent(getServices);

  return (
    <PageTransition>
      <Seo
        title="Services - Devansh Patel"
        description="Draft services for WordPress, React, and API-connected website builds."
      />

      <Section
        spacing="lg"
        eyebrow="Services draft"
        heading="Website services are being refined"
        description="For now, the focus is simple: custom WordPress sites, React frontends, and API integrations for portfolios and business websites."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {services?.map((s, i) => (
            <Reveal key={s._id} delay={i * 0.05}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </Section>
    </PageTransition>
  );
}
