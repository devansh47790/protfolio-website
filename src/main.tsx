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
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
