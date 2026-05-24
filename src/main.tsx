/*
  The entry point. main.tsx is the very first JavaScript file that runs
  when the browser opens index.html. Its only job is to wire up the
  top-level providers and mount <App /> into <div id="root" />.

  Provider stack (outer -> inner):
    BrowserRouter  -- gives every component access to the URL/router.
    App            -- the actual app with routes, layout, and pages.

  Note: title and meta tags are managed by the <Seo /> component itself
  via useEffect, so we no longer need a HelmetProvider here.
*/
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import TagManager from 'react-gtm-module';

/*
  Self-hosted fonts via @fontsource-variable.

  Why this is better than Google Fonts:
  - Zero external DNS lookups / TCP handshakes — fonts come from YOUR domain
  - Variable fonts = one .woff2 file covers all weights (400–700) instead of
    4 separate downloads
  - Fonts are bundled into your Vite build and cached with the rest of your
    static assets
  - No privacy concerns (requests never leave your server)

  Before running `npm run dev` or building, install the packages once:
    npm install @fontsource-variable/inter @fontsource-variable/noto-serif
*/
import '@fontsource-variable/inter/index.css';
import '@fontsource-variable/noto-serif/index.css';           // upright (normal)
import '@fontsource-variable/noto-serif/wght-italic.css'; // italic

import './index.css';
import App from './App';

TagManager.initialize({
  gtmId: 'GTM-N34XGWQP',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
