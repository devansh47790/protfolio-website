import { useState } from 'react';
import type { FormEvent } from 'react';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { useContent } from '../hooks/useContent';
import { getSiteSettings } from '../lib/cms';
import { breadcrumbsSchema } from '../lib/seo';
import { getRouteSeo } from '../data/routeSeo';

const routeMeta = getRouteSeo('/contact');

export default function ContactPage() {
  const { data: site } = useContent(getSiteSettings);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 700);
  }

  return (
    <PageTransition>
      <Seo
        title={routeMeta.title}
        description={routeMeta.description}
        keywords={routeMeta.keywords}
        path="/contact"
      />
      {site && (
        <JsonLd
          id="breadcrumbs-contact"
          data={breadcrumbsSchema(site, [
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ])}
        />
      )}

      <Section spacing="lg">
        <Reveal>
          <p className="caption text-gold-500">Contact</p>

          <h1 className="mt-3 max-w-3xl">
            Let’s build your next website properly.
          </h1>

          <p className="mt-5 max-w-xl text-body-lg text-charcoal-500">
            Akime works with small businesses across Hoppers Crossing, Wyndham City and
            Melbourne to build fast, modern and SEO-friendly websites. Whether you need
            a new WordPress website, WooCommerce store, React frontend, API integration,
            local SEO help or performance support, you can contact Akime directly and
            speak with the developer doing the work.
          </p>

          <p className="mt-4 max-w-xl text-charcoal-500">
            Use this page to request a quote, ask a technical question, discuss a
            website issue or get advice on the best next step for your online presence.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <section>
              <h2 className="text-2xl font-semibold text-charcoal-900">
                What you can contact Akime about
              </h2>

              <ul className="mt-5 space-y-3 text-charcoal-500">
                <li>New WordPress websites</li>
                <li>WooCommerce and ecommerce builds</li>
                <li>Local SEO and digital marketing</li>
                <li>React frontend development</li>
                <li>API integrations</li>
                <li>Website speed and performance fixes</li>
                <li>Website maintenance and technical support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal-900">
                Who Akime works with
              </h2>

              <p className="mt-5 text-charcoal-500">
                Akime works with tradies, service businesses, ecommerce stores, local
                retailers, consultants, clinics, accountants and small businesses that
                need clean, reliable and easy-to-manage websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal-900">
                Service areas
              </h2>

              <p className="mt-5 text-charcoal-500">
                Akime works with businesses in Hoppers Crossing, Werribee, Point Cook,
                Tarneit, Truganina, Williams Landing, Laverton, Altona Meadows, Wyndham
                Vale, Werribee South and across Melbourne.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-charcoal-900">
                What happens after you contact Akime?
              </h2>

              <ol className="mt-5 space-y-3 text-charcoal-500">
                <li>1. You send through your project details.</li>
                <li>2. Akime reviews your website, goals or technical issue.</li>
                <li>
                  3. You receive a clear response with next steps, timeline and pricing
                  direction.
                </li>
                <li>
                  4. If the project is a good fit, Akime prepares a fixed-scope quote.
                </li>
              </ol>
            </section>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-5">
          <Reveal className="md:col-span-2">
            <div className="panel">
              <h3 className="text-h4">Direct</h3>
              <ul className="mt-4 space-y-3 text-body-md">
                <li>
                  <span className="text-charcoal-500">Email</span>
                  <br />
                  <a href={`mailto:${site?.email}`} className="text-charcoal-900 hover:text-gold-500">
                    {site?.email}
                  </a>
                </li>
                <li>
                  <span className="text-charcoal-500">Status</span>
                  <br />
                  <span className="text-charcoal-900">{site?.location}</span>
                </li>
              </ul>
              {site?.socials && site.socials.length > 0 && (
                <>
                  <h4 className="caption mt-6 text-charcoal-500">Elsewhere</h4>
                  <ul className="mt-3 space-y-2 text-body-md">
                    {site.socials.map((s) => (
                      <li key={s.label}>
                        <a href={s.href} target="_blank" rel="noreferrer" className="text-charcoal-900 hover:text-gold-500">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-3">
            <form onSubmit={onSubmit} className="border border-surface-400 bg-surface-100 p-6 md:p-8">
              {status === 'sent' ? (
                <div className="grid place-items-center py-12 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-gold-300 bg-surface-50 text-gold-500">OK</div>
                  <h3 className="mt-4 text-h4">Thanks - message sent.</h3>
                  <p className="mt-2 text-charcoal-500">I'll get back to you within a day or two.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your name" name="name" />
                    <Field label="Email" type="email" name="email" />
                  </div>
                  <div className="mt-4">
                    <Field label="Subject" name="subject" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-body-md font-medium text-charcoal-700">Message</label>
                    <textarea
                      name="message"
                      rows={6}
                      required
                      className="field"
                    />
                  </div>
                  <div className="mt-6">
                    <Button type="submit" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending...' : 'Send message'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </Section>
    </PageTransition>
  );
}

function Field({ label, name, type = 'text' }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="block text-body-md font-medium text-charcoal-700">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="field"
      />
    </label>
  );
}
