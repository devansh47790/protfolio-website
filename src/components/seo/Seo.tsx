/*
  <Seo> -- drop into any page to set <title> and <meta> tags.

  Originally we used react-helmet-async, but that library hasn't shipped
  React 19 support yet. Instead, this tiny custom component does the same
  thing using useEffect: it patches <head> directly when the page mounts,
  and restores the previous title when the page unmounts.

  Pages call it like:
      <Seo title="About -- Devansh Patel" description="..." />
*/
import { useEffect } from 'react';

interface Props {
  title: string;
  description?: string;
}

/**
 * Find a <meta> tag with the given attribute=value, or create one.
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

export default function Seo({ title, description }: Props) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    upsertMeta('property', 'og:title').content = title;
    upsertMeta('property', 'og:type').content = 'website';

    if (description) {
      upsertMeta('name', 'description').content = description;
      upsertMeta('property', 'og:description').content = description;
    }

    // Restore the previous title when the page unmounts. We don't bother
    // restoring meta tags -- the next page that mounts will overwrite them.
    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);

  return null;
}
