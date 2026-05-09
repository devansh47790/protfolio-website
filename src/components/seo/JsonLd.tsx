/*
  <JsonLd> -- writes a <script type="application/ld+json"> block into <head>.

  Why bother: Google reads JSON-LD to build "rich results" -- the cards in
  search with images, ratings, breadcrumbs, etc. It's the cheapest SEO
  upgrade with the highest visual impact.

  Use it via the helpers below: jsonLd.person(), jsonLd.creativeWork(project),
  jsonLd.blogPosting(post), jsonLd.breadcrumbs(...).
*/
import { useEffect } from 'react';

interface Props {
  /** A unique id so multiple JsonLd blocks on the same page don't collide. */
  id: string;
  /** Any plain object. Will be JSON.stringify-ed. */
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ id, data }: Props) {
  useEffect(() => {
    const tagId = 'jsonld-' + id;
    let el = document.getElementById(tagId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = tagId;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      el?.remove();
    };
  }, [id, data]);
  return null;
}
