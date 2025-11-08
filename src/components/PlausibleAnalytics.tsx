import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

const PlausibleAnalytics = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    // Initialize Plausible if not already loaded
    if (!window.plausible) {
      const script = document.createElement("script");
      script.defer = true;
      script.setAttribute("data-domain", "codeofmemory.com");
      script.src = "https://plausible.io/js/script.js";
      document.head.appendChild(script);
    }

    // Track pageview with locale
    if (window.plausible) {
      window.plausible("pageview", {
        props: {
          locale: language,
          path: location.pathname,
        },
      });
    }
  }, [location.pathname, language]);

  return null;
};

export default PlausibleAnalytics;

