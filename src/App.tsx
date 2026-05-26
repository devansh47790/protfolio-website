import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import usePageTracking from './hooks/usePageTracking';

export default function App() {
  usePageTracking();

  /*
    app-rendered event — used by vite-plugin-prerender at build time.

    HOW IT WORKS:
    The prerender plugin opens your site in a headless browser and waits
    for this event before it snapshots the HTML.  Firing it inside
    useEffect means it only dispatches AFTER React has finished rendering
    AND after all child useEffects have run (including <Seo>'s useEffect
    that writes the correct <title> and <meta> into <head>).

    This ensures the pre-rendered HTML files contain the right per-page
    meta tags rather than the homepage fallbacks.

    In production / normal browsing this event is harmless — nothing
    listens for it so it is silently ignored.
  */
  useEffect(() => {
    document.dispatchEvent(new Event('app-rendered'));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
