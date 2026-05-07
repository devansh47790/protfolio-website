/*
  CONTENT TYPES
  -------------
  Every piece of content rendered on the site has a TypeScript shape defined here.
  Why one shared file?
    - Pages, components, and the data layer all import the same types,
      so changing a field in one place flows everywhere.
    - When you swap static data for Sanity later, your Sanity schema
      mirrors these types exactly. The rest of the app doesn't need to change.

  Naming convention: every record has an `_id` (mirrors Sanity) and a `slug`
  for anything routed by URL.
*/

export interface SiteSettings {
  ownerName: string;
  tagline: string;
  email: string;
  phone?: string;
  location: string;
  socials: { label: string; href: string }[];
  resumeUrl?: string;
}

export interface HomeContent {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  highlightStats: { label: string; value: string }[];
}

export interface AboutContent {
  intro: string;
  story: string[];        // paragraphs
  skills: string[];
  timeline: { year: string; title: string; description: string }[];
}

export interface Service {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  icon: string;           // lucide-style key, but we use inline SVG (see ui/icons)
  bullets: string[];
}

export interface Project {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;       // used by the filter on /projects
  tags: string[];
  imageUrl?: string;
  coverColor: string;     // tailwind gradient class for the placeholder cover
  featured: boolean;
  liveUrl?: string;
  repoUrl?: string;
  /* Long-form content for the detail page. */
  problem: string;
  approach: string[];
  outcomes: string[];
  date: string;           // ISO date
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];         // paragraphs of plain text (Markdown later)
  tags: string[];
  publishedAt: string;    // ISO date
  readingMinutes: number;
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}
