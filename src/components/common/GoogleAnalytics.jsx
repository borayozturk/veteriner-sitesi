import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSEO } from '../../contexts/SEOContext';

const GoogleAnalytics = () => {
  const location = useLocation();
  const { getSEO } = useSEO();

  useEffect(() => {
    // Safely get global SEO settings
    const globalSEO = getSEO ? getSEO('global') : null;
    const gaId = globalSEO?.googleAnalyticsId;

    if (!gaId || gaId.trim() === '') {
      return; // No GA ID configured
    }

    // Check if GA script already loaded
    if (window.gtag) {
      // GA already loaded, just track page view
      window.gtag('config', gaId, {
        page_path: location.pathname + location.search,
      });
      return;
    }

    // Load GA script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    // Initialize GA
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        page_path: '${location.pathname}${location.search}'
      });
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup if component unmounts
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, [getSEO]);

  // Track page views on route change
  useEffect(() => {
    const globalSEO = getSEO ? getSEO('global') : null;
    if (window.gtag && globalSEO?.googleAnalyticsId) {
      window.gtag('config', globalSEO.googleAnalyticsId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, getSEO]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
