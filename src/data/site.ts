import type { SiteSettings, HomeContent, AboutContent } from '../types/content';

export const siteSettings: SiteSettings = {
  ownerName: 'Devansh Patel',
  businessName: 'Akime',
  tagline: 'Melbourne WordPress website development for small businesses that need fast, practical, SEO-friendly websites.',
  email: 'hello@akime.com.au',
  location: 'Melbourne, Victoria, Australia',
  city: 'Melbourne',
  region: 'VIC',
  country: 'AU',
  // Public production URL. Used to generate canonical links and the sitemap.
  // Update this when you point your real domain at the deploy.
  siteUrl: 'https://akime.com.au',
  socials: [
    { label: 'GitHub', href: 'https://github.com/devansh47790' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/devanshpatel149/' },
  ],
  resumeUrl: '/resume.pdf',
  defaultOgImageUrl: '/project-images/aurum-poultry-co.jpg',
  seo: {
    title: 'Akime | WordPress Website Development Melbourne',
    description: 'Akime is a Melbourne website development studio led by Devansh Patel, building fast WordPress, WooCommerce, React, and CMS-powered websites.',
    keywords: ['Akime', 'WordPress website development Melbourne', 'WordPress developer Melbourne', 'React developer Melbourne', 'WooCommerce developer Melbourne'],
  },
};

export const homeContent: HomeContent = {
  heroEyebrow: 'Melbourne WordPress Website Development',
  heroHeadline: 'WordPress website development in Melbourne for growing businesses.',
  heroSubhead:
    'Akime builds fast, SEO-friendly WordPress websites, WooCommerce stores, React frontends, and CMS-powered experiences for Australian small businesses that need a site they can trust and update.',
  primaryCta: { label: 'See my work', href: '/projects' },
  secondaryCta: { label: 'Get in touch', href: '/contact' },
  highlightStats: [
    { label: 'WordPress sites', value: '20+' },
    { label: 'Years coding', value: '3' },
    { label: 'Core stack', value: 'WP / React / APIs' },
  ],
  seo: {
    title: 'WordPress Website Development Melbourne | Akime',
    description: 'Akime builds fast, SEO-friendly WordPress websites, WooCommerce stores, React frontends, and CMS-powered sites for Melbourne and Australian small businesses.',
    keywords: ['WordPress website development Melbourne', 'WordPress website design Melbourne', 'small business website design Melbourne', 'WooCommerce developer Melbourne', 'website maintenance Melbourne'],
  },
};

export const aboutContent: AboutContent = {
  intro:
    'I am a frontend engineer who cares deeply about craft: the small details that make an interface feel fast, consistent, and trustworthy.',
  story: [
    'I started building websites as a hobby and quickly fell for the loop of designing, coding, and iterating. Today I focus on WordPress, React, TypeScript, and clean API-driven workflows.',
    'I enjoy turning fuzzy requirements into clear component APIs, and I write code that other engineers can read six months later without crying.',
    'Outside of work, I read about typography, take long walks, and occasionally lose to my friends at chess.',
  ],
  skills: [
    'WordPress', 'WooCommerce', 'React', 'TypeScript (basic)', 'Next.js (basic)', 'Tailwind CSS (basic)',
    'Node.js', 'REST APIs', 'Headless CMS',
    'Accessibility (WCAG)', 'Figma to Code', 'Git / GitHub Actions', 'SEO Core concepts',
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
    {
      year: '2022',
      title: 'Graduated',
      description: 'Finished my bachelors in information technology and systems.',
    },
  ],
  seo: {
    title: 'About Devansh Patel | Web Developer',
    description: 'Learn about Devansh Patel, a web developer focused on WordPress, WooCommerce, React, TypeScript, Tailwind CSS, and clean API-connected websites.',
    keywords: ['Devansh Patel', 'WordPress developer', 'React developer', 'frontend engineer', 'web developer Australia'],
  },
};
