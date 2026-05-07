# Devansh Patel — Portfolio

Modern, responsive portfolio + business website built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **React 19** + **TypeScript** + **Vite 8** — fast dev, typed code, instant HMR.
- **Tailwind CSS** — utility-first styling with a custom brand palette (`tailwind.config.js`).
- **Framer Motion** — page transitions and scroll-reveal animations.
- **React Router 7** — client-side routing for 8 pages including dynamic project/blog detail routes.
- **react-helmet-async** — per-page `<title>` and `<meta>` tags for SEO.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## What's in the box

- 8 pages: Home, About, Services, Projects, Project detail, Blog, Blog detail, Contact, plus a 404.
- A reusable component library (Button, Card, Badge, Section, Reveal, Seo).
- Responsive Navbar with animated mobile drawer, sticky on scroll.
- Footer with site map and socials.
- Filterable, animated projects grid.
- A CMS-shaped data layer that mimics what Sanity will return — see `LEARN.md`.
- Page transitions and scroll-reveal animations everywhere.
- Lighthouse-friendly defaults: preconnect for fonts, theme-color, semantic HTML.

## Read this next

**`LEARN.md`** is a tour of the codebase aimed at beginner/intermediate
developers. It explains the data flow, template flow, folder structure,
and how to add new pages or content.

## Agents

`.claude/agents/` contains four AI agents that help you ship and maintain the site:

- **deploy-vercel** — first-time deploy to Vercel/Netlify, including DNS.
- **sanity-setup** — swap the static data layer for Sanity CMS without changing pages.
- **seo-auditor** — audits SEO, accessibility, performance, link health.
- **content-publisher** — adds a new project or blog post to the right data file.

If you use Claude Code, run `/agents` in this directory to use them.

## Editing content (for now, until Sanity is wired up)

- Site-wide settings (name, tagline, email, socials): `src/data/site.ts`
- Homepage hero + stats: `src/data/site.ts` (`homeContent`)
- About page: `src/data/site.ts` (`aboutContent`)
- Projects: `src/data/projects.ts`
- Services: `src/data/services.ts`
- Blog posts: `src/data/blogPosts.ts`
- Testimonials: `src/data/testimonials.ts`

Brand colors live in `tailwind.config.js`.

## Deployment

A `vercel.json` and a `public/_redirects` are included so client-side routing works on either Vercel or Netlify out of the box. Run the `deploy-vercel` agent for a step-by-step walkthrough.

## License

Personal portfolio. Code is yours to reuse.
