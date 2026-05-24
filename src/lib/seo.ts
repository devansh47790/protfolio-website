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

/** <Organization> for the brand behind the site. */
export function organizationSchema(site: SiteSettings) {
  const name = site.businessName || site.ownerName;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': abs(site.siteUrl, '/#organization'),
    name,
    url: site.siteUrl,
    email: site.email,
    logo: abs(site.siteUrl, '/site-icon-192.png'),
    founder: {
      '@type': 'Person',
      name: site.ownerName,
      url: site.siteUrl,
    },
    sameAs: site.socials.map((s) => s.href),
  };
}

/** <LocalBusiness> for Melbourne local-service visibility. */
export function localBusinessSchema(site: SiteSettings) {
  const name = site.businessName || site.ownerName;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': abs(site.siteUrl, '/#localbusiness'),
    name,
    url: site.siteUrl,
    email: site.email,
    telephone: site.phone,
    image: makeAbsoluteUrl(site.siteUrl, site.defaultOgImageUrl || '/site-icon-192.png'),
    priceRange: '$$',
    areaServed: [
      { '@type': 'City', name: site.city || 'Melbourne' },
      { '@type': 'Country', name: site.country || 'AU' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city || 'Melbourne',
      addressRegion: site.region || 'VIC',
      addressCountry: site.country || 'AU',
    },
    founder: {
      '@type': 'Person',
      name: site.ownerName,
    },
    sameAs: site.socials.map((s) => s.href),
  };
}

/** <WebSite> with a sitelinks search box target. */
export function webSiteSchema(site: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs(site.siteUrl, '/#website'),
    name: site.businessName || site.ownerName,
    url: site.siteUrl,
    publisher: {
      '@id': abs(site.siteUrl, '/#organization'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.siteUrl.replace(/\/$/, '')}/projects?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
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
    image: project.imageUrl ? makeAbsoluteUrl(site.siteUrl, project.imageUrl) : undefined,
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
    image: post.coverImageUrl ? makeAbsoluteUrl(site.siteUrl, post.coverImageUrl) : undefined,
    author: { '@type': 'Person', name: site.ownerName, url: site.siteUrl },
    keywords: post.tags.join(', '),
  };
}

function makeAbsoluteUrl(siteUrl: string, url: string): string {
  return url.startsWith('http') ? url : abs(siteUrl, url);
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
