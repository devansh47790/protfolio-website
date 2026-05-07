import type { SiteSettings, HomeContent, AboutContent } from '../types/content';

export const siteSettings: SiteSettings = {
  ownerName: 'Devansh Patel',
  tagline: 'Frontend Engineer building polished, accessible web experiences.',
  email: 'devansh.s.patel149@gmail.com',
  location: 'Available remote / hybrid',
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
    { label: 'X', href: 'https://x.com/' },
  ],
  resumeUrl: '/resume.pdf',
};

export const homeContent: HomeContent = {
  heroEyebrow: 'Frontend Engineer / React / TypeScript',
  heroHeadline: 'I build modern web products that feel effortless.',
  heroSubhead:
    'Component-driven UIs, thoughtful animation, and clean code that scales. Currently open to full-time and contract work.',
  primaryCta: { label: 'See my work', href: '/projects' },
  secondaryCta: { label: 'Get in touch', href: '/contact' },
  highlightStats: [
    { label: 'Projects shipped', value: '20+' },
    { label: 'Years coding', value: '3' },
    { label: 'Tech stack', value: 'React / TS / Node' },
  ],
};

export const aboutContent: AboutContent = {
  intro:
    'I am a frontend engineer who cares deeply about craft: the small details that make an interface feel fast, consistent, and trustworthy.',
  story: [
    'I started building websites as a hobby and quickly fell for the loop of designing, coding, and iterating. Today I focus on React, TypeScript, and design systems.',
    'I enjoy turning fuzzy requirements into clear component APIs, and I write code that other engineers can read six months later without crying.',
    'Outside of work, I read about typography, take long walks, and occasionally lose to my friends at chess.',
  ],
  skills: [
    'React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS',
    'Framer Motion', 'Node.js', 'REST & GraphQL', 'Sanity / Strapi',
    'Accessibility (WCAG)', 'Figma to Code', 'Git / GitHub Actions',
  ],
  timeline: [
    {
      year: '2026',
      title: 'Building this portfolio',
      description: 'Designed and built a fully responsive React + TypeScript portfolio with a CMS-ready data layer.',
    },
    {
      year: '2025',
      title: 'Frontend projects & freelancing',
      description: 'Shipped landing pages, dashboards, and client websites, focused on performance and clean component APIs.',
    },
    {
      year: '2024',
      title: 'Picked up React seriously',
      description: 'Moved from vanilla JS to React + TypeScript and started thinking in design systems.',
    },
  ],
};
