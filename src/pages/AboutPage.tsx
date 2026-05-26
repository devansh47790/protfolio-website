import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { useContent } from '../hooks/useContent';
import { getAboutContent, getSiteSettings } from '../lib/cms';
import { breadcrumbsSchema } from '../lib/seo';
import { getRouteSeo } from '../data/routeSeo';

// CMS data takes priority; routeMeta is the fallback baked into the pre-rendered HTML.
const routeMeta = getRouteSeo('/about');

export default function AboutPage() {
  const { data: about } = useContent(getAboutContent);
  const { data: site } = useContent(getSiteSettings);

  if (!about || !site) return null;

  return (
    <PageTransition>
      <Seo
        title={about.seo?.title ?? routeMeta.title}
        description={about.seo?.description ?? routeMeta.description}
        keywords={about.seo?.keywords ?? routeMeta.keywords}
        path="/about"
        ogImageUrl={about.seo?.ogImageUrl}
      />
      <JsonLd
        id="breadcrumbs-about"
        data={breadcrumbsSchema(site, [
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <Section spacing="lg">
        <Reveal>
          <p className="caption text-gold-500">About me</p>
          <h1 className="mt-3 max-w-3xl">{about.intro}</h1>
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <div className="space-y-5 text-body-lg leading-relaxed text-charcoal-700">
              {about.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/contact">Get in touch</Button>
              {site.resumeUrl && (
                <Button href={site.resumeUrl} variant="secondary">Download resume</Button>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel">
              <h3 className="text-h4">Quick facts</h3>
              <dl className="mt-4 space-y-3 text-body-md">
                <div>
                  <dt className="text-charcoal-500">Email</dt>
                  <dd className="text-charcoal-900">{site.email}</dd>
                </div>
                <div>
                  <dt className="text-charcoal-500">Status</dt>
                  <dd className="text-charcoal-900">{site.location}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        className="bg-surface-200"
        eyebrow="Toolbox"
        heading="Skills"
        description="The things I reach for most often."
      >
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {about.skills.map((skill) => (
              <Badge key={skill} tone="soft" className="px-3 py-1.5">
                {skill}
              </Badge>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Journey" heading="A short timeline">
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-surface-500 md:left-1/2" aria-hidden />
          <div className="space-y-10">
            {about.timeline.map((entry, i) => (
              <Reveal key={entry.year + entry.title} delay={i * 0.05}>
                <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className={i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:order-2 md:pl-10'}>
                    <p className="caption text-gold-500">{entry.year}</p>
                    <h3 className="mt-1 text-h4">{entry.title}</h3>
                    <p className="mt-1 text-body-md text-charcoal-500">{entry.description}</p>
                  </div>
                  <div className="hidden md:block" />
                  <span className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-gold-300 ring-4 ring-surface md:left-1/2" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </PageTransition>
  );
}
