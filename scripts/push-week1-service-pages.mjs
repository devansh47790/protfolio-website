/*
  Push the four Week 1 service-page documents from ../WEEK-1-PAGE-CONTENT.md
  into Sanity as service documents.

  Usage:
    npm run push:week1-services
*/
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.VITE_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  'production';
const token = process.env.SANITY_TOKEN;

if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_TOKEN in env.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-10-01',
  useCdn: false,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.resolve(rootDir, '..', 'WEEK-1-PAGE-CONTENT.md');

let keyCounter = 0;
function key(prefix = 'k') {
  keyCounter += 1;
  return `${prefix}${keyCounter.toString(36)}`;
}

function slugField(slug) {
  return { _type: 'slug', current: slug };
}

function cleanText(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/\*\*\[([^\]]+)\]\([^)]+\)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function block(text, options = {}) {
  const cleaned = cleanText(text);
  if (!cleaned) return null;

  return {
    _key: key('b'),
    _type: 'block',
    style: options.style || 'normal',
    ...(options.listItem ? { listItem: options.listItem, level: 1 } : {}),
    children: [{ _key: key('s'), _type: 'span', text: cleaned }],
  };
}

function textFromBlock(portableBlock) {
  return portableBlock?.children?.map((child) => child.text || '').join(' ').trim() || '';
}

function markdownToBlocks(markdown) {
  const lines = String(markdown || '').replace(/\r/g, '').split('\n');
  const blocks = [];
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    const created = block(paragraph.join(' '));
    if (created) blocks.push(created);
    paragraph = [];
  }

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith('|')) {
      flushParagraph();
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const tableLine = lines[i].trim();
        if (!/^\|[\s:-]+\|?$/.test(tableLine.replace(/[A-Za-z0-9$,+/().]/g, ''))) {
          const cells = tableLine
            .split('|')
            .map((cell) => cleanText(cell))
            .filter(Boolean);
          if (cells.length) tableLines.push(cells.join(' - '));
        }
        i += 1;
      }
      i -= 1;
      const created = block(tableLines.join('\n'));
      if (created) blocks.push(created);
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      const created = block(bulletMatch[1], { listItem: 'bullet' });
      if (created) blocks.push(created);
      continue;
    }

    const numberMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberMatch) {
      flushParagraph();
      const created = block(numberMatch[1], { listItem: 'number' });
      if (created) blocks.push(created);
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      const created = block(line.replace(/^>\s?/, ''), { style: 'blockquote' });
      if (created) blocks.push(created);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

function parseMeta(metaBlock) {
  const meta = {};
  const keys = {
    'URL slug': 'urlSlug',
    Canonical: 'canonicalUrl',
    'SEO title': 'seoTitle',
    'Meta description': 'metaDescription',
    'OG title': 'ogTitle',
    'OG description': 'ogDescription',
    Robots: 'robots',
  };

  let currentKey = null;

  for (const rawLine of String(metaBlock || '').split('\n')) {
    const line = rawLine.replace(/\r/g, '');
    if (!line.trim() || line.trim().startsWith('```')) continue;

    const keyMatch = line.match(/^([A-Za-z ]+):\s*(.*)$/);
    if (keyMatch && keys[keyMatch[1]]) {
      currentKey = keys[keyMatch[1]];
      const value = keyMatch[2].trim();
      if (value && !/^\(\d+\s+chars?/i.test(value)) meta[currentKey] = value;
      continue;
    }

    if (!currentKey) continue;
    const continuation = line.trim();
    if (!continuation || /^\(\d+\s+chars?/i.test(continuation)) continue;
    meta[currentKey] = [meta[currentKey], continuation].filter(Boolean).join(' ');
  }

  return meta;
}

function getSubsection(pageText, pageNumber, subsectionNumber) {
  const pattern = new RegExp(
    `^## ${pageNumber}\\.${subsectionNumber}[^\\n]*\\n([\\s\\S]*?)(?=^## ${pageNumber}\\.\\d+\\b|^# PAGE \\d+\\b|(?![\\s\\S]))`,
    'm',
  );
  return pageText.match(pattern)?.[1]?.trim() || '';
}

function extractTargetKeywords(blockText) {
  return String(blockText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => cleanText(line.replace(/^-\s*/, '')))
    .filter(Boolean);
}

function extractH1(blockText) {
  return cleanText(String(blockText || '').match(/\*\*([\s\S]*?)\*\*/)?.[1] || blockText);
}

function inferCtaHref(label) {
  const lower = label.toLowerCase();
  if (lower.includes('project') || lower.includes('work')) return '/projects/';
  return '/contact/';
}

function parseHero(blockText) {
  const lines = String(blockText || '')
    .split('\n')
    .map((line) => line.replace(/^>\s?/, '').trim())
    .filter(Boolean);

  const ctaLine = lines.find((line) => line.includes('[') && line.includes(']')) || '';
  const ctaLinks = [...ctaLine.matchAll(/\[([^\]]+)\]/g)].map((match) => {
    const label = cleanText(match[1]).replace(/\s+\u2192\s*$/, '');
    return { label, href: inferCtaHref(label) };
  });

  const copy = lines.filter((line) => line !== ctaLine).join('\n\n');
  return { hero: markdownToBlocks(copy), ctaLinks };
}

function parseBodySections(blockText) {
  return String(blockText || '')
    .split(/^### /m)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [headingLine, ...bodyLines] = part.split('\n');
      return {
        _key: key('sec'),
        heading: cleanText(headingLine),
        body: markdownToBlocks(bodyLines.join('\n')),
      };
    });
}

function parseFaqs(blockText) {
  const faqs = [];
  let current = null;

  for (const rawLine of String(blockText || '').split('\n')) {
    const line = rawLine.replace(/^>\s?/, '').trim();
    if (!line) continue;

    const questionMatch = line.match(/^\*\*([^*]+)\*\*$/);
    if (questionMatch) {
      if (current) faqs.push(current);
      current = {
        _key: key('faq'),
        question: cleanText(questionMatch[1]),
        answer: '',
      };
      continue;
    }

    if (current) {
      current.answer = [current.answer, cleanText(line)].filter(Boolean).join(' ');
    }
  }

  if (current) faqs.push(current);
  return faqs;
}

function parseSchemaJson(blockText) {
  const code = String(blockText || '').match(/```(?:html)?\s*([\s\S]*?)```/)?.[1] || blockText;
  return code
    .replace(/^\s*<script[^>]*>\s*/i, '')
    .replace(/\s*<\/script>\s*$/i, '')
    .trim();
}

function deriveInternalLabel(href, line) {
  const anchor = line.match(/anchor:\s*\*?"([^"]+)"/)?.[1];
  if (anchor) return cleanText(anchor);
  return cleanText(href.replace(/^\/|\/$/g, '').replace(/[-/]/g, ' '));
}

function parseInternalLinks(blockText) {
  return String(blockText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => {
      const href = line.match(/(\/[A-Za-z0-9/_-]+\/?)/)?.[1];
      if (!href) return null;
      return {
        _key: key('in'),
        label: deriveInternalLabel(href, line),
        href,
      };
    })
    .filter(Boolean);
}

function parseExternalLinks(blockText) {
  return String(blockText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => {
      const match = line.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
      if (!match) return null;
      const label = cleanText(match[1]);
      const note = cleanText(line.replace(/^-\s*/, '').replace(match[0], ''));
      return {
        _key: key('out'),
        label,
        href: match[2],
        ...(note ? { note } : {}),
      };
    })
    .filter(Boolean);
}

function keywordsForSeo(targetKeywords) {
  return targetKeywords
    .flatMap((item) => item.split(','))
    .map((item) => cleanText(item.replace(/^(Primary|Supporting):\s*/i, '').replace(/\(.+?\)/g, '')))
    .filter(Boolean)
    .slice(0, 10);
}

function iconForSlug(slug) {
  if (slug.includes('seo')) return 'gauge';
  if (slug.includes('ecommerce')) return 'database';
  if (slug.includes('design')) return 'layers';
  return 'code';
}

function bulletsForSections(sections) {
  const included = sections.find((section) => /included|what.?s included/i.test(section.heading));
  const listBullets = included?.body
    ?.filter((item) => item.listItem)
    .map(textFromBlock)
    .filter(Boolean)
    .slice(0, 3);

  if (listBullets?.length) return listBullets;
  return sections.map((section) => section.heading).slice(0, 3);
}

function parsePages(markdown) {
  const starts = [...markdown.matchAll(/^# PAGE \d+\b[^\n]*$/gm)];
  return starts.map((match, index) => {
    keyCounter = 0;
    const header = match[0];
    const pageNumber = Number(header.match(/^# PAGE (\d+)/)?.[1]);
    const start = match.index + header.length;
    const end = starts[index + 1]?.index ?? markdown.indexOf('\n# Week 2', start);
    const pageText = markdown.slice(start, end === -1 ? undefined : end);
    const title = cleanText(header.replace(/^# PAGE \d+\s+.\s+/, ''));
    const meta = parseMeta(getSubsection(pageText, pageNumber, 1));
    const targetKeywords = extractTargetKeywords(getSubsection(pageText, pageNumber, 2));
    const h1 = extractH1(getSubsection(pageText, pageNumber, 3));
    const { hero, ctaLinks } = parseHero(getSubsection(pageText, pageNumber, 4));
    const sections = parseBodySections(getSubsection(pageText, pageNumber, 5));
    const faqs = parseFaqs(getSubsection(pageText, pageNumber, 6));
    const schemaJson = parseSchemaJson(getSubsection(pageText, pageNumber, 7));
    const internalLinks = parseInternalLinks(getSubsection(pageText, pageNumber, 8));
    const externalLinks = parseExternalLinks(getSubsection(pageText, pageNumber, 9));
    const slug = String(meta.urlSlug || '')
      .replace(/^\/services\//, '')
      .replace(/^\/|\/$/g, '');

    return {
      _id: `service-${slug}`,
      _type: 'service',
      title,
      slug: slugField(slug),
      summary: meta.metaDescription,
      icon: iconForSlug(slug),
      bullets: bulletsForSections(sections),
      canonicalUrl: meta.canonicalUrl,
      robots: meta.robots || 'index, follow',
      ogTitle: meta.ogTitle,
      ogDescription: meta.ogDescription,
      targetKeywords,
      h1,
      hero,
      ctaLinks,
      sections,
      faqs,
      schemaJson,
      internalLinks,
      externalLinks,
      seo: {
        title: meta.seoTitle,
        description: meta.metaDescription,
        keywords: keywordsForSeo(targetKeywords),
      },
    };
  });
}

const markdown = readFileSync(sourcePath, 'utf8');
const pages = parsePages(markdown).filter((page) => page.slug.current);

console.log(`Pushing ${pages.length} Week 1 service pages to Sanity (${projectId}/${dataset})...`);

for (const page of pages) {
  await client.createOrReplace(page);
  console.log(`  -> ${page.title} (${page.slug.current})`);
}

console.log('Done.');
