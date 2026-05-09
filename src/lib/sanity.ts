/*
  Sanity client + image URL builder.

  Both are lazily constructed so the app still works when env vars are not
  set (i.e. in local dev before you sign up for Sanity). cms.ts is the only
  consumer; if `sanityClient` is null, cms.ts falls back to static data.

  Required env (set in `.env.local` for dev, in your host's env for prod):
    VITE_SANITY_PROJECT_ID
    VITE_SANITY_DATASET   (defaults to 'production')
    VITE_SANITY_API_VERSION (defaults to '2024-10-01' — pin to today's date when you spin up)
*/
import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-10-01';

/** True when env is configured. cms.ts uses this as the on/off switch. */
export const sanityEnabled = Boolean(projectId);

export const sanityClient: SanityClient | null = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true, // fast public reads via the CDN; flip to false for live editing
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/**
 * Turn a Sanity image reference into a URL. Returns undefined if Sanity isn't
 * configured or if the source is missing.
 *
 * Use it in components like:
 *   const src = urlFor(project.image)?.width(1200).quality(80).url();
 */
export function urlFor(source: SanityImageSource | undefined | null) {
  if (!builder || !source) return undefined;
  return builder.image(source);
}
