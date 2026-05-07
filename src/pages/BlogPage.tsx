import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';

export default function BlogPage() {
  return (
    <PageTransition>
      <Seo
        title="Journal - Devansh Patel"
        description="Draft journal for notes on WordPress, React, APIs, and web craft."
      />

      <Section
        spacing="lg"
        eyebrow="Journal draft"
        heading="Notes are coming soon"
        description="This section is parked for now while the portfolio content is tightened. Future posts will cover WordPress builds, React frontends, API integrations, and practical website craft."
      >
        <Reveal>
          <div className="border border-surface-400 bg-surface-100 p-8 md:p-12">
            <h2 className="text-h3">Planned topics</h2>
            <ul className="mt-6 grid gap-4 text-body-lg text-charcoal-700 sm:grid-cols-2">
              <li className="border-t border-surface-400 pt-4">WordPress sites that clients can actually maintain</li>
              <li className="border-t border-surface-400 pt-4">When to use React instead of a traditional CMS theme</li>
              <li className="border-t border-surface-400 pt-4">Connecting portfolio content through clean APIs</li>
              <li className="border-t border-surface-400 pt-4">Performance checks before launching a small website</li>
            </ul>
            <div className="mt-8">
              <Button to="/contact" variant="secondary">Suggest a topic</Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageTransition>
  );
}
