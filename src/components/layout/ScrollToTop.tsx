/*
  Scrolls to the top of the page on every route change.

  Without this the browser keeps the previous scroll position when you
  navigate (e.g. you scroll halfway down /projects, click into a project,
  and the detail page would render mid-scroll).
*/
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
