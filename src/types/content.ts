/*
  CONTENT TYPES
  -------------
  Every piece of content rendered on the site has a TypeScript shape defined here.
  Why one shared file?
    - Pages, components, and the data layer all import the same types,
      so changing a field in one place flows everywhere.
    - The Sanity schema in studio/schemas/* mirrors these shapes exactly,
      so the rest of the app doesn't change when we switch data source.

  Naming convention: every record has an `_id` (mirrors Sanity) and a `slug`
  for anything routed by URL.
*/

/**
 * Reusable SEO block. Every page-level content type embeds one of these.
 * The Sanity schema for this lives at studio/schemas/blocks/seo.ts.
 */
export interface Seo {
  title?: string;          // overrides the auto-generated title
  description?: string;    // <meta name="description">
  keywords?: string[];     // optional, mostly for client-facing SEO checklists
  ogImageUrl?: string;     // absolute URL to a 1200x630 image
  noIndex?: boolean;       // hide from search engines (drafts, staging)
}

export interface SiteSettings {
  ownerName: string;
  businessName?: string;
  tagline: string;
  email: string;
  phone?: string;
  location: string;
  city?: string;
  region?: string;
  country?: string;
  /** Production URL of the site, e.g. https://devanshpatel.dev — used for canonical + sitemap */
  siteUrl: string;
  socials: { label: string; href: string }[];
  resumeUrl?: string;
  /** Default OG image used when a page doesn't override. */
  defaultOgImageUrl?: string;
  seo?: Seo;
}

export interface HomeContent {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  highlightStats: { label: string; value: string }[];
  seo?: Seo;
}

export interface AboutContent {
  intro: string;
  story: string[];        // paragraphs
  skills: string[];
  timeline: { year: string; title: string; description: string }[];
  seo?: Seo;
}

export interface Service {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  icon: string;           // key into ui icon set
  bullets: string[];
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  targetKeywords?: string[];
  h1?: string;
  hero?: BlogBodyBlock[];
  ctaLinks?: { label: string; href: string }[];
  sections?: { heading: string; body: BlogBodyBlock[] }[];
  faqs?: { question: string; answer: string }[];
  schemaJson?: string;
  internalLinks?: { label?: string; href?: string }[];
  externalLinks?: { label?: string; href?: string; note?: string }[];
  seo?: Seo;
}

export interface Project {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;       // used by the filter on /projects
  tags: string[];
  imageUrl?: string;      // hero image for the detail page + card
  imageAlt?: string;      // image alt text from Sanity
  coverColor: string;     // tailwind gradient class for the placeholder cover
  featured: boolean;
  liveUrl?: string;
  repoUrl?: string;
  /* Long-form content for the detail page. */
  problem: string;
  approach: string[];
  outcomes: string[];
  date: string;           // ISO date
  seo?: Seo;
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: BlogBodyBlock[];  // plain text paragraphs locally, Portable Text blocks from Sanity
  tags: string[];
  publishedAt: string;    // ISO date
  readingMinutes: number;
  coverImageUrl?: string;
  coverImageAlt?: string;
  seo?: Seo;
}

export type BlogBodyBlock =
  | string
  | {
      _key?: string;
      _type: 'block';
      style?: 'normal' | 'h2' | 'h3' | 'blockquote';
      listItem?: 'bullet' | 'number';
      markDefs?: { _key?: string; _type?: 'link'; href?: string }[];
      children?: { _key?: string; text?: string; marks?: string[] }[];
    }
  | {
      _key?: string;
      _type: 'image';
      imageUrl?: string;
      alt?: string;
    };

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
}
