import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Button from '../ui/Button';
import { siteSettings } from '../../data/site';
import { cn } from '../../lib/cn';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Journal' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors',
        scrolled
          ? 'border-surface-400 bg-surface/90'
          : 'border-transparent bg-surface/70',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="font-display text-h4 text-charcoal-900">
          {siteSettings.ownerName.split(' ')[0]}
          <span className="text-gold-300">.</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'caption transition-colors',
                  isActive
                    ? 'border-b border-gold-300 pb-1 text-charcoal-900'
                    : 'text-charcoal-500 hover:text-charcoal-900',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button to="/contact" size="sm">Hire me</Button>
        </div>

        <button
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center border border-gold-300 md:hidden"
        >
          <span className="relative h-3 w-5">
            <span className={cn(
              'absolute inset-x-0 top-0 h-px bg-charcoal-900 transition-transform',
              open && 'translate-y-1.5 rotate-45',
            )} />
            <span className={cn(
              'absolute inset-x-0 bottom-0 h-px bg-charcoal-900 transition-transform',
              open && '-translate-y-1 -rotate-45',
            )} />
          </span>
        </button>
      </div>

      {open && (
        <div className="overflow-hidden border-t border-surface-400 bg-surface md:hidden">
          <div className="container-page flex flex-col gap-1 py-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }: { isActive: boolean }) =>
                  cn(
                    'caption px-2 py-3',
                    isActive ? 'text-charcoal-900' : 'text-charcoal-500',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-4 px-1">
              <Button to="/contact" className="w-full">Hire me</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
