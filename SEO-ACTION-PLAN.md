# SEO Action Plan — akime.com.au
> **Last updated:** 2026-06-01 (auto-updated weekly by Claude)
> **Site:** akime.com.au | **Project:** my-portfolio (React + Vite + Sanity)

---

## How this file works

Claude updates this file every Monday morning. It marks tasks `✅ Done` when the code exists in the repo, `🔄 In Progress` when it's partially built, and `⏳ Pending` when not started. Items marked **⚠️ Needs your input** require you to take action outside the codebase (GSC, Sanity, analytics, etc.).

---

## Phase 0 — Foundation (Completed)

| Task | Status | Completed |
|------|--------|-----------|
| Keyword research — 84 keywords tiered by DA + intent | ✅ Done | 2026-05-27 |
| Moz Keyword Shortlist Excel tracker created | ✅ Done | 2026-05-27 |
| Fix missing `author` + `publisher` meta tags in `index.html` | ✅ Done | 2026-05-25 |
| Create `src/data/routeSeo.ts` — central SEO config for all static routes | ✅ Done | 2026-05-25 |
| Wire `vite-plugin-prerender` in `vite.config.ts` for all 6 static routes | ✅ Done | 2026-05-25 |
| Add `app-rendered` event so prerenderer captures correct `<title>` per page | ✅ Done | 2026-05-25 |
| Diagnose + document H1 / CSR issue (Bing Webmaster flagged) | ✅ Done | 2026-05-23 |

---

## Phase 1 — Week 1 SEO Service Pages (Completed)

Target keywords: high-intent, DA < 35. Pages built as full prerendered long-form with sections, FAQs, JSON-LD.

| Task | Page / Slug | Status | Completed |
|------|-------------|--------|-----------|
| Local SEO Melbourne service page | `/services/local-seo-melbourne` | ✅ Done | 2026-05-28 |
| Ecommerce Website Development Melbourne | `/services/ecommerce-website-development-melbourne` | ✅ Done | 2026-05-28 |
| SEO Services Geelong | `/services/seo-services-geelong` | ✅ Done | 2026-05-28 |
| Website Design Geelong | `/services/website-design-geelong` | ✅ Done | 2026-05-28 |
| `ServiceDetailPage.tsx` component (hero → sections → FAQs → CTA) | — | ✅ Done | 2026-05-28 |
| JSON-LD: Service + FAQPage + BreadcrumbList schemas on each page | — | ✅ Done | 2026-05-28 |
| Footer "Services" column — 4 internal links to SEO pages | — | ✅ Done | 2026-05-28 |
| Sitemap updated — service slugs at priority 0.85 | — | ✅ Done | 2026-05-28 |
| `ServiceCard.tsx` — "Learn more →" affordance + full card link | — | ✅ Done | 2026-05-30 |

**⚠️ Needs your input:**
- [ ] GSC URL Inspection → "Request Indexing" for all 4 service pages (space 24 hrs apart)
- [ ] Re-submit `sitemap.xml` in GSC → Sitemaps
- [ ] Run Rich Results Test on each URL: https://search.google.com/test/rich-results
- [ ] Run PageSpeed Insights on `/services/local-seo-melbourne` — confirm mobile LCP < 2.5s

---

## Phase 2 — Week of 2026-05-31 to 2026-06-05 (CURRENT WEEK)

Target: suburb modifier + pricing modifier pages. All Tier 1 keywords (DA < 20).

| Task | Page / Slug | Priority Score | Status |
|------|-------------|---------------|--------|
| Melbourne suburbs service page — Carlton, Brunswick, Hawthorn, South Yarra, Box Hill, St Kilda as H2 sections | `/services/web-developer-melbourne-suburbs` | ⭐⭐⭐ | ⏳ Pending |
| Affordable web design Melbourne modifier page | `/services/affordable-web-design-melbourne` | ⭐⭐⭐ | ⏳ Pending |
| Freelance web developer Melbourne modifier page | `/services/freelance-web-developer-melbourne` | ⭐⭐⭐ | ⏳ Pending |
| Add all 3 new slugs to `routeSeo.ts` + prerender list | — | — | ⏳ Pending |
| Internal-link new pages from homepage + existing service pages | — | — | ⏳ Pending |

**⚠️ Needs your input:**
- [ ] After Claude builds pages: run `npm run build` to confirm prerender works
- [ ] GSC: Request Indexing for each new URL after deploy
- [ ] Stagger publishes — don't push all 3 on same day from a low-authority domain

---

## Phase 3 — Week of 2026-06-06 to 2026-06-12

Target: Geelong suburbs + industry vertical pages (same template).

| Task | Page / Slug | Keywords | Status |
|------|-------------|----------|--------|
| Geelong suburbs page — Newtown, Belmont, Waurn Ponds, Torquay as H2 sections | `/services/website-design-geelong-suburbs` | `web designer newtown geelong` (DA 15), `web designer belmont geelong` (DA 14), etc. | ⏳ Pending |
| Industry page: Electricians | `/services/website-for-electricians` | `website for electricians` (DA 3) | ⏳ Pending |
| Industry page: Plumbers | `/services/website-for-plumbers` | `website for plumbers` (DA 18) | ⏳ Pending |
| Industry page: Dentists | `/services/website-for-dentists` | `website for dentists` (DA 26, vol 29, transactional) | ⏳ Pending |
| Add homepage "Featured Services" strip linking to all 4 priority SEO pages | — | — | ⏳ Pending |
| Sanity migration for service pages (push static data once `SANITY_TOKEN` is set) | — | — | ⏳ Pending |

**⚠️ Needs your input:**
- [ ] Set `SANITY_TOKEN` in your `.env` when ready to push service data to CMS
- [ ] GSC: Submit new URLs for indexing after deploy

---

## Phase 4 — Month 1–2 (2026-06-13 to 2026-07-31)

Mid-difficulty service pages (18 Tier 3 keywords, DA 20–34, buyer intent) + informational blog content.

| Task | Notes | Status |
|------|-------|--------|
| Build 5–8 industry vertical pages using the same template | Accountants (DA 32), Cafes (DA 35), Restaurants, Lawyers, Real estate agents | ⏳ Pending |
| Blog post: "How much does a website cost in Melbourne?" | Tier 2 informational, DA low, vol medium | ⏳ Pending |
| Blog post: "WordPress vs React — which is right for your business?" | Informational, comparison intent | ⏳ Pending |
| Blog post: "SEO for small business in Melbourne: 2026 guide" | Informational, local trust signal | ⏳ Pending |
| GA4 + Google Tag Manager review — confirm events firing on key CTAs | Need to check after May deploy | ⏳ Pending |
| DA watch list — revisit Tier 5 keywords (DA 35–49) at Month 3 | 27 keywords parked | ⏳ Pending |

---

## Keyword Tier Reference

| Tier | DA Range | Intent | Count | Action |
|------|----------|--------|-------|--------|
| 1 Quick Win | < 20 | Buyer | 16 | Ship now |
| 2 Easy Content | < 20 | Info | 5 | Blog posts |
| 3 Mid Service | 20–34 | Buyer | 18 | Months 1–2 |
| 4 Mid Content | 20–34 | Info | 9 | Blog months 1–2 |
| 5 Watch | 35–49 | Any | 27 | Revisit Month 3 |
| 6 Skip | 50+ | Any | 9 | Ignore |

Full keyword data: `Moz-Keyword-Shortlist-Akime.xlsx` (in `Documents/Claude/Projects/Personal portfolio/`)

---

## Weekly Update Log

| Date | What was done | Inputs needed from you |
|------|---------------|------------------------|
| 2026-05-31 | Initial plan created. Phase 0 + Phase 1 marked complete based on session history. Phase 2 tasks identified as current week. | GSC indexing requests for 4 Phase 1 service pages |
| 2026-06-01 | Checked codebase — no Phase 2 slugs found in services.ts, routeSeo.ts, or sitemap.xml. All Phase 2 tasks remain Pending. No status changes made. | Phase 2 pages need to be built this week before 2026-06-05. GSC indexing for Phase 1 pages still outstanding. |
