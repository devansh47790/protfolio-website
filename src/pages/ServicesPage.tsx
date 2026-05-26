import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import ServiceCard from '../components/sections/ServiceCard';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { useContent } from '../hooks/useContent';
import { getServices, getSiteSettings } from '../lib/cms';
import { breadcrumbsSchema } from '../lib/seo';
import { getRouteSeo } from '../data/routeSeo';

// Single source of truth for this page's meta — shared with the prerender plugin.
const routeMeta = getRouteSeo('/services');

export default function ServicesPage() {
  const { data: services } = useContent(getServices);
  const { data: site } = useContent(getSiteSettings);

  return (
    <PageTransition>
      <Seo
        title={routeMeta.title}
        description={routeMeta.description}
        keywords={routeMeta.keywords}
        path="/services"
      />
      {site && (
        <JsonLd
          id="breadcrumbs-services"
          data={breadcrumbsSchema(site, [
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ])}
        />
      )}

      <Section
        spacing="lg"
        eyebrow="Services"
        heading="Website services are being refined"
        headingLevel="h1"
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
