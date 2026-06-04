import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { STATIC_ROUTE_SEO, getRouteSeo } from '../src/data/routeSeo';
import { aboutContent, homeContent, siteSettings } from '../src/data/site';
import { blogPosts } from '../src/data/blogPosts';
import { projects } from '../src/data/projects';
import { services } from '../src/data/services';
import {
  blogPostingSchema,
  breadcrumbsSchema,
  localBusinessSchema,
  organizationSchema,
  personSchema,
  projectSchema,
  webSiteSchema,
} from '../src/lib/seo';
import type { BlogBodyBlock, BlogPost, Project, Service } from '../src/types/content';

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

interface StaticPage {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImageUrl?: string;
  ogType?: 'website' | 'article';
  body: string;
  jsonLd?: JsonLdData;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');
const siteUrl = siteSettings.siteUrl.replace(/\/$/, '');
let pageProjects: Project[] = projects;
let pageServices: Service[] = services;
let pageBlogPosts: BlogPost[] = blogPosts;

function escapeHtml(value: string | number | undefined | null) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizePath(path: string) {
  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

function absoluteUrl(urlOrPath?: string) {
  if (!urlOrPath) return undefined;
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  return `${siteUrl}${urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`}`;
}

async function loadLocalEnv() {
  try {
    const src = await readFile(resolve(root, '.env.local'), 'utf8');
    for (const line of src.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      process.env[key] ||= value;
    }
  } catch {
    // Local env is optional. Static data is the fallback.
  }
}

async function sanityQuery<T>(query: string): Promise<T[] | null> {
  const projectId = process.env.VITE_SANITY_PROJECT_ID;
  const dataset = process.env.VITE_SANITY_DATASET || 'production';
  const apiVersion = process.env.VITE_SANITY_API_VERSION || '2024-10-01';
  if (!projectId) return null;

  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Sanity query failed: ${response.status}`);
  const data = await response.json() as { result?: T[] };
  return data.result ?? [];
}

async function loadSanityContent() {
  const seoProjection = `
    seo {
      title,
      description,
      keywords,
      "ogImageUrl": ogImage.asset->url,
      noIndex
    }
  `;

  try {
    const [sanityProjects, sanityServices, sanityPosts] = await Promise.all([
      sanityQuery<Project>(`*[_type == "project"] | order(date desc){
        _id,
        "slug": slug.current,
        title, summary, category, tags, coverColor, featured,
        liveUrl, repoUrl, problem, approach, outcomes, date,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        ${seoProjection}
      }`),
      sanityQuery<Service>(`*[_type == "service"]{
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
        ${seoProjection}
      }`),
      sanityQuery<BlogPost>(`*[_type == "blogPost"] | order(publishedAt desc){
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
        ${seoProjection}
      }`),
    ]);

    if (sanityProjects?.length) pageProjects = sanityProjects;
    if (sanityServices?.length) pageServices = sanityServices;
    if (sanityPosts?.length) pageBlogPosts = sanityPosts;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Falling back to static content for static HTML: ${message}`);
  }
}

function pageUrl(path: string) {
  const normalized = normalizePath(path);
  return normalized === '/' ? `${siteUrl}/` : `${siteUrl}${normalized}`;
}

function renderLinks(links: { label: string; href: string }[]) {
  if (links.length === 0) return '';

  return `<ul class="mt-6 space-y-2">
    ${links
      .map(
        (link) =>
          `<li><a class="text-gold-500 underline" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`,
      )
      .join('\n')}
  </ul>`;
}

function pageShell({
  eyebrow,
  heading,
  description,
  paragraphs = [],
  links = [],
  extra = '',
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  paragraphs?: string[];
  links?: { label: string; href: string }[];
  extra?: string;
}) {
  return `<main>
    <section class="border-b border-surface-400">
      <div class="container-page pb-20 pt-20 md:pb-28 md:pt-28 lg:pb-32 lg:pt-32">
        <p class="caption text-gold-500">${escapeHtml(eyebrow)}</p>
        <h1 class="mt-8 max-w-4xl">${escapeHtml(heading)}</h1>
        ${
          description
            ? `<p class="mt-8 max-w-2xl text-body-lg text-charcoal-500">${escapeHtml(description)}</p>`
            : ''
        }
        ${paragraphs
          .map((paragraph) => `<p class="mt-5 max-w-3xl text-body-md text-charcoal-700">${escapeHtml(paragraph)}</p>`)
          .join('\n')}
        ${renderLinks(links)}
      </div>
    </section>
    ${extra}
  </main>`;
}

function listSection(
  heading: string,
  items: { title: string; href: string; description?: string; meta?: string }[],
) {
  return `<section class="container-page py-14">
    <h2 class="text-h3">${escapeHtml(heading)}</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      ${items
        .map(
          (item) => `<article class="border border-surface-400 bg-surface-100 p-6">
            ${item.meta ? `<p class="caption text-charcoal-500">${escapeHtml(item.meta)}</p>` : ''}
            <h3 class="mt-2 text-h4"><a href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a></h3>
            ${item.description ? `<p class="mt-3 text-body-md text-charcoal-500">${escapeHtml(item.description)}</p>` : ''}
          </article>`,
        )
        .join('\n')}
    </div>
  </section>`;
}

function blockText(block: BlogBodyBlock) {
  if (typeof block === 'string') return block;
  if ('children' in block && Array.isArray(block.children)) {
    return block.children.map((child) => child.text ?? '').join('');
  }
  return '';
}

function blockTexts(blocks?: BlogBodyBlock[]) {
  return (blocks ?? []).map(blockText).filter(Boolean);
}

function serviceJsonLd(service: Service) {
  const items: Record<string, unknown>[] = [
    breadcrumbsSchema(siteSettings, [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
  ];

  if (service.schemaJson) {
    try {
      items.push(JSON.parse(service.schemaJson) as Record<string, unknown>);
    } catch {
      items.push(fallbackServiceSchema(service));
    }
  } else {
    items.push(fallbackServiceSchema(service));
  }

  if (service.faqs?.length) {
    items.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return items;
}

function fallbackServiceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    url: pageUrl(`/services/${service.slug}`),
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    areaServed: [
      { '@type': 'City', name: siteSettings.city || 'Melbourne' },
      { '@type': 'Country', name: siteSettings.country || 'AU' },
    ],
  };
}

function servicePage(service: Service): StaticPage {
  const seoTitle = service.seo?.title ?? service.ogTitle ?? `${service.title} | Akime`;
  const seoDescription = service.seo?.description ?? service.ogDescription ?? service.summary;
  const heroText = service.hero?.length ? blockTexts(service.hero) : [service.summary];
  const sectionHtml = (service.sections ?? [])
    .map(
      (section) => `<section class="container-page py-12">
        <h2 class="text-h3">${escapeHtml(section.heading)}</h2>
        ${blockTexts(section.body)
          .map((paragraph) => `<p class="mt-4 max-w-3xl text-body-md text-charcoal-700">${escapeHtml(paragraph)}</p>`)
          .join('\n')}
      </section>`,
    )
    .join('\n');

  return {
    path: `/services/${service.slug}`,
    title: seoTitle,
    description: seoDescription,
    keywords: service.seo?.keywords ?? service.targetKeywords ?? [service.title],
    ogImageUrl: service.seo?.ogImageUrl,
    body: pageShell({
      eyebrow: 'Service',
      heading: service.h1 ?? service.title,
      description: heroText[0] ?? service.summary,
      paragraphs: heroText.slice(1),
      links: [
        { label: 'Start a project', href: '/contact' },
        { label: 'All services', href: '/services' },
      ],
      extra: `${service.bullets?.length ? listSection('Included', service.bullets.map((bullet) => ({ title: bullet, href: `/services/${service.slug}` }))) : ''}${sectionHtml}`,
    }),
    jsonLd: serviceJsonLd(service),
  };
}

function projectPage(project: Project): StaticPage {
  return {
    path: `/projects/${project.slug}`,
    title: project.seo?.title ?? `${project.title} | Devansh Patel`,
    description: project.seo?.description ?? project.summary,
    keywords: project.seo?.keywords ?? [
      project.title,
      project.category,
      ...(project.tags ?? []),
      'WordPress portfolio',
      'website project',
    ],
    ogImageUrl: project.seo?.ogImageUrl ?? project.imageUrl,
    body: pageShell({
      eyebrow: project.category,
      heading: project.title,
      description: project.summary,
      paragraphs: [project.problem, ...(project.approach ?? []), ...(project.outcomes ?? [])].filter(Boolean),
      links: [
        ...(project.liveUrl ? [{ label: 'Visit website', href: project.liveUrl }] : []),
        { label: 'Back to projects', href: '/projects' },
      ],
    }),
    jsonLd: [
      projectSchema({ ...project, tags: project.tags ?? [] }, siteSettings),
      breadcrumbsSchema(siteSettings, [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: project.title, path: `/projects/${project.slug}` },
      ]),
    ],
  };
}

function blogPage(post: BlogPost): StaticPage {
  return {
    path: `/blog/${post.slug}`,
    title: post.seo?.title ?? `${post.title} | Devansh Patel`,
    description: post.seo?.description ?? post.excerpt,
    keywords: post.seo?.keywords ?? [...(post.tags ?? []), 'web development journal', 'frontend notes'],
    ogImageUrl: post.seo?.ogImageUrl ?? post.coverImageUrl,
    ogType: 'article',
    body: pageShell({
      eyebrow: 'Journal',
      heading: post.title,
      description: post.excerpt,
      paragraphs: (post.body ?? []).map((block) => (typeof block === 'string' ? block : blockText(block))).filter(Boolean),
      links: [{ label: 'Back to blog', href: '/blog' }],
    }),
    jsonLd: [
      blogPostingSchema({ ...post, tags: post.tags ?? [] }, siteSettings),
      breadcrumbsSchema(siteSettings, [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };
}

function staticPages(): StaticPage[] {
  const homeMeta = homeContent.seo ?? getRouteSeo('/');
  const aboutMeta = aboutContent.seo ?? getRouteSeo('/about');
  const servicesMeta = getRouteSeo('/services');
  const projectsMeta = getRouteSeo('/projects');
  const blogMeta = getRouteSeo('/blog');
  const contactMeta = getRouteSeo('/contact');

  return [
    {
      path: '/',
      title: homeMeta.title,
      description: homeMeta.description,
      keywords: homeMeta.keywords,
      ogImageUrl: homeMeta.ogImageUrl,
      body: pageShell({
        eyebrow: homeContent.heroEyebrow,
        heading: homeContent.heroHeadline,
        description: homeContent.heroSubhead,
        links: [
          { label: 'See my work', href: '/projects' },
          { label: 'Get in touch', href: '/contact' },
        ],
        extra: `${listSection(
          'Featured projects',
          pageProjects
            .filter((project) => project.featured)
            .map((project) => ({
              title: project.title,
              href: `/projects/${project.slug}`,
              description: project.summary,
              meta: project.category,
            })),
        )}${listSection(
          'Services',
          pageServices.map((service) => ({
            title: service.title,
            href: `/services/${service.slug}`,
            description: service.summary,
          })),
        )}`,
      }),
      jsonLd: [
        organizationSchema(siteSettings),
        localBusinessSchema(siteSettings),
        webSiteSchema(siteSettings),
        personSchema(siteSettings),
        breadcrumbsSchema(siteSettings, [{ name: 'Home', path: '/' }]),
      ],
    },
    {
      path: '/about',
      title: aboutMeta.title,
      description: aboutMeta.description,
      keywords: aboutMeta.keywords,
      ogImageUrl: aboutMeta.ogImageUrl,
      body: pageShell({
        eyebrow: 'About me',
        heading: aboutContent.intro,
        paragraphs: aboutContent.story,
        links: [
          { label: 'Contact Devansh', href: '/contact' },
          { label: 'View projects', href: '/projects' },
        ],
        extra: listSection(
          'Skills',
          aboutContent.skills.map((skill) => ({ title: skill, href: '/about' })),
        ),
      }),
      jsonLd: breadcrumbsSchema(siteSettings, [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]),
    },
    {
      path: '/services',
      title: servicesMeta.title,
      description: servicesMeta.description,
      keywords: servicesMeta.keywords,
      ogImageUrl: servicesMeta.ogImageUrl,
      body: pageShell({
        eyebrow: 'Services',
        heading: 'WordPress, React, API and SEO website services',
        description: servicesMeta.description,
        extra: listSection(
          'Website services',
          pageServices.map((service) => ({
            title: service.title,
            href: `/services/${service.slug}`,
            description: service.summary,
          })),
        ),
      }),
      jsonLd: breadcrumbsSchema(siteSettings, [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
    },
    {
      path: '/projects',
      title: projectsMeta.title,
      description: projectsMeta.description,
      keywords: projectsMeta.keywords,
      ogImageUrl: projectsMeta.ogImageUrl,
      body: pageShell({
        eyebrow: 'Projects',
        heading: 'WordPress website portfolio',
        description: projectsMeta.description,
        extra: listSection(
          'Portfolio projects',
          pageProjects.map((project) => ({
            title: project.title,
            href: `/projects/${project.slug}`,
            description: project.summary,
            meta: project.category,
          })),
        ),
      }),
      jsonLd: breadcrumbsSchema(siteSettings, [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
      ]),
    },
    {
      path: '/blog',
      title: blogMeta.title,
      description: blogMeta.description,
      keywords: blogMeta.keywords,
      ogImageUrl: blogMeta.ogImageUrl,
      body: pageShell({
        eyebrow: 'Journal',
        heading: 'Notes on web craft',
        description: blogMeta.description,
        extra: listSection(
          'Articles',
          pageBlogPosts.map((post) => ({
            title: post.title,
            href: `/blog/${post.slug}`,
            description: post.excerpt,
            meta: post.publishedAt,
          })),
        ),
      }),
      jsonLd: breadcrumbsSchema(siteSettings, [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
      ]),
    },
    {
      path: '/contact',
      title: contactMeta.title,
      description: contactMeta.description,
      keywords: contactMeta.keywords,
      ogImageUrl: contactMeta.ogImageUrl,
      body: pageShell({
        eyebrow: 'Contact',
        heading: "Let's talk.",
        description:
          "Contact Devansh Patel for WordPress websites, React frontends, WooCommerce builds, API integrations, and portfolio website projects.",
        links: [
          { label: siteSettings.email, href: `mailto:${siteSettings.email}` },
          ...siteSettings.socials,
        ],
      }),
      jsonLd: breadcrumbsSchema(siteSettings, [
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
    },
  ];
}

function buildHead(page: StaticPage, assetTags: string[]) {
  const canonical = pageUrl(page.path);
  const image = absoluteUrl(page.ogImageUrl ?? siteSettings.defaultOgImageUrl);
  const keywords = page.keywords?.filter(Boolean).join(', ');
  const jsonLd = page.jsonLd ? JSON.stringify(page.jsonLd) : '';

  return `<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/site-icon-192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ''}
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="${escapeHtml(siteSettings.ownerName)}" />
    <meta name="publisher" content="${escapeHtml(siteSettings.businessName || siteSettings.ownerName)}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:type" content="${page.ogType ?? 'website'}" />
    <meta property="og:site_name" content="${escapeHtml(siteSettings.businessName || siteSettings.ownerName)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    ${image ? '<meta property="og:image:width" content="1200" />' : ''}
    ${image ? '<meta property="og:image:height" content="630" />' : ''}
    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
    <meta name="theme-color" content="#000000" />
    ${jsonLd ? `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>` : ''}
    <link rel="preconnect" href="https://2gm1jzpw.apicdn.sanity.io" crossorigin />
    ${assetTags.join('\n    ')}
  </head>`;
}

function canonicalRuntimeScript() {
  return `<script>
    (function () {
      var canonicalHost = 'akime.com.au';
      var canonicalOrigin = 'https://' + canonicalHost;
      var path = window.location.pathname || '/';
      if (path === '/index.html') path = '/';
      if (path.length > 1) path = path.replace(/\\/+$/, '').replace(/\\.html$/, '');
      var canonicalUrl = canonicalOrigin + path;
      var redirectHosts = [
        'www.akime.com.au',
        'portfolio-website-df88d.web.app',
        'portfolio-website-df88d.firebaseapp.com'
      ];

      if (redirectHosts.indexOf(window.location.hostname) !== -1) {
        window.location.replace(canonicalUrl + window.location.search + window.location.hash);
        return;
      }

      var canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      if (!canonical.parentNode) document.head.appendChild(canonical);

      var robots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow';
      if (!robots.parentNode) document.head.appendChild(robots);
    })();
  </script>`;
}

function renderHtml(page: StaticPage, assetTags: string[]) {
  return `<!doctype html>
<html lang="en">
  ${buildHead(page, assetTags)}
  <body>
    <div id="root">
      ${page.body}
    </div>
    ${canonicalRuntimeScript()}
  </body>
</html>
`;
}

async function writeRoute(page: StaticPage, html: string) {
  const normalized = normalizePath(page.path);

  if (normalized === '/') {
    await writeFile(resolve(dist, 'index.html'), html, 'utf8');
    return;
  }

  const route = normalized.slice(1);
  const htmlFile = resolve(dist, `${route}.html`);
  const indexFile = resolve(dist, route, 'index.html');
  await mkdir(dirname(htmlFile), { recursive: true });
  await mkdir(dirname(indexFile), { recursive: true });
  await writeFile(htmlFile, html, 'utf8');
  await writeFile(indexFile, html, 'utf8');
}

function extractAssetTags(template: string) {
  const head = /<head>([\s\S]*?)<\/head>/i.exec(template)?.[1] ?? '';
  return Array.from(
    head.matchAll(/<(?:script type="module"[\s\S]*?<\/script>|link rel="(?:modulepreload|stylesheet)"[\s\S]*?>)/gi),
    (match) => match[0].trim(),
  );
}

function llmsTxt(pages: StaticPage[]) {
  const corePaths = new Set(STATIC_ROUTE_SEO.map((route) => route.path));
  const corePages = pages.filter((page) => corePaths.has(page.path) && !page.path.startsWith('/services/'));

  return `# Akime

> Akime is a Melbourne website development studio led by Devansh Patel. The site covers WordPress website development, WooCommerce, React frontends, API integrations, local SEO, service pages, portfolio case studies, and web development articles.

Website: ${siteUrl}
Contact: ${siteSettings.email}
Primary audience: Australian small businesses, local service businesses, ecommerce brands, recruiters, and collaborators.
Sitemap: ${siteUrl}/sitemap.xml

## Core Pages
${corePages.map((page) => `- [${page.title}](${pageUrl(page.path)}): ${page.description}`).join('\n')}

## Services
${pageServices
  .map((service) => {
    const page = pages.find((item) => item.path === `/services/${service.slug}`);
    return `- [${page?.title ?? service.title}](${pageUrl(`/services/${service.slug}`)}): ${page?.description ?? service.summary}`;
  })
  .join('\n')}

## Projects
${pageProjects.map((project) => `- [${project.title}](${pageUrl(`/projects/${project.slug}`)}): ${project.summary}`).join('\n')}

## Blog
${pageBlogPosts.map((post) => `- [${post.title}](${pageUrl(`/blog/${post.slug}`)}): ${post.excerpt}`).join('\n')}
`;
}

function llmsFullTxt(pages: StaticPage[]) {
  return `${llmsTxt(pages)}

## Project Details
${pageProjects
  .map(
    (project) => `### ${project.title}
URL: ${pageUrl(`/projects/${project.slug}`)}
Category: ${project.category}
Summary: ${project.summary}
Problem: ${project.problem ?? ''}
Approach: ${(project.approach ?? []).join(' ')}
Outcomes: ${(project.outcomes ?? []).join(' ')}
Tags: ${(project.tags ?? []).join(', ')}
`,
  )
  .join('\n')}

## Service Details
${pageServices
  .map(
    (service) => `### ${service.title}
URL: ${pageUrl(`/services/${service.slug}`)}
Summary: ${service.summary}
Keywords: ${(service.seo?.keywords ?? service.targetKeywords ?? []).join(', ')}
`,
  )
  .join('\n')}

## Blog Details
${pageBlogPosts
  .map(
    (post) => `### ${post.title}
URL: ${pageUrl(`/blog/${post.slug}`)}
Published: ${post.publishedAt}
Summary: ${post.excerpt}
Tags: ${(post.tags ?? []).join(', ')}
`,
  )
  .join('\n')}
`;
}

async function main() {
  await loadLocalEnv();
  await loadSanityContent();

  const template = await readFile(resolve(dist, 'index.html'), 'utf8');
  const assetTags = extractAssetTags(template);
  const pages = [
    ...staticPages(),
    ...pageServices.map(servicePage),
    ...pageProjects.map(projectPage),
    ...pageBlogPosts.map(blogPage),
  ];

  const uniquePages = Array.from(new Map(pages.map((page) => [normalizePath(page.path), page])).values());

  for (const page of uniquePages) {
    await writeRoute(page, renderHtml(page, assetTags));
  }

  await writeFile(resolve(dist, 'llms.txt'), llmsTxt(uniquePages), 'utf8');
  await writeFile(resolve(dist, 'llms-full.txt'), llmsFullTxt(uniquePages), 'utf8');
  console.log(`Generated static HTML for ${uniquePages.length} routes plus llms.txt.`);
}

await main();
