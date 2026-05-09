/*
  Static services data. Same shape as the future Sanity service document.
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
    seo: {
      title: 'WordPress Websites | Devansh Patel',
      description: 'Custom WordPress websites that are polished, responsive, easy to update, and built for practical business content workflows.',
      keywords: ['WordPress websites', 'custom WordPress theme', 'responsive WordPress development', 'editor friendly CMS'],
    },
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
    seo: {
      title: 'React Frontends | Devansh Patel',
      description: 'Modern React frontends for portfolios, dashboards, landing pages, and product surfaces with clean components and responsive UI.',
      keywords: ['React frontends', 'React developer', 'TypeScript', 'Tailwind CSS', 'frontend architecture'],
    },
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
    seo: {
      title: 'API Integrations | Devansh Patel',
      description: 'API integration services connecting websites to CMS content, forms, automation tools, dashboards, and third-party platforms.',
      keywords: ['API integrations', 'REST API developer', 'CMS integration', 'form automation', 'third party API'],
    },
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
    seo: {
      title: 'Performance Care | Devansh Patel',
      description: 'Website performance and SEO cleanup for faster loading, better metadata, optimized images, robots, sitemap, and Open Graph.',
      keywords: ['website performance', 'SEO cleanup', 'image optimization', 'Open Graph', 'technical SEO'],
    },
  },
];
