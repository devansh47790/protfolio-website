import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: 'pageview',
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);
}
