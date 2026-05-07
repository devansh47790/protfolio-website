/*
  Static services data. Same shape as the future CMS `service` document.
*/
import type { Service } from '../types/content';

export const services: Service[] = [
  {
    _id: 's1',
    slug: 'wordpress-websites',
    title: 'WordPress Websites',
    summary: 'Custom WordPress sites that are polished, responsive, and simple for clients to update.',
    icon: 'code',
    bullets: [
      'Custom themes and page structures',
      'Editor-friendly content management',
      'Responsive builds for mobile, tablet, desktop',
    ],
  },
  {
    _id: 's2',
    slug: 'react-frontends',
    title: 'React Frontends',
    summary: 'Modern React interfaces for portfolios, dashboards, landing pages, and product surfaces.',
    icon: 'layers',
    bullets: [
      'Component-driven architecture',
      'TypeScript and Tailwind workflows',
      'Smooth motion and accessible interactions',
    ],
  },
  {
    _id: 's3',
    slug: 'api-integrations',
    title: 'API Integrations',
    summary: 'Connect sites to forms, CMS content, booking tools, dashboards, and third-party APIs.',
    icon: 'database',
    bullets: [
      'REST API and CMS data flows',
      'Contact forms and automation hooks',
      'Clean loading, empty, and error states',
    ],
  },
  {
    _id: 's4',
    slug: 'performance-care',
    title: 'Performance Care',
    summary: 'Optimization and cleanup for websites that need to feel faster, clearer, and more reliable.',
    icon: 'gauge',
    bullets: [
      'Image optimization and lazy loading',
      'Pre-rendered metadata per page',
      'Robots, sitemap, and Open Graph',
    ],
  },
];
