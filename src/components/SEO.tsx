import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLanguageFromPath, getLocalizedPath, languages, removeLanguageFromPath } from "@/i18n/config";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  page: "home" | "about" | "faq" | "order" | "contact" | "reviews" | "blog" | "notFound";
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  structuredData?: object;
}

const SEO = ({
  page,
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage = "/logo.png",
  canonical,
  structuredData,
}: SEOProps) => {
  const location = useLocation();
  const currentLang = getLanguageFromPath(location.pathname);
  const { t } = useLanguage();
  const basePath = canonical || location.pathname;

  // Get SEO metadata from i18n, with fallback to props
  const seoData = t(`seo.${page}`, { returnObjects: true }) as {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
  } || {};

  const finalTitle = title || seoData.title || "";
  const finalDescription = description || seoData.description || "";
  const finalOgTitle = ogTitle || seoData.ogTitle || finalTitle;
  const finalOgDescription = ogDescription || seoData.ogDescription || finalDescription;

  // Ensure canonical URLs always point to English version
  const canonicalPath = canonical || removeLanguageFromPath(location.pathname);
  const englishCanonical = canonicalPath.startsWith("/en") 
    ? canonicalPath 
    : canonicalPath === "/" 
      ? "/" 
      : `/en${canonicalPath}`;

  useEffect(() => {
    const baseUrl = "https://codeofmemory.com";
    
    // Update document title
    document.title = finalTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update description
    updateMetaTag("description", finalDescription);

    // Update Open Graph tags
    const fullCanonical = `${baseUrl}${englishCanonical}`;
    updateMetaTag("og:title", finalOgTitle, true);
    updateMetaTag("og:description", finalOgDescription, true);
    updateMetaTag("og:image", ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:url", fullCanonical, true);

    // Update Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", finalOgTitle);
    updateMetaTag("twitter:description", finalOgDescription);
    updateMetaTag("twitter:image", ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`);

    // Update canonical link (always English)
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", fullCanonical);

    // Add hreflang links
    // Remove existing hreflang links
    document.querySelectorAll("link[rel='alternate'][hreflang], link[rel='alternate'][hrefLang]").forEach((link) => link.remove());

    // Add hreflang links for all languages
    languages.forEach((lang) => {
      const localizedPath = getLocalizedPath(basePath, lang.code);
      const hreflangLink = document.createElement("link");
      hreflangLink.setAttribute("rel", "alternate");
      hreflangLink.setAttribute("hrefLang", lang.hreflang); // Using hrefLang as specified
      hreflangLink.setAttribute("href", `${baseUrl}${localizedPath}`);
      document.head.appendChild(hreflangLink);
    });

    // Add x-default hreflang (root URL, not /en/)
    const cleanBasePath = removeLanguageFromPath(basePath);
    const defaultLink = document.createElement("link");
    defaultLink.setAttribute("rel", "alternate");
    defaultLink.setAttribute("hrefLang", "x-default");
    defaultLink.setAttribute("href", `${baseUrl}${cleanBasePath}`);
    document.head.appendChild(defaultLink);

    // Add structured data
    if (structuredData) {
      let scriptTag = document.querySelector("script[type='application/ld+json']#seo-structured-data") as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.type = "application/ld+json";
        scriptTag.id = "seo-structured-data";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [finalTitle, finalDescription, finalOgTitle, finalOgDescription, ogImage, englishCanonical, structuredData, location.pathname, basePath, currentLang]);

  return null;
};

export default SEO;

