# Google SEO Tracker Apps Script

This Google Apps Script writes Akime SEO baseline metrics into a Google Sheet.

It records:

- Google Search Console clicks, impressions, CTR, and average position
- Sitemap URLs found
- Indexed URL count by inspecting sitemap URLs with the URL Inspection API
- PageSpeed Insights performance and Core Web Vitals field metrics when available
- Domain creation date and age from public RDAP data

## Setup

1. Create a Google Sheet named `Akime SEO Tracker`.
2. In the Sheet, open `Extensions > Apps Script`.
3. Copy `Code.gs` into the Apps Script editor.
4. In Apps Script, open `Project Settings` and enable `Show "appsscript.json" manifest file in editor`.
5. Copy `appsscript.json` into the manifest file.
6. Confirm `CONFIG.SEARCH_CONSOLE_SITE_URL` matches the exact Google Search Console property.
   - DNS/domain property: `sc-domain:akime.com.au`
   - URL-prefix property: `https://akime.com.au/`
   -------------------***************************------------------------------------ PENDING
7. In Google Cloud for the Apps Script project, enable:
   - Google Search Console API
   - PageSpeed Insights API
8. Run `setupSeoTracker` once and approve the requested permissions.
9. Run `recordBaseline` to write the first baseline row.
10. Optional: run `createWeeklyMondayTrigger` to update the tracker every Monday at 9 AM.

## Notes

Google Search Console does not expose one exact "indexed pages count" number through the Search Console API. This script uses the practical API-safe version: fetch URLs from `https://akime.com.au/sitemap.xml`, inspect them through the URL Inspection API, and count URLs with an indexed verdict.

New sites may have no PageSpeed field data yet. In that case, the Sheet still records Lighthouse performance scores, while CWV fields may stay blank until Chrome UX Report has enough traffic.

Search Console performance data is delayed, so the script pulls a 28-day range ending 3 days ago.
