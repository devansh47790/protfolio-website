/*
  One-shot script to push the static src/data/*.ts content into Sanity.

  Usage (from the repo root, after you've created your Sanity project):

    1. Add to .env.local:
         SANITY_PROJECT_ID=xxxxxxxx
         SANITY_DATASET=production
         SANITY_TOKEN=skXXXXXXXX...   # write-token from sanity.io/manage

    2. Install dev deps if you haven't:
         npm install -D @sanity/client tsx dotenv

    3. Run:
         npx dotenv -e .env.local -- npx tsx scripts/migrate-to-sanity.mjs

  The script is idempotent: it uses createOrReplace, so re-running just
  overwrites the existing documents. Safe to run multiple times.

  After it finishes, set VITE_SANITY_PROJECT_ID + VITE_SANITY_DATASET in
  .env.local and reload the dev server. cms.ts will switch to Sanity
  automatically.
*/
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

import { siteSettings, homeContent, aboutContent } from '../src/data/site.ts';
import { projects } from '../src/data/projects.ts';
import { services } from '../src/data/services.ts';
import { blogPosts } from '../src/data/blogPosts.ts';
import { testimonials } from '../src/data/testimonials.ts';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_TOKEN;

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_TOKEN in env. See script header.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-10-01',
  useCdn: false,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const uploadedImages = new Map();

const baseKeywords = [
  'WordPress developer',
  'React developer',
  'WooCommerce developer',
  'API integration',
  'custom WordPress theme',
  'portfolio website developer',
  'Australia web developer',
];

/* Helpers ---------------------------------------------------------- */

function slugField(slug) {
  return { _type: 'slug', current: slug };
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
}

function metaDescription(text) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= 158) return normalized;
  return normalized.slice(0, 155).replace(/\s+\S*$/, '') + '...';
}

function seoBlock({ title, description, keywords = [], image, noIndex = false }) {
  return {
    title,
    description: metaDescription(description),
    keywords: uniqueList([...keywords, ...baseKeywords]).slice(0, 14),
    ...(image ? { ogImage: image } : {}),
    noIndex,
  };
}

function localPublicFile(publicUrl) {
  if (!publicUrl || !publicUrl.startsWith('/')) return null;
  return path.join(rootDir, 'public', publicUrl.replace(/^\//, ''));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, task, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      const status = error?.statusCode || error?.response?.statusCode;
      if (attempt === attempts || (status && status < 500)) break;
      console.warn(`  -> retrying ${label} after Sanity ${status || 'network'} error (${attempt}/${attempts})`);
      await wait(1200 * attempt);
    }
  }
  throw lastError;
}

async function uploadLocalImage(publicUrl, title) {
  const filePath = localPublicFile(publicUrl);
  if (!filePath || !existsSync(filePath)) return undefined;
  if (uploadedImages.has(filePath)) return uploadedImages.get(filePath);

  const asset = await withRetry(`image upload: ${title}`, () => (
    client.assets.upload('image', createReadStream(filePath), {
      filename: path.basename(filePath),
      title,
    })
  ));

  const image = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: `${title} website screenshot`,
  };
  uploadedImages.set(filePath, image);
  return image;
}

function projectSeo(project, image) {
  return seoBlock({
    title: `${project.title} | ${project.category} Project`,
    description: project.summary,
    keywords: [
      project.title,
      project.category,
      ...project.tags,
      'website portfolio',
      'business website',
    ],
    image,
  });
}

function serviceSeo(service) {
  return seoBlock({
    title: `${service.title} | Devansh Patel`,
    description: service.summary,
    keywords: [service.title, ...service.bullets],
  });
}

function blogSeo(post) {
  return seoBlock({
    title: `${post.title} | Devansh Patel`,
    description: post.excerpt,
    keywords: [...post.tags, 'web development journal', 'frontend notes'],
  });
}

/* Documents -------------------------------------------------------- */

async function pushSiteSettings() {
  const defaultOgImage = await uploadLocalImage('/project-images/aurum-poultry-co.jpg', 'Devansh Patel portfolio');

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ownerName: siteSettings.ownerName,
    tagline: siteSettings.tagline,
    email: siteSettings.email,
    phone: siteSettings.phone,
    location: siteSettings.location,
    siteUrl: siteSettings.siteUrl,
    socials: siteSettings.socials,
    resumeUrl: siteSettings.resumeUrl,
    ...(defaultOgImage ? { defaultOgImage } : {}),
    seo: seoBlock({
      title: 'Devansh Patel | WordPress & React Developer',
      description:
        'Portfolio of Devansh Patel, a WordPress and React developer building WooCommerce websites, custom themes, and API-connected web experiences.',
      keywords: ['Devansh Patel', 'frontend developer', 'web developer portfolio'],
      image: defaultOgImage,
    }),
  });
  console.log('  -> siteSettings');
}

async function pushHomeContent() {
  await client.createOrReplace({
    _id: 'homeContent',
    _type: 'homeContent',
    ...homeContent,
    seo: seoBlock({
      title: 'Devansh Patel | WordPress, React & API Portfolio',
      description:
        'Explore polished WordPress websites, React frontends, WooCommerce builds, and API-connected portfolio work by Devansh Patel.',
      keywords: ['portfolio', 'WordPress portfolio', 'React portfolio', 'API portfolio'],
    }),
  });
  console.log('  -> homeContent');
}

async function pushAboutContent() {
  await client.createOrReplace({
    _id: 'aboutContent',
    _type: 'aboutContent',
    ...aboutContent,
    seo: seoBlock({
      title: 'About Devansh Patel | Web Developer',
      description:
        'Learn about Devansh Patel, a web developer focused on WordPress, WooCommerce, React, TypeScript, Tailwind CSS, and clean API-connected websites.',
      keywords: ['about Devansh Patel', 'frontend engineer', 'WordPress specialist'],
    }),
  });
  console.log('  -> aboutContent');
}

async function pushServices() {
  for (const s of services) {
    await client.createOrReplace({
      _id: `service-${s.slug}`,
      _type: 'service',
      title: s.title,
      slug: slugField(s.slug),
      summary: s.summary,
      icon: s.icon,
      bullets: s.bullets,
      seo: serviceSeo(s),
    });
    console.log('  -> service:', s.title);
  }
}

async function pushProjects() {
  for (const p of projects) {
    const image = await uploadLocalImage(p.imageUrl, p.title);

    await client.createOrReplace({
      _id: `project-${p.slug}`,
      _type: 'project',
      title: p.title,
      slug: slugField(p.slug),
      summary: p.summary,
      category: p.category,
      tags: p.tags,
      coverColor: p.coverColor,
      featured: p.featured,
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl,
      date: p.date,
      problem: p.problem,
      approach: p.approach,
      outcomes: p.outcomes,
      ...(image ? { image } : {}),
      seo: projectSeo(p, image),
    });
    console.log('  -> project:', p.title);
  }
}

async function pushBlogPosts() {
  for (const post of blogPosts) {
    await client.createOrReplace({
      _id: `blogPost-${post.slug}`,
      _type: 'blogPost',
      title: post.title,
      slug: slugField(post.slug),
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      readingMinutes: post.readingMinutes,
      tags: post.tags,
      // Convert plain-text paragraphs to a minimal Portable Text doc.
      body: post.body.map((para) => ({
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: para }],
      })),
      seo: blogSeo(post),
    });
    console.log('  -> blogPost:', post.title);
  }
}

async function pushTestimonials() {
  for (const t of testimonials) {
    await client.createOrReplace({
      _id: `testimonial-${t._id}`,
      _type: 'testimonial',
      quote: t.quote,
      author: t.author,
      role: t.role,
      company: t.company,
    });
    console.log('  -> testimonial:', t.author);
  }
}

/* Run -------------------------------------------------------------- */

console.log(`Pushing static content to Sanity (${projectId}/${dataset})...`);
await pushSiteSettings();
await pushHomeContent();
await pushAboutContent();
await pushServices();
await pushProjects();
await pushBlogPosts();
await pushTestimonials();
console.log('Done. Open Sanity Studio (cd studio && npm run dev) to verify.');
