/*
  Generates public/sitemap.xml at build time.

  Strategy:
    - Read site URL + slugs from src/data/* directly (Node-compatible).
    - When you switch to Sanity, swap this to fetch from the Sanity client
      using the same projectId/dataset env vars.
    - Run automatically as a postbuild step (see package.json).

  Deploys to Vercel/Netlify will rebuild whenever you push, so the sitemap
  stays in sync with your content.
*/
import { writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

// We import from compiled dist? No -- we import the source TS via tsx? Simpler:
// just maintain the static slugs here and read siteUrl from package.json env.
// For a production build, the better path is to fetch from Sanity. See the
// commented Sanity branch at the bottom.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, '..');

// --------- Helpers --------------------------------------------------

function urlsetXml(urls) {
  const items = urls
    .map((u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq || 'monthly'}</changefreq>
    <priority>${u.priority ?? 0.5}</priority>
  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

// --------- Static-mode generation -----------------------------------
//
// We don't import the .ts data files directly (Node can't load them without
// a transpiler). Instead, this script lists the static routes that exist
// today plus walks the data files via dynamic-import-as-text + regex for
// slugs. This stays simple; switch to Sanity below for a true source of truth.

import { readFile } from 'node:fs/promises';

async function readSlugs(file, exportName) {
  const src = await readFile(resolve(ROOT, file), 'utf8');
  // Match `slug: 'foo-bar'` inside the array entries.
  const slugs = [];
  const re = /slug:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) slugs.push(m[1]);
  void exportName;
  return slugs;
}

async function readSiteUrl() {
  const src = await readFile(resolve(ROOT, 'src/data/site.ts'), 'utf8');
  const m = /siteUrl:\s*'([^']+)'/.exec(src);
  return m ? m[1].replace(/\/$/, '') : 'https://example.com';
}

// --------- Build & write --------------------------------------------

const siteUrl = await readSiteUrl();
const projectSlugs = await readSlugs('src/data/projects.ts', 'projects');
const blogSlugs = await readSlugs('src/data/blogPosts.ts', 'blogPosts');

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${siteUrl}/`,         changefreq: 'monthly', priority: 1.0, lastmod: today },
  { loc: `${siteUrl}/about`,    changefreq: 'monthly', priority: 0.8, lastmod: today },
  { loc: `${siteUrl}/services`, changefreq: 'monthly', priority: 0.8, lastmod: today },
  { loc: `${siteUrl}/projects`, changefreq: 'weekly',  priority: 0.9, lastmod: today },
  { loc: `${siteUrl}/blog`,     changefreq: 'weekly',  priority: 0.7, lastmod: today },
  { loc: `${siteUrl}/contact`,  changefreq: 'yearly',  priority: 0.6, lastmod: today },
  ...projectSlugs.map((slug) => ({
    loc: `${siteUrl}/projects/${slug}`,
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: today,
  })),
  ...blogSlugs.map((slug) => ({
    loc: `${siteUrl}/blog/${slug}`,
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: today,
  })),
];

const xml = urlsetXml(urls);
await writeFile(resolve(ROOT, 'public/sitemap.xml'), xml, 'utf8');
console.log(`Wrote sitemap.xml with ${urls.length} URLs.`);

void pathToFileURL;
