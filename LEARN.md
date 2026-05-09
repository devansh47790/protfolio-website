# How this portfolio works — a walkthrough

You're going to read this once, then refer back to it as you build. Every
file in `src/` is here for a specific reason; this document tells you which
file does what, and how a single page render flows through the codebase.

If something here goes stale because you've added or renamed a file, fix
this doc — it's part of the project, not a throwaway README.

---

## 1. The 30-second mental model

```
URL change ──► React Router ──► Page component ──► useContent(loader)
                                                         │
                                                         ▼
                                                   src/lib/cms.ts
                                                         │
                                                         ▼
                                            src/data/*.ts (today)
                                            Sanity CMS  (tomorrow)
                                                         │
                                                         ▼
                                                Page renders <Section>,
                                                  <Card>, <Button>, etc.
                                                         │
                                                         ▼
                                                  Browser paints
```

The trick that makes this codebase scalable: **pages never know where the
data comes from.** They call `getProjects()` and that's it. When you swap
static files for Sanity, only `src/lib/cms.ts` changes.

---

## 2. Folder map

```
my-portfolio/
├── index.html            ← the only HTML file. React mounts into <div id="root">.
├── package.json          ← npm scripts and dependencies.
├── tailwind.config.js    ← brand colors, fonts, custom animations.
├── vite.config.ts        ← Vite build config (we mostly leave it alone).
├── vercel.json           ← tells Vercel to serve index.html for every route.
├── public/
│   └── _redirects        ← same idea for Netlify.
├── .claude/agents/       ← AI agents that help you ship and maintain the site.
│   ├── deploy-vercel.md
│   ├── sanity-setup.md
│   ├── seo-auditor.md
│   └── content-publisher.md
└── src/
    ├── main.tsx          ← entry point. Wires up Router + Helmet, mounts <App />.
    ├── App.tsx           ← layout shell + the <Routes> table.
    ├── index.css         ← Tailwind imports + a few global styles.
    ├── types/
    │   └── content.ts    ← TypeScript interfaces for every content type.
    ├── data/             ← static content. Mirror of what Sanity will return.
    │   ├── site.ts
    │   ├── projects.ts
    │   ├── services.ts
    │   ├── blogPosts.ts
    │   └── testimonials.ts
    ├── lib/
    │   ├── cms.ts        ← the SINGLE place the rest of the app talks to for data.
    │   └── cn.ts         ← tiny helper for conditional Tailwind classes.
    ├── hooks/
    │   └── useContent.ts ← runs an async loader, gives back { data, loading }.
    ├── components/
    │   ├── ui/           ← Button, Card, Badge, Section, Reveal — generic primitives.
    │   ├── layout/       ← Navbar, Footer, ScrollToTop, PageTransition.
    │   ├── sections/     ← Hero, ProjectCard, ServiceCard, TestimonialCard.
    │   └── seo/Seo.tsx   ← drop into a page to set <title>/<meta>.
    └── pages/            ← one file per route.
        ├── HomePage.tsx
        ├── AboutPage.tsx
        ├── ServicesPage.tsx
        ├── ProjectsPage.tsx
        ├── ProjectDetailPage.tsx
        ├── BlogPage.tsx
        ├── BlogDetailPage.tsx
        ├── ContactPage.tsx
        └── NotFoundPage.tsx
```

---

## 3. Trace a render: what happens when you visit `/projects/realtime-dashboard`

1. **The URL changes.** React Router matches it against the routes in
   `App.tsx`:

   ```tsx
   <Route path="/projects/:slug" element={<ProjectDetailPage />} />
   ```

   The `:slug` is a placeholder; `useParams()` inside the page gives you
   the actual value (`"realtime-dashboard"`).

2. **AnimatePresence prepares the transition.** `App.tsx` wraps the
   `<Routes>` in Framer Motion's `AnimatePresence`. The previous page
   plays its `exit` animation, then the new page plays its `initial → animate`.

3. **`ProjectDetailPage` mounts.** It reads `slug` from the URL, then
   calls `getProjectBySlug(slug)` from `src/lib/cms.ts`. That function
   currently looks the slug up in `src/data/projects.ts` and returns a
   `Project` (or `null` if not found).

4. **The page renders.** It composes:
   - `<PageTransition>` — wraps every page with fade-in/out.
   - `<Seo>` — sets `<title>` and `<meta>` for this specific project.
   - `<Section>` — the layout primitive that handles max-width and padding.
   - `<Reveal>` — fades content up as it scrolls into view.
   - `<Badge>` and `<Button>` — reusable UI primitives.

5. **Tailwind paints.** Each utility class (`px-4`, `text-ink-700`, etc.)
   maps to a CSS rule baked at build time.

6. **Framer Motion animates.** The `whileInView` props on `<Reveal>`
   trigger as you scroll. The `whileHover` on `<Button>` lifts it on
   pointer-over.

You're done. That's the whole loop.

---

## 4. The data layer in detail

There are three layers between a page and your content. They exist so you
can swap the bottom layer (static → Sanity) without touching anything else.

```
┌─────────────────────────────┐
│ pages/ProjectsPage.tsx      │  ← uses useContent(getProjects)
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│ hooks/useContent.ts         │  ← async loader → { data, loading }
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│ lib/cms.ts                  │  ← getProjects(), getBlogPosts(), …
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│ data/projects.ts (today)    │
│ Sanity GROQ query (tomorrow)│
└─────────────────────────────┘
```

### Today: static

`src/data/projects.ts` exports an array. `cms.ts` reads it and returns it
from a `Promise` (so the API matches what Sanity will look like later).

### Tomorrow: Sanity

You'll change one file — `src/lib/cms.ts` — to look like:

```ts
import { sanityClient } from './sanity';

export async function getProjects() {
  return sanityClient.fetch(`*[_type == "project"] | order(date desc)`);
}
```

Pages keep using `getProjects()` exactly the way they do today. **No page
changes.** That's the whole reason for the layer.

The `sanity-setup` agent in `.claude/agents/` walks you through this.

---

## 5. The template flow (UI primitives → sections → pages)

Three layers again, this time on the UI side:

```
┌─────────────────────────────┐
│ pages/HomePage.tsx          │  composes sections together
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│ components/sections/*.tsx   │  Hero, ProjectCard, ServiceCard, …
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│ components/ui/*.tsx         │  Button, Card, Badge, Section, Reveal
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│ Tailwind classes / CSS      │
└─────────────────────────────┘
```

Rule of thumb:
- If it appears on more than one page → make a UI primitive in `components/ui/`.
- If it's a "block" specific to a domain (hero, project card) → `components/sections/`.
- If it only renders on one page → keep it inline in the page.

When a class string starts repeating in three places, **lift it into a
component**. This is the single best habit for keeping the codebase clean.

---

## 6. Adding a new page

1. Create the file: `src/pages/PricingPage.tsx`. Copy the structure of
   `ServicesPage.tsx` and adapt.

2. Open `src/App.tsx` and add:

   ```tsx
   import PricingPage from './pages/PricingPage';
   …
   <Route path="/pricing" element={<PricingPage />} />
   ```

3. Open `src/components/layout/Navbar.tsx` and add the new link to the
   `links` array if you want it in the nav.

4. Add a `<Seo>` tag at the top of the new page so search engines see a
   useful title.

That's it. No build config to touch.

---

## 7. Adding a new project / blog post

Two ways:

**Manual.** Edit `src/data/projects.ts` (or `blogPosts.ts`) and append a
new entry. Match the existing TypeScript shape — your editor will tell
you if you miss a field.

**With the content-publisher agent.** Run the `content-publisher` agent
in `.claude/agents/`. It asks for the fields you need, generates a slug,
picks a cover color, and writes the entry for you.

Once you've connected Sanity, you'll add content from the Sanity Studio
UI instead — no code changes for new content.

---

## 8. Responsive design

Tailwind's breakpoints are mobile-first. A class without a prefix applies
on mobile; `md:` applies from tablet up; `lg:` applies from laptop up.

Example from this codebase:

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
```

- mobile: 1 column
- tablet (≥768px): 2 columns
- laptop (≥1024px): 3 columns

Good places to learn from: `pages/ProjectsPage.tsx`, `components/sections/Hero.tsx`.

Test on real devices — Chrome devtools is good but not perfect. Open the
deployed site on your phone and an iPad if you have one.

---

## 9. Animations — when to reach for what

| Tool                    | When to use                                           |
| ----------------------- | ----------------------------------------------------- |
| Tailwind transitions    | Hover/focus state changes (color, shadow, etc.)       |
| `<Reveal>`              | Anything that should fade in as you scroll to it      |
| `<PageTransition>`      | Already wraps every page — page enter/exit            |
| `motion.button` etc.    | When a single element needs custom hover/tap motion   |
| Framer's `layout` prop  | When list items reorder (see `ProjectsPage` filter)   |

Don't over-animate. The site should feel calm. If two animations fight
for attention, kill the smaller one.

---

## 10. The agents in `.claude/agents/`

These are AI agents that help you ship and maintain the site. To use
them, install Claude Code and type `/agents` in the project directory.

| Agent              | What it does                                                                          |
| ------------------ | ------------------------------------------------------------------------------------- |
| `deploy-vercel`    | Walks you through a first deploy to Vercel/Netlify, including DNS for a custom domain |
| `sanity-setup`     | Replaces the static data layer with Sanity CMS without touching pages                 |
| `seo-auditor`      | Audits SEO, accessibility, performance, link health. Returns a punch list.            |
| `content-publisher`| Adds a new project/blog post to the right data file with the right shape              |

You don't have to use them — they exist to save you typing.

---

## 11. Common things you'll want to change

**Brand color.** `tailwind.config.js`, the `brand` palette. All buttons,
links, accents reference these tokens.

**Site name / tagline / socials.** `src/data/site.ts`.

**Homepage hero text.** `src/data/site.ts` (the `homeContent` export).

**Logo.** Replace the initials in `Navbar.tsx` with an `<img>` or `<svg>`.

**Default page title.** `index.html`.

**Add a contact form backend.** Open `src/pages/ContactPage.tsx` and
replace the `setTimeout` with a real `fetch` call. Formspree, Basin, and
Netlify Forms all work without writing a backend.

---

## 12. Glossary

| Term           | What it means here                                                              |
| -------------- | ------------------------------------------------------------------------------- |
| Component      | A `.tsx` file that exports a function returning JSX.                            |
| Page           | A component rendered by React Router for a specific URL.                        |
| Hook           | A function starting with `use` that wraps React state/effects.                  |
| Data layer     | `src/data/*` + `src/lib/cms.ts` — the source of truth for content.              |
| Section        | A vertical block on a page, e.g. hero, services grid.                           |
| Slug           | The URL-safe id of a project or post, e.g. `realtime-dashboard`.                |
| Token          | A named design value (color, spacing, font) defined in `tailwind.config.js`.    |

Now go build something.

## 13. Adding a CMS later

When you want editor-friendly content without code changes, follow
**SANITY-SETUP.md** at the project root. Summary:

1. Create a Sanity project at sanity.io/manage.
2. `cd studio && npm install && npm run dev` to start the Studio.
3. Set `VITE_SANITY_PROJECT_ID` in `.env.local`.
4. Run `npm run migrate:sanity` to push existing static content.
5. Restart the dev server. Every page now reads from Sanity.

The whole thing is a one-evening migration because the codebase was
shaped for it from day one.
