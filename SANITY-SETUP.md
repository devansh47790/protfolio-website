# Sanity setup -- step by step

Estimated time: ~45 minutes start to finish. None of these steps require
me to be in the loop -- you can do them yourself, and the codebase is
already wired to flip on the moment Sanity env vars are present.

## What you already have

The portfolio is split into three layers:

- **Pages** call `getProjects()`, `getBlogPosts()`, etc. from `src/lib/cms.ts`.
- **`src/lib/cms.ts`** is the single switchpoint. If `VITE_SANITY_PROJECT_ID`
  is set, it fetches from Sanity. Otherwise, it returns the static data
  from `src/data/*.ts`. Pages don't change either way.
- **`studio/`** is the Sanity Studio admin UI, with schemas that mirror
  `src/types/content.ts` exactly.

So adding Sanity is just: create the project, install deps, push your
content, set env vars. Reading order below.

## Step 1 -- Create your Sanity account and project

1. Go to https://www.sanity.io/manage and sign in (GitHub, Google, or email).
2. Click **Create new project**.
3. Pick any project name (e.g. "Portfolio"). Use the **Free** plan.
4. After the project is created you'll see a **Project ID** like `2gm1jzpw`.
   Copy it.

You don't need to deploy the studio yet -- we'll do that locally first.

## Step 2 -- Configure the studio

In the project root:

```bash
cd studio
npm install
```

Open `studio/sanity.config.ts` and `studio/sanity.cli.ts`. Replace
`YOUR_PROJECT_ID` with the project ID from step 1, **or** create
`studio/.env` with:

```
SANITY_STUDIO_PROJECT_ID=abc123de
SANITY_STUDIO_DATASET=production
```

Then start the studio locally:

```bash
npm run dev
```

It'll open at `http://localhost:3333`. Sign in with the same account.
You should see empty document types: Site settings, Home page, About page,
Service, Project, Blog post, Testimonial.

## Step 3 -- Get a write token (for the migration script)

In Sanity Manage:

1. Open your project.
2. Go to **API > Tokens**.
3. Click **Add API token**. Name it `migration`. Permissions: **Editor**.
4. Copy the token (it starts with `skyyuEi3nrl5qbn9a8Li47BQA4CN4LoT3kFiyqzH2js1fKEyiDAk6t6WCHThwTT4QFrzlT3U1iSz1c9fpYha1P6ftIkyjaUyDg45OuCsEKR5bI4m4jSlGRj4toBeob2YOtMJTrBirzqsdWPazWIZDcsZrbpVRddQHysMhhAyKfXotJ6cTaPV`). You won't be able to see it again.

## Step 4 -- Set env vars in the React app

In the **project root** (not `studio/`), copy the example env file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
# For the React app to read from Sanity
VITE_SANITY_PROJECT_ID=abc123de
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-10-01

# For the migration script only
SANITY_PROJECT_ID=abc123de
SANITY_DATASET=production
SANITY_TOKEN=skXXXX...
```

`.env.local` is gitignored. **Never commit the SANITY_TOKEN.**

## Step 5 -- Push your existing content into Sanity

From the project root:

```bash
npm install              # picks up @sanity/client and @sanity/image-url
npm run migrate:sanity
```

You'll see output like:

```
Pushing static content to Sanity (abc123de/production)...
  -> siteSettings
  -> homeContent
  -> aboutContent
  -> service: WordPress Websites
  -> project: Aurum Poultry Co.
  ...
Done.
```

Refresh the studio at `http://localhost:3333`. Every document should be there.

> Note: Project images stay as URL strings during the migration. Re-upload
> them in the Studio so Sanity manages the assets and gives you proper
> hot-spot/crop options. The schema's `image` field accepts any size; it's
> served via Sanity's image CDN with on-the-fly resizing.

## Step 6 -- Switch the frontend to Sanity

Just restart the dev server:

```bash
npm run dev
```

Every page now fetches from Sanity. Open `/projects` -- the list comes
from your Studio. Edit a project title in the Studio, save, refresh the
browser. Done.

If something is missing or empty, check the Studio document is published
(not just saved as a draft).

## Step 7 -- Deploy the studio (so you can edit from anywhere)

From `studio/`:

```bash
npm run deploy
```

It'll ask for a hostname, e.g. `devanshpatel-portfolio`. After deploy
you'll have a Studio URL like `https://devanshpatel-portfolio.sanity.studio`.
Bookmark it. You can edit content from your phone.

## Step 8 -- Wire up production env vars

When you deploy the React app to Vercel/Netlify, set the same
`VITE_SANITY_*` env vars in the host's dashboard. Without them, the build
falls back to static data (which is a fine safety net but not what you want).

Vercel: project settings > Environment Variables.
Netlify: Site configuration > Environment variables.

After saving, trigger a rebuild.

## Day-to-day workflow

| Want to do this... | Do this |
| --- | --- |
| Add a new project | Studio: Project > New. Pages auto-update. |
| Tweak homepage text | Studio: Home page. |
| Update SEO for a page | Studio: open the doc, expand the SEO section. |
| Add a blog post | Studio: Blog post > New. Use Portable Text for body. |
| Fix a typo in services | Studio: Service > edit. |
| Make a quick site-wide branding change | Code change in `tailwind.config.js`. |
| Roll back a content change | Studio: doc > History (free tier keeps versions). |

## When Sanity is overkill

If you ever decide a CMS is more friction than help, delete `.env.local`
and the app silently switches back to static data. Nothing else changes.

## Troubleshooting

**"Cannot find module '@sanity/client'"** -- run `npm install` in the project root.

**Studio shows "Project not found"** -- double-check you replaced YOUR_PROJECT_ID
in both `sanity.config.ts` and `sanity.cli.ts` (or set the env var).

**Migration script fails with 401** -- your `SANITY_TOKEN` doesn't have
write access. Generate a new token with **Editor** permission.

**Pages are blank after switching** -- one of the documents may not be
published. Open it in the Studio and click Publish.
