/*
  cms.ts is the ONLY file in the project that knows where content comes from.
  Every page calls these functions — never imports the static data files directly.

  Why this matters:
    Today the functions return data from src/data/*.ts (static).
    Tomorrow you swap them to fetch from Sanity (or Strapi, or a JSON API).
    The pages never change.

  Each function returns a Promise to mirror the real API call you'll make later.
  This way, when you wire up Sanity you just replace the body of these functions.

  Example future Sanity version (kept in a comment for reference):

    import { sanityClient } from './sanity';
    export async function getProjects() {
      return sanityClient.fetch(`*[_type == "project"] | order(date desc)`);
    }
*/

import type {
  SiteSettings, HomeContent, AboutContent,
  Project, Service, BlogPost, Testimonial,
} from '../types/content';

import { siteSettings, homeContent, aboutContent } from '../data/site';
import { projects } from '../data/projects';
import { services } from '../data/services';
import { blogPosts } from '../data/blogPosts';
import { testimonials } from '../data/testimonials';

/* Site & page-level content ------------------------------------------------ */

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export async function getHomeContent(): Promise<HomeContent> {
  return homeContent;
}

export async function getAboutContent(): Promise<AboutContent> {
  return aboutContent;
}

/* Collections -------------------------------------------------------------- */

export async function getProjects(): Promise<Project[]> {
  // Sort newest first, like Sanity would.
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}
