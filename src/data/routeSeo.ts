/*
  routeSeo.ts — Central SEO config for every static route.

  WHY THIS FILE EXISTS
  --------------------
  In a React SPA there is only one index.html. When Google crawls
  /projects or /about, the server returns the same HTML shell with the
  same <title> for every URL — so all pages look identical to crawlers
  that don't run JavaScript.

  This file is the single source of truth that fixes that:

  1. vite-plugin-prerender reads PRERENDER_ROUTES at build time and
     generates a real dist/about/index.html, dist/projects/index.html …
     each with the correct <title> and <meta description> baked in.

  2. The runtime <Seo> component reads from the same data, so the
     browser tab title is always in sync.

  HOW TO EXTEND
  -------------
  • For a new static page (e.g. /pricing), add an entry here AND add
    the route to PRERENDER_ROUTES below.
  • For dynamic routes (/projects/:slug, /blog/:slug) the prerender
    plugin receives the full list of slugs separately — see the
    vite.config.ts for how those are added.
*/

export interface RouteSeoMeta {
  /** Canonical path, starting with "/". */
  path: string;
  /** <title> tag. Keep under 60 chars. */
  title: string;
  /** <meta description>. Keep under 160 chars. */
  description: string;
  /** Optional keywords array. */
  keywords?: string[];
  /** Absolute or root-relative OG image. Falls back to site default. */
  ogImageUrl?: string;
}

/** All static routes that should get their own pre-rendered HTML file. */
export const STATIC_ROUTE_SEO: RouteSeoMeta[] = [
  {
    path: '/',
    title: 'WordPress Website Development Melbourne | Akime',
    description:
      'Akime builds fast, SEO-friendly WordPress websites, WooCommerce stores, React frontends, and CMS-powered sites for Melbourne and Australian small businesses.',
    keywords: [
      'WordPress website development Melbourne',
      'WordPress website design Melbourne',
      'small business website design Melbourne',
      'WooCommerce developer Melbourne',
      'website maintenance Melbourne',
    ],
  },
  {
    path: '/about',
    title: 'About Devansh Patel | Web Developer Melbourne',
    description:
      'Learn about Devansh Patel, a web developer focused on WordPress, WooCommerce, React, TypeScript, Tailwind CSS, and clean API-connected websites.',
    keywords: [
      'Devansh Patel',
      'WordPress developer',
      'React developer',
      'frontend engineer',
      'web developer Australia',
    ],
  },
  {
    path: '/services',
    title: 'WordPress, React & API Services | Akime Melbourne',
    description:
      'Website services for custom WordPress builds, React frontends, WooCommerce, API integrations, performance, SEO, and maintainable content workflows.',
    keywords: [
      'WordPress services',
      'React frontend services',
      'WooCommerce development',
      'API integration services',
      'website performance SEO',
    ],
  },
  {
    path: '/projects',
    title: 'WordPress & React Portfolio | Devansh Patel',
    description:
      'Explore WordPress, WooCommerce, and React projects built by Devansh Patel for service businesses, trades, healthcare, and professional brands.',
    keywords: [
      'WordPress portfolio',
      'React portfolio',
      'WooCommerce projects',
      'custom WordPress theme',
      'company portfolio websites',
    ],
  },
  {
    path: '/blog',
    title: 'Journal | WordPress, React & Web Craft',
    description:
      'Notes from Devansh Patel on WordPress builds, React frontends, API integrations, performance, SEO, and practical website craft.',
    keywords: [
      'WordPress journal',
      'React notes',
      'API integration',
      'frontend development',
      'website performance SEO',
    ],
  },
  {
    path: '/contact',
    title: 'Contact Devansh Patel | Web Developer Melbourne',
    description:
      'Contact Devansh Patel for WordPress websites, React frontends, WooCommerce builds, API integrations, and portfolio website projects.',
    keywords: [
      'contact web developer',
      'hire WordPress developer',
      'React developer contact',
      'WooCommerce developer',
      'API website project',
    ],
  },

  /* ------------------------------------------------------------------
     SEO-TARGETED SERVICE DETAIL PAGES

     Each entry corresponds to a slug in src/data/services.ts and gets its
     own pre-rendered HTML file at dist/services/<slug>/index.html.

     KEEP IN SYNC: title/description here should match the matching
     service.seo block in services.ts so Google sees identical meta
     whether it reads the static prerendered HTML or the JS-rehydrated
     runtime DOM.

     When you add a new service in services.ts:
       1. Append a matching entry below.
       2. Run `npm run build` — the prerender plugin picks it up
          automatically because vite.config.ts passes STATIC_ROUTES.
  ------------------------------------------------------------------ */
  {
    path: '/services/local-seo-melbourne',
    title: 'Local SEO Melbourne | Rank in Google Maps + Local Search | Akime',
    description:
      'Local SEO services for Melbourne small businesses. Rank in Google Maps, the local pack, and "near me" searches. Free audit, no contracts.',
    keywords: [
      'local seo melbourne',
      'local business seo melbourne',
      'seo local business',
      'local seo for small business',
      'google maps ranking melbourne',
    ],
  },
  {
    path: '/services/ecommerce-website-development-melbourne',
    title: 'Ecommerce Website Development Melbourne | WooCommerce & Shopify',
    description:
      'Custom ecommerce website development in Melbourne. WooCommerce and Shopify stores built for speed, SEO, and conversion. Direct developer contact.',
    keywords: [
      'ecommerce web development melbourne',
      'ecommerce website development melbourne',
      'woocommerce developer melbourne',
      'shopify developer melbourne',
      'online store melbourne',
    ],
  },
  {
    path: '/services/seo-services-geelong',
    title: 'SEO Services Geelong | SEO Consultant for Geelong Businesses | Akime',
    description:
      'SEO consultant in Geelong helping local businesses rank higher in Google. Technical SEO, local SEO, content, and link building. Free SEO audit.',
    keywords: [
      'seo consultant geelong',
      'search engine optimisation geelong',
      'geelong seo',
      'search engine optimisation specialist geelong',
      'seo audit geelong',
    ],
  },
  {
    path: '/services/website-design-geelong',
    title: 'Website Design Geelong | Web Design Company Geelong | Akime',
    description:
      'Website design Geelong — custom WordPress, WooCommerce, and React websites for Geelong small businesses. Mobile-first, fast, and SEO-ready.',
    keywords: [
      'geelong website design',
      'web design company geelong',
      'website design geelong',
      'web designer geelong',
    ],
  },
];

/**
 * Look up the SEO meta for a given path.
 * Falls back to the homepage entry if the path is not found.
 */
export function getRouteSeo(path: string): RouteSeoMeta {
  return (
    STATIC_ROUTE_SEO.find((r) => r.path === path) ?? STATIC_ROUTE_SEO[0]
  );
}

/**
 * Just the paths — used by vite-plugin-prerender and the sitemap script
 * to enumerate which routes need their own HTML file.
 */
export const STATIC_ROUTES = STATIC_ROUTE_SEO.map((r) => r.path);
