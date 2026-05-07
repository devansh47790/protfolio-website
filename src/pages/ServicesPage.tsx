import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import ServiceCard from '../components/sections/ServiceCard';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';
import { useContent } from '../hooks/useContent';
import { getServices } from '../lib/cms';

export default function ServicesPage() {
  const { data: services } = useContent(getServices);

  return (
    <PageTransition>
      <Seo title="Services - Devansh Patel" description="Engagements I take on." />

      <Section
        spacing="lg"
        eyebrow="Services"
        heading="Ways we can work together"
        description="Whether you need a single landing page or a full design system, I keep the work clean, fast, and easy to hand off."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {services?.map((s, i) => (
            <Reveal key={s._id} delay={i * 0.05}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section spacing="sm">
        <Reveal>
          <div className="border border-surface-400 bg-surface-100 p-8 md:p-12">
            <h2>Not sure what you need?</h2>
            <p className="mt-3 max-w-xl text-body-lg text-charcoal-500">
              Send me a few sentences about your project and I'll suggest a path forward.
            </p>
            <div className="mt-6">
              <Button to="/contact">Start a conversation</Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageTransition>
  );
}
