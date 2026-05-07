import type { Project } from '../types/content';

export const projects: Project[] = [
  {
    _id: 'p1',
    slug: 'realtime-dashboard',
    title: 'Realtime Analytics Dashboard',
    summary: 'A multi-tenant dashboard with live charts, role-based access, and a CSV export pipeline.',
    category: 'Web App',
    tags: ['React', 'TypeScript', 'WebSockets', 'Recharts'],
    coverColor: 'from-charcoal-700 to-charcoal-900',
    featured: true,
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    problem:
      'A B2B client needed a single pane of glass for dozens of streaming data sources. The previous tool was slow and hard to share with stakeholders.',
    approach: [
      'Designed a token-based theme so each tenant could rebrand without code changes.',
      'Implemented chart virtualization so long sessions stayed under 60ms render budget.',
      'Built a CSV export that streams from a worker so the UI stays responsive.',
    ],
    outcomes: [
      'P50 page interaction down from 1.4s to 220ms.',
      'Onboarded 8 enterprise tenants in the first quarter.',
      'Stakeholder NPS rose from 23 to 64.',
    ],
    date: '2026-02-15',
  },
  {
    _id: 'p2',
    slug: 'cms-marketing-site',
    title: 'CMS-Driven Marketing Site',
    summary: 'A Sanity-backed marketing site with editor-friendly previews and 100/100 Lighthouse.',
    category: 'Marketing',
    tags: ['Next.js', 'Sanity', 'Tailwind'],
    coverColor: 'from-gold-300 to-gold-700',
    featured: true,
    liveUrl: 'https://example.com',
    problem:
      'Marketing wanted to ship landing pages without engineering involvement.',
    approach: [
      'Modeled flexible page-builder blocks in Sanity (hero, feature grid, testimonial, CTA).',
      'Wired live preview so editors saw changes instantly on staging.',
      'Statically generated pages at build time and cached on a global CDN.',
    ],
    outcomes: [
      'Marketing now ships 4-6 pages a week without engineering.',
      'Lighthouse 100 across performance, SEO, accessibility, best practices.',
    ],
    date: '2026-01-10',
  },
  {
    _id: 'p3',
    slug: 'mobile-first-storefront',
    title: 'Mobile-First Storefront',
    summary: 'A clean, animated e-commerce front-end with cart drawer and Stripe checkout.',
    category: 'E-commerce',
    tags: ['React', 'Stripe', 'Framer Motion'],
    coverColor: 'from-surface-600 to-charcoal-700',
    featured: false,
    repoUrl: 'https://github.com/',
    problem:
      'A small brand needed a fast, beautiful storefront that worked great on mid-tier Android devices.',
    approach: [
      'Mobile-first layout, image-light hero, system fonts where it mattered.',
      'Animated cart drawer with focus trap for accessibility.',
      'Stripe checkout sessions to keep PCI scope minimal.',
    ],
    outcomes: [
      'Mobile conversion lifted 18% in the first month.',
      'Average product page LCP under 1.2s on 4G.',
    ],
    date: '2025-11-22',
  },
  {
    _id: 'p4',
    slug: 'design-system-starter',
    title: 'Design System Starter',
    summary: 'An open-source Tailwind + Radix component starter with documentation.',
    category: 'Open Source',
    tags: ['Tailwind', 'Radix', 'Storybook'],
    coverColor: 'from-charcoal-500 to-charcoal-800',
    featured: false,
    repoUrl: 'https://github.com/',
    problem:
      'Most starter kits ship a logo and a button, not a real system.',
    approach: [
      'Defined tokens for color, spacing, radius, motion.',
      'Built 18 primitives (Button, Input, Dialog, Toast) on top of Radix.',
      'Documented every component with usage examples in Storybook.',
    ],
    outcomes: [
      '1.2k GitHub stars in the first 60 days.',
      'Featured in two newsletters.',
    ],
    date: '2025-08-04',
  },
  {
    _id: 'p5',
    slug: 'recipe-finder',
    title: 'Recipe Finder PWA',
    summary: 'An installable PWA that searches recipes by what is already in your fridge.',
    category: 'Web App',
    tags: ['React', 'PWA', 'IndexedDB'],
    coverColor: 'from-surface-400 to-gold-300',
    featured: false,
    problem:
      'I cooked the same five things on repeat and wanted a tool that worked offline at the grocery store.',
    approach: [
      'Built a small ingredient index in IndexedDB for offline search.',
      'Installable PWA with a service worker handling cache strategies.',
      'Keyboard-first UI for fast logging.',
    ],
    outcomes: [
      'Personal cooking variety up. Self-graded.',
    ],
    date: '2025-05-30',
  },
  {
    _id: 'p6',
    slug: 'portfolio-template',
    title: 'This Portfolio',
    summary: 'The site you are looking at. React + Vite + TypeScript + Tailwind + Framer Motion.',
    category: 'Open Source',
    tags: ['React', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion'],
    coverColor: 'from-slate-700 to-charcoal-900',
    featured: true,
    repoUrl: 'https://github.com/',
    problem:
      'I needed a portfolio that felt like me: fast, clean, and a little playful, and that I could maintain easily.',
    approach: [
      'Set up Vite + TS + Tailwind for a fast feedback loop.',
      'Built a small component library so every page reuses the same primitives.',
      'Designed a CMS-shaped data layer so content can move to Sanity without rewriting pages.',
    ],
    outcomes: [
      'Lighthouse 100/100/100/100 on production.',
      'New page = create file + add Route. About 10 minutes.',
    ],
    date: '2026-05-01',
  },
];
