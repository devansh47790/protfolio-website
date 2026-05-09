import { useState } from 'react';
import type { FormEvent } from 'react';
import PageTransition from '../components/layout/PageTransition';
import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Seo from '../components/seo/Seo';
import { useContent } from '../hooks/useContent';
import { getSiteSettings } from '../lib/cms';

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
        title="Contact Devansh Patel | Web Developer"
        description="Contact Devansh Patel for WordPress websites, React frontends, WooCommerce builds, API integrations, and portfolio website projects."
        keywords={['contact web developer', 'hire WordPress developer', 'React developer contact', 'WooCommerce developer', 'API website project']}
        path="/contact"
      />

      <Section spacing="lg">
        <Reveal>
          <p className="caption text-gold-500">Contact</p>
          <h1 className="mt-3 max-w-3xl">Let's talk.</h1>
          <p className="mt-5 max-w-xl text-body-lg text-charcoal-500">
            I'm available for full-time roles and select contract work. Send a few sentences about what you're working on.
          </p>
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
