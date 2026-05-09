/*
  <Seo> -- per-page SEO. Sets:
    - <title>
    - meta description
    - canonical link (so duplicate URLs collapse to one)
    - Open Graph (Facebook/LinkedIn/Slack share previews)
    - Twitter card
    - robots noindex (for drafts/staging)

  Implemented as a tiny custom hook (no react-helmet) because react-helmet-async
  doesn't yet support React 19. We patch <head> directly via useEffect.

  Pages call it like:
      <Seo
        title="Projects -- Devansh Patel"
        description="React, WordPress, WooCommerce work."
        path="/projects"
        ogImageUrl="https://devanshpatel.dev/og/projects.png"
      />
*/
import { useEffect } from 'react';
import { siteSettings } from '../../data/site';

interface Props {
  /** The visible browser tab title. Required. */
  title: string;
  /** Meta description for search results and social shares. */
  description?: string;
  /** Comma-separated meta keywords, generated from the array here. */
  keywords?: string[];
  /** Path of this page (e.g. "/projects/aurum-poultry-co"). Used for canonical. */
  path?: string;
  /** Absolute URL to a 1200x630 OG image. Falls back to siteSettings.defaultOgImageUrl. */
  ogImageUrl?: string;
  /** "website" for most pages, "article" for blog posts. */
  ogType?: 'website' | 'article';
  /** Tell search engines to skip indexing (drafts, internal pages). */
  noIndex?: boolean;
}

/**
 * Find a meta tag with the given attribute=value, or create one.
 * Returns the element so the caller can set its `content`.
 */
function upsertMeta(attr: 'name' | 'property', value: string): HTMLMetaElement {
  const selector = 'meta[' + attr + '="' + value + '"]';
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  return el;
}

/** Same idea for <link> tags (canonical). */
function upsertLink(rel: string): HTMLLinkElement {
  const selector = 'link[rel="' + rel + '"]';
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  return el;
}

export default function Seo({
  title,
  description,
  keywords,
  path,
  ogImageUrl,
  ogType = 'website',
  noIndex = false,
}: Props) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    /* Description */
    if (description) {
      upsertMeta('name', 'description').content = description;
    }
    if (keywords && keywords.length > 0) {
      upsertMeta('name', 'keywords').content = keywords.join(', ');
    }

    /* Canonical */
    if (path && siteSettings.siteUrl) {
      const url = siteSettings.siteUrl.replace(/\/$/, '') + path;
      upsertLink('canonical').href = url;
      upsertMeta('property', 'og:url').content = url;
    }

    /* Open Graph */
    upsertMeta('property', 'og:title').content = title;
    upsertMeta('property', 'og:type').content = ogType;
    upsertMeta('property', 'og:site_name').content = siteSettings.ownerName;
    if (description) {
      upsertMeta('property', 'og:description').content = description;
    }

    const finalOgImage = ogImageUrl || siteSettings.defaultOgImageUrl;
    if (finalOgImage) {
      // OG image must be absolute. Resolve relative paths against siteUrl.
      const abs = finalOgImage.startsWith('http')
        ? finalOgImage
        : siteSettings.siteUrl.replace(/\/$/, '') + finalOgImage;
      upsertMeta('property', 'og:image').content = abs;
      upsertMeta('property', 'og:image:width').content = '1200';
      upsertMeta('property', 'og:image:height').content = '630';
    }

    /* Twitter card */
    upsertMeta('name', 'twitter:card').content = finalOgImage ? 'summary_large_image' : 'summary';
    upsertMeta('name', 'twitter:title').content = title;
    if (description) upsertMeta('name', 'twitter:description').content = description;
    if (finalOgImage) {
      const abs = finalOgImage.startsWith('http')
        ? finalOgImage
        : siteSettings.siteUrl.replace(/\/$/, '') + finalOgImage;
      upsertMeta('name', 'twitter:image').content = abs;
    }

    /* Robots */
    upsertMeta('name', 'robots').content = noIndex ? 'noindex, nofollow' : 'index, follow';

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, keywords, path, ogImageUrl, ogType, noIndex]);

  return null;
}
