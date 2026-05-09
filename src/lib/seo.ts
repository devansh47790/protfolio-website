/*
  Builders for structured data (JSON-LD) blocks. Pages call these and pass
  the result to <JsonLd data={...} />.

  Reference: https://schema.org and https://developers.google.com/search/docs/appearance/structured-data
*/
import type { Project, BlogPost, SiteSettings } from '../types/content';

/** A short absolute-url helper. */
function abs(siteUrl: string, path: string): string {
  return siteUrl.replace(/\/$/, '') + path;
}

/**
 * <Person> for the homepage. This is what Google uses to build the
 * "knowledge panel" for your name when someone searches for you.
 */
export function personSchema(site: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.ownerName,
    url: site.siteUrl,
    email: site.email,
    jobTitle: 'Frontend Engineer',
    description: site.tagline,
    sameAs: site.socials.map((s) => s.href),
  };
}

/**
 * <CreativeWork> for a project case study. Tells search engines this URL
 * is a single piece of creative work with an author and date.
 */
export function projectSchema(project: Project, site: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: abs(site.siteUrl, '/projects/' + project.slug),
    datePublished: project.date,
    image: project.imageUrl ? abs(site.siteUrl, project.imageUrl) : undefined,
    author: { '@type': 'Person', name: site.ownerName, url: site.siteUrl },
    keywords: project.tags.join(', '),
  };
}

/** <BlogPosting> for a journal entry. */
export function blogPostingSchema(post: BlogPost, site: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: abs(site.siteUrl, '/blog/' + post.slug),
    datePublished: post.publishedAt,
    image: post.coverImageUrl ? abs(site.siteUrl, post.coverImageUrl) : undefined,
    author: { '@type': 'Person', name: site.ownerName, url: site.siteUrl },
    keywords: post.tags.join(', '),
  };
}

/** <BreadcrumbList> -- the small "Home > Projects > Aurum" trail in search results. */
export function breadcrumbsSchema(
  site: SiteSettings,
  trail: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: abs(site.siteUrl, step.path),
    })),
  };
}
