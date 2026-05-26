import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore – vite-plugin-prerender ships CommonJS, no official TS types yet
import prerender from 'vite-plugin-prerender'

/*
  PRERENDERING — WHY & HOW
  -------------------------
  This site is a React SPA: every URL returns the same index.html, so
  Google's crawler sees identical <title> and <meta description> tags for
  every page (the homepage's).  That tanks your per-page SEO.

  vite-plugin-prerender fixes this by spinning up a headless browser at
  build time, visiting each route, waiting for React to hydrate, and
  saving the fully-rendered HTML to its own file:

      dist/about/index.html   ← has the About page's <title> baked in
      dist/projects/index.html ← has the Projects page's <title> baked in
      … and so on

  When a search crawler hits /about, your server returns the /about HTML
  file directly — no JavaScript needed — so it sees the correct meta tags
  immediately.  Your React app then takes over in the browser as normal.

  STATIC_ROUTES is imported from src/data/routeSeo.ts so there is only
  one place to add a new route.
*/
import { STATIC_ROUTES } from './src/data/routeSeo'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      /*
        staticDir: where Vite writes the built files.
        Must match your `build.outDir` (default: "dist").
      */
      staticDir: 'dist',

      /*
        routes: the list of URL paths to pre-render.
        We pull from routeSeo.ts — the same file that drives
        <Seo> at runtime, so there is never a mismatch.
      */
      routes: STATIC_ROUTES,

      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        /*
          renderAfterDocumentEvent: the prerenderer waits until your
          React app dispatches this custom event before it captures the
          HTML.  This gives React time to finish rendering so the correct
          <title> written by <Seo> ends up in the saved HTML.

          You need to fire the event in your app once it's ready — see
          the useEffect in src/App.tsx which dispatches it.
        */
        renderAfterDocumentEvent: 'app-rendered',
        /*
          headless: "new" uses Chrome's modern headless mode (faster,
          lighter than the legacy "--headless" flag).
        */
        headless: 'new',
      },
    }),
  ],

  build: {
    /*
      Split the bundle into named chunks so the browser can fetch and parse
      them in parallel. Each chunk is also independently cached — when you
      push a code change only the chunk that changed gets re-downloaded.

      Before: one 131 KiB index-xxx.js that blocks the main thread.
      After:  four smaller files, none over ~50 KiB, parsed concurrently.
    */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@sanity')) {
            return 'vendor-sanity';
          }
          return undefined;
        },
      },
    },
  },
})
