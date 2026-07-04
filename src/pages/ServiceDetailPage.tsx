/*
  ServiceDetailPage — /services/:slug

  Mirrors ProjectDetailPage. Renders one long-form service page using the
  rich fields on the Service type (h1, hero, sections, faqs, schemaJson,
  internalLinks, externalLinks).

  SEO wiring:
    - <Seo>           sets <title>, <meta description>, canonical, OG, Twitter
    - <JsonLd>        emits 3 structured-data blocks:
                        1. breadcrumbs       (Home > Services > <title>)
                        2. service           (parsed from service.schemaJson)
                        3. faqPage           (built from service.faqs)

  Falls back gracefully:
    - If the service exists but has no `sections`, only the hero renders.
    - If `schemaJson` isn't valid JSON, the Service block is silently skipped.
    - Unknown slug → friendly "Service not found" with a link back.
*/
import { type ReactNode, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { getServiceBySlug, getServices, getSiteSettings } from '../lib/cms';
import { breadcrumbsSchema } from '../lib/seo';
import type { Service, SiteSettings, BlogBodyBlock } from '../types/content';

const serviceSectionTopPadding = '!pt-12 md:!pt-12 lg:!pt-12';

function blockText(block: BlogBodyBlock): string {
  if (typeof block === 'string') return block;
  if ('children' in block && Array.isArray(block.children)) {
    return block.children.map((c) => c.text ?? '').join('');
  }
  return '';
}

function hasSchemaType(value: unknown, type: string): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasSchemaType(item, type));
  }

  if (!value || typeof value !== 'object') return false;

  const record = value as Record<string, unknown>;
  const schemaType = record['@type'];
  if (schemaType === type) return true;
  if (Array.isArray(schemaType) && schemaType.includes(type)) return true;

  return false;
}

function stripSchemaType(value: unknown, type: string): unknown {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => stripSchemaType(item, type))
      .filter((item) => item !== null);
    return items.length > 0 ? items : null;
  }

  if (!value || typeof value !== 'object') return value;

  const record = value as Record<string, unknown>;
  if (hasSchemaType(record, type)) return null;

  const next = Object.fromEntries(
    Object.entries(record)
      .map(([key, item]) => [key, stripSchemaType(item, type)] as const)
      .filter(([, item]) => item !== null),
  );

  return Object.keys(next).length > 0 ? next : null;
}

function markedText(
  block: Extract<BlogBodyBlock, { _type: 'block' }>,
  child: NonNullable<Extract<BlogBodyBlock, { _type: 'block' }>['children']>[number],
) {
  return (child.marks ?? []).reduce<ReactNode>((content, mark) => {
    if (mark === 'strong') return <strong>{content}</strong>;
    if (mark === 'em') return <em>{content}</em>;
    if (mark === 'code') return <code className="bg-surface-300 px-1 py-0.5 text-body-sm">{content}</code>;

    const link = block.markDefs?.find((definition) => definition._key === mark && definition.href);
    if (!link?.href) return content;

    return (
      <a
        href={link.href}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-gold-500 underline-offset-4 hover:underline"
      >
        {content}
      </a>
    );
  }, child.text ?? '');
}

function RichServiceContent({
  blocks,
  lead = false,
}: {
  blocks: BlogBodyBlock[];
  lead?: boolean;
}) {
  return (
    <div className={lead ? 'max-w-2xl space-y-4' : 'max-w-3xl space-y-5'}>
      {blocks.map((block, i) => {
        if (typeof block === 'string') {
          return (
            <p key={i} className={lead ? 'text-body-lg text-charcoal-500' : 'text-body-md leading-relaxed text-charcoal-700'}>
              {block}
            </p>
          );
        }

        const key = block._key ?? i;

        if (block._type === 'image') {
          if (!block.imageUrl) return null;
          return (
            <figure key={key} className="space-y-2">
              <img
                src={block.imageUrl}
                alt={block.alt ?? ''}
                loading="lazy"
                decoding="async"
                className="w-full border border-surface-400 object-cover"
              />
              {block.alt && <figcaption className="text-body-sm text-charcoal-500">{block.alt}</figcaption>}
            </figure>
          );
        }

        const content = block.children?.map((child) => (
          <span key={child._key ?? child.text}>{markedText(block, child)}</span>
        ));
        if (!blockText(block)) return null;

        if (block.style === 'h2') return <h2 key={key} className="pt-4 text-h3 text-charcoal-900">{content}</h2>;
        if (block.style === 'h3') return <h3 key={key} className="pt-2 text-h4 text-charcoal-900">{content}</h3>;
        if (block.style === 'blockquote') {
          return (
            <blockquote key={key} className="border-l-2 border-gold-300 pl-5 font-serif text-xl italic text-charcoal-700">
              {content}
            </blockquote>
          );
        }
        if (block.listItem === 'bullet') {
          return (
            <ul key={key} className="ml-6 list-disc text-charcoal-700">
              <li>{content}</li>
            </ul>
          );
        }
        if (block.listItem === 'number') {
          return (
            <ol key={key} className="ml-6 list-decimal text-charcoal-700">
              <li>{content}</li>
            </ol>
          );
        }

        return (
          <p key={key} className={lead ? 'text-body-lg text-charcoal-500' : 'text-body-md leading-relaxed text-charcoal-700'}>
            {content}
          </p>
        );
      })}
    </div>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null | undefined>(undefined);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [site, setSite] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (!slug) return;
    getServiceBySlug(slug).then(setService);
    getServices().then((services) => {
      setRelatedServices(services.filter((item) => item.slug !== slug));
    });
    getSiteSettings().then(setSite);
  }, [slug]);

  /* ----- Loading & not-found states ----- */
  if (service === undefined) {
    return <div className="container-page py-20 text-charcoal-500">Loading...</div>;
  }
  if (service === null) {
    return (
      <PageTransition>
        <Section spacing="lg" className={serviceSectionTopPadding}>
          <h1>Service not found</h1>
          <p className="mt-3 text-charcoal-500">
            This service may have moved.{' '}
            <Link to="/services" className="text-gold-500 underline">
              Back to services
            </Link>
            .
          </p>
        </Section>
      </PageTransition>
    );
  }

  /* ----- Parse the optional Service JSON-LD attached to this page ----- */
  let serviceSchema: Record<string, unknown> | Record<string, unknown>[] | null = null;
  if (service.schemaJson) {
    try {
      serviceSchema = stripSchemaType(
        JSON.parse(service.schemaJson),
        'FAQPage',
      ) as Record<string, unknown> | Record<string, unknown>[] | null;
    } catch {
      // Bad JSON in the CMS — fail open. Don't crash the page.
      serviceSchema = null;
    }
  }

  /* ----- Build FAQPage schema from service.faqs (if any) ----- */
  const faqSchema =
    service.faqs && service.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: service.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  /* ----- Pick the title/description that drive <head> tags -----
     Priority: service.seo (most specific) → ogTitle/ogDescription
     → fall back to title + summary so we always have something. */
  const seoTitle = service.seo?.title ?? service.ogTitle ?? `${service.title} | Akime`;
  const seoDescription = service.seo?.description ?? service.ogDescription ?? service.summary;
  const seoKeywords = service.seo?.keywords ?? service.targetKeywords ?? [service.title];

  return (
    <PageTransition>
      <Seo
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        path={`/services/${service.slug}`}
        ogImageUrl={service.seo?.ogImageUrl}
      />

      {/* Breadcrumbs are always rendered — even if site isn't loaded yet
          we just defer until it is to keep absolute URLs correct. */}
      {site && (
        <>
          <JsonLd
            id={`breadcrumbs-${service.slug}`}
            data={breadcrumbsSchema(site, [
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
              { name: service.title, path: `/services/${service.slug}` },
            ])}
          />
          {serviceSchema && (
            <JsonLd id={`service-${service.slug}`} data={serviceSchema} />
          )}
          {faqSchema && (
            <JsonLd id={`faq-${service.slug}`} data={faqSchema} />
          )}
        </>
      )}

      {/* HERO -------------------------------------------------------- */}
      <Section spacing="lg" className={serviceSectionTopPadding}>
        <Reveal>
          <Link to="/services" className="caption text-gold-500 hover:text-charcoal-900">
            &lt;- Back to services
          </Link>
          <p className="caption mt-6 text-charcoal-500">Service</p>
          <h1 className="mt-2 max-w-3xl">{service.h1 ?? service.title}</h1>

          {/* Long-form hero paragraphs (only on SEO pages). The index-style
              services skip this and rely on summary instead. */}
          {service.hero && service.hero.length > 0 ? (
            <div className="mt-6">
              <RichServiceContent blocks={service.hero} lead />
            </div>
          ) : (
            <p className="mt-5 max-w-2xl text-body-lg text-charcoal-500">
              {service.summary}
            </p>
          )}

          {/* CTAs */}
          {service.ctaLinks && service.ctaLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {service.ctaLinks.map((cta, i) =>
                cta.href.startsWith('/') ? (
                  <Button key={cta.label} to={cta.href} variant={i === 0 ? 'primary' : 'secondary'}>
                    {cta.label}
                  </Button>
                ) : (
                  <Button key={cta.label} href={cta.href} variant={i === 0 ? 'primary' : 'secondary'}>
                    {cta.label}
                  </Button>
                ),
              )}
            </div>
          )}
        </Reveal>
      </Section>

      {/* BULLETS (shared with the index card — gives a fast scannable summary) */}
      {service.bullets && service.bullets.length > 0 && (
        <Section spacing="sm" className={serviceSectionTopPadding}>
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-body-md text-charcoal-700">
                  <span className="mt-3 h-px w-3 shrink-0 bg-gold-300" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      )}

      {/* LONG-FORM SECTIONS ----------------------------------------- */}
      {service.sections?.map((section, idx) => (
        <Section key={section.heading} spacing="md" className={serviceSectionTopPadding}>
          <Reveal>
            <h2 className="max-w-3xl text-h3">{section.heading}</h2>
            <div className="mt-6">
              <RichServiceContent blocks={section.body ?? []} />
            </div>
          </Reveal>
          {/* Hairline divider between sections, except after the last */}
          {idx < (service.sections?.length ?? 0) - 1 && (
            <div className="mt-12 border-b border-surface-400" />
          )}
        </Section>
      ))}

      {/* FAQs -------------------------------------------------------- */}
      {service.faqs && service.faqs.length > 0 && (
        <Section
          spacing="md"
          className={serviceSectionTopPadding}
          eyebrow="FAQs"
          heading="Common questions"
          description="Honest answers to the questions clients ask before they hire."
        >
          <div className="mt-2 divide-y divide-surface-400 border-t border-surface-400">
            {service.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 text-body-md font-medium text-charcoal-900">
                  <span>{faq.question}</span>
                  <span className="mt-1 text-gold-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-3xl text-body-md leading-relaxed text-charcoal-700">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* RELATED SERVICES ------------------------------------------- */}
      {relatedServices.length > 0 && (
        <Section
          spacing="sm"
          className={serviceSectionTopPadding}
          eyebrow="Related"
          heading="Keep exploring"
        >
          <ul className="mt-2 flex flex-wrap gap-3">
            {relatedServices.map((related) => (
              <li key={related._id}>
                <Link
                  to={`/services/${related.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-surface-400 px-4 py-2 text-body-sm text-charcoal-700 transition hover:border-gold-300 hover:text-charcoal-900"
                >
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* EXTERNAL TRUST LINKS --------------------------------------- */}
      {service.externalLinks && service.externalLinks.length > 0 && (
        <Section spacing="sm" className={serviceSectionTopPadding}>
          <p className="caption text-charcoal-500">Further reading</p>
          <ul className="mt-3 space-y-2">
            {service.externalLinks.map((link) =>
              link.href ? (
                <li key={link.href} className="text-body-sm text-charcoal-700">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-500 underline-offset-4 hover:underline"
                  >
                    {link.label ?? link.href}
                  </a>
                  {link.note && <span className="ml-2 text-charcoal-500">— {link.note}</span>}
                </li>
              ) : null,
            )}
          </ul>
        </Section>
      )}

      {/* FINAL CTA -------------------------------------------------- */}
      <Section spacing="lg" className={serviceSectionTopPadding}>
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-h3">Ready to start?</h2>
            <p className="mt-3 text-body-md text-charcoal-500">
              Drop me a line. I&apos;ll get back within one business day with a
              fixed-price quote and a realistic timeline — no hourly billing
              surprises.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/contact">Start a project</Button>
              <Button to="/services" variant="text">All services</Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageTransition>
  );
}
