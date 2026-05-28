/*
  cms.ts is the ONLY file that knows where content comes from.

  Each function:
    1. If Sanity is configured (env vars set), fetch from Sanity via GROQ.
    2. Otherwise, return static data from src/data/*.ts.

  This lets you develop locally with no CMS, deploy a static-only build,
  or flip the switch to Sanity by setting VITE_SANITY_PROJECT_ID. Pages
  never change.
*/
import type {
  SiteSettings, HomeContent, AboutContent,
  Project, Service, BlogPost, Testimonial,
} from '../types/content';

import { siteSettings as staticSiteSettings, homeContent as staticHome, aboutContent as staticAbout } from '../data/site';
import { projects as staticProjects } from '../data/projects';
import { services as staticServices } from '../data/services';
import { blogPosts as staticBlogPosts } from '../data/blogPosts';
import { testimonials as staticTestimonials } from '../data/testimonials';

import { sanityClient, sanityEnabled, urlFor } from './sanity';

/* ------------------------------------------------------------------ */
/* GROQ projection helpers                                            */
/* ------------------------------------------------------------------ */

const SEO_PROJECTION = `
  seo {
    title,
    description,
    keywords,
    "ogImageUrl": ogImage.asset->url,
    noIndex
  }
`;

/* ------------------------------------------------------------------ */
/* Site & page-level content                                          */
/* ------------------------------------------------------------------ */

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!sanityEnabled || !sanityClient) return staticSiteSettings;
  const data = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
    ownerName, businessName, tagline, email, phone, location, city, region, country, siteUrl, resumeUrl,
    "defaultOgImageUrl": defaultOgImage.asset->url,
    socials,
    ${SEO_PROJECTION}
  }`);
  return data ?? staticSiteSettings;
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!sanityEnabled || !sanityClient) return staticHome;
  const data = await sanityClient.fetch(`*[_type == "homeContent"][0]{
    heroEyebrow, heroHeadline, heroSubhead,
    primaryCta, secondaryCta, highlightStats,
    ${SEO_PROJECTION}
  }`);
  return data ?? staticHome;
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!sanityEnabled || !sanityClient) return staticAbout;
  const data = await sanityClient.fetch(`*[_type == "aboutContent"][0]{
    intro, story, skills, timeline,
    ${SEO_PROJECTION}
  }`);
  return data ?? staticAbout;
}

/* ------------------------------------------------------------------ */
/* Collections                                                        */
/* ------------------------------------------------------------------ */

const PROJECT_PROJECTION = `
  _id,
  "slug": slug.current,
  title, summary, category, tags, coverColor, featured,
  liveUrl, repoUrl, problem, approach, outcomes, date,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  ${SEO_PROJECTION}
`;

export async function getProjects(): Promise<Project[]> {
  if (!sanityEnabled || !sanityClient) {
    return [...staticProjects].sort((a, b) => b.date.localeCompare(a.date));
  }
  return sanityClient.fetch(`*[_type == "project"] | order(date desc){ ${PROJECT_PROJECTION} }`);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!sanityEnabled || !sanityClient) {
    return [...staticProjects].filter((p) => p.featured).sort((a, b) => b.date.localeCompare(a.date));
  }
  return sanityClient.fetch(
    `*[_type == "project" && featured == true] | order(date desc){ ${PROJECT_PROJECTION} }`,
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!sanityEnabled || !sanityClient) {
    return staticProjects.find((p) => p.slug === slug) ?? null;
  }
  const data = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0]{ ${PROJECT_PROJECTION} }`,
    { slug },
  );
  return data ?? null;
}

/*
  SERVICE_PROJECTION covers both the index card (title/summary/icon/bullets)
  AND the long-form detail page fields (h1, hero, sections, faqs, schemaJson,
  internalLinks, externalLinks, ctaLinks, targetKeywords).
  The Sanity schema mirrors these exactly — when the field doesn't exist on
  a document yet, Sanity returns undefined and the detail page degrades
  gracefully to showing just the index-style summary.
*/
const SERVICE_PROJECTION = `
  _id, "slug": slug.current, title, summary, icon, bullets,
  h1,
  hero[]{
    ...,
    _type == "image" => {
      ...,
      "imageUrl": asset->url,
      alt
    }
  },
  ctaLinks,
  targetKeywords,
  sections[]{
    heading,
    body[]{
      ...,
      _type == "image" => {
        ...,
        "imageUrl": asset->url,
        alt
      }
    }
  },
  faqs[]{ question, answer },
  schemaJson,
  internalLinks[]{ label, href },
  externalLinks[]{ label, href, note },
  canonicalUrl, robots, ogTitle, ogDescription,
  ${SEO_PROJECTION}
`;

export async function getServices(): Promise<Service[]> {
  if (!sanityEnabled || !sanityClient) return staticServices;
  return sanityClient.fetch(`*[_type == "service"]{ ${SERVICE_PROJECTION} }`);
}

/**
 * Fetch a single service by slug. Used by /services/:slug detail page.
 * Returns null if no service with that slug exists (caller renders 404).
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (!sanityEnabled || !sanityClient) {
    return staticServices.find((s) => s.slug === slug) ?? null;
  }
  const data = await sanityClient.fetch(
    `*[_type == "service" && slug.current == $slug][0]{ ${SERVICE_PROJECTION} }`,
    { slug },
  );
  return data ?? null;
}

const BLOG_PROJECTION = `
  _id, "slug": slug.current, title, excerpt,
  body[]{
    ...,
    _type == "image" => {
      ...,
      "imageUrl": asset->url,
      alt
    }
  },
  tags, publishedAt, readingMinutes,
  "coverImageUrl": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  ${SEO_PROJECTION}
`;

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!sanityEnabled || !sanityClient) {
    return [...staticBlogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
  return sanityClient.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc){ ${BLOG_PROJECTION} }`,
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!sanityEnabled || !sanityClient) {
    return staticBlogPosts.find((p) => p.slug === slug) ?? null;
  }
  const data = await sanityClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{ ${BLOG_PROJECTION} }`,
    { slug },
  );
  return data ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityEnabled || !sanityClient) return staticTestimonials;
  return sanityClient.fetch(`*[_type == "testimonial"]{
    _id, quote, author, role, company,
    "avatarUrl": avatar.asset->url
  }`);
}

/* Re-export the image helper so pages don't need to import sanity directly. */
export { urlFor };
