/*
  Static services data. Same shape as the future Sanity `service` document.
*/
import type { Service } from '../types/content';

export const services: Service[] = [
  {
    _id: 's1',
    slug: 'web-development',
    title: 'Web Development',
    summary: 'Modern marketing sites and product UIs in React + TypeScript.',
    icon: 'code',
    bullets: [
      'Component-driven architecture',
      'Responsive across mobile, tablet, desktop',
      'Accessible by default (WCAG AA)',
    ],
  },
  {
    _id: 's2',
    slug: 'design-systems',
    title: 'Design Systems',
    summary: 'Reusable component libraries with Tailwind, Storybook, and tokens.',
    icon: 'layers',
    bullets: [
      'Token-driven theming',
      'Consistent spacing & typography',
      'Documented for the whole team',
    ],
  },
  {
    _id: 's3',
    slug: 'cms-integration',
    title: 'CMS Integration',
    summary: 'Sanity / Strapi backends so non-technical teammates can ship content.',
    icon: 'database',
    bullets: [
      'Custom schemas for your content',
      'Live preview on staging',
      'Image pipeline & SEO fields',
    ],
  },
  {
    _id: 's4',
    slug: 'performance-and-seo',
    title: 'Performance & SEO',
    summary: 'Lighthouse-100 sites with structured data and fast Core Web Vitals.',
    icon: 'gauge',
    bullets: [
      'Image optimization & lazy loading',
      'Pre-rendered metadata per page',
      'Robots, sitemap, and Open Graph',
    ],
  },
];
