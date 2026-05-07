import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <Seo title="Page not found" />
      <Section spacing="lg">
        <p className="caption text-gold-500">404</p>
        <h1 className="mt-3">That page wandered off.</h1>
        <p className="mt-4 max-w-prose text-body-lg text-charcoal-500">
          The link may be old or misspelled. Try one of the buttons below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/">Back home</Button>
          <Button to="/projects" variant="secondary">See projects</Button>
        </div>
      </Section>
    </PageTransition>
  );
}
