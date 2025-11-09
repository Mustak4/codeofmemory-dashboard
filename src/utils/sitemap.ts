import { RouteObject } from "react-router-dom";
import { languages, getLocalizedPath } from "@/i18n/config";

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  hreflang?: string;
  alternates?: Array<{ hreflang: string; url: string }>;
}

const baseRoutes: Array<{ path: string; changefreq: SitemapEntry["changefreq"]; priority: number }> = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/order", changefreq: "weekly", priority: 0.9 },
  { path: "/faq", changefreq: "monthly", priority: 0.9 },
  { path: "/reviews", changefreq: "weekly", priority: 0.9 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.7 },
];

// Generate localized routes (including root / for x-default)
const routes: SitemapEntry[] = baseRoutes.flatMap((route) => {
  const localizedRoutes: SitemapEntry[] = [];
  
  // Add root path (/) for x-default (only for homepage)
  if (route.path === "/") {
    const rootAlternates = languages.map((altLang) => ({
      hreflang: altLang.hreflang,
      url: `https://codeofmemory.com${getLocalizedPath(route.path, altLang.code)}`,
    }));
    
    localizedRoutes.push({
      url: "https://codeofmemory.com/",
      changefreq: route.changefreq,
      priority: route.priority,
      hreflang: "x-default",
      alternates: rootAlternates,
    });
  }
  
  // Add language-specific routes
  languages.forEach((lang) => {
    const localizedPath = getLocalizedPath(route.path, lang.code);
    const alternates = languages.map((altLang) => ({
      hreflang: altLang.hreflang,
      url: `https://codeofmemory.com${getLocalizedPath(route.path, altLang.code)}`,
    }));
    
    // Add x-default for each language variant
    alternates.push({
      hreflang: "x-default",
      url: `https://codeofmemory.com${route.path}`,
    });
    
    localizedRoutes.push({
      url: `https://codeofmemory.com${localizedPath}`,
      changefreq: route.changefreq,
      priority: route.priority,
      hreflang: lang.hreflang,
      alternates,
    });
  });
  
  return localizedRoutes;
});

// Blog posts - dynamically generated with localized versions
const blogPostPaths = [
  { path: "/blog/why-qr-memorial-plaques-change-remembrance", lastmod: "2025-01-20" },
  { path: "/blog/how-to-create-digital-memorial-page", lastmod: "2025-01-18" },
  { path: "/blog/best-materials-for-outdoor-qr-plaques", lastmod: "2025-01-16" },
  { path: "/blog/digital-memorials-modern-grief", lastmod: "2025-01-15" },
  { path: "/blog/living-memorial-pre-planning", lastmod: "2025-01-08" },
  { path: "/blog/qr-codes-memorials-guide", lastmod: "2024-12-20" },
  { path: "/blog/families-keeping-memories-alive", lastmod: "2024-12-12" },
  { path: "/blog/writing-meaningful-biography", lastmod: "2024-11-28" },
  { path: "/blog/memorial-design-trends", lastmod: "2024-11-15" },
];

const blogPosts: SitemapEntry[] = blogPostPaths.flatMap((post) => {
  const localizedPosts: SitemapEntry[] = [];
  
  languages.forEach((lang) => {
    const localizedPath = getLocalizedPath(post.path, lang.code);
    const alternates = languages.map((altLang) => ({
      hreflang: altLang.hreflang,
      url: `https://codeofmemory.com${getLocalizedPath(post.path, altLang.code)}`,
    }));
    
    localizedPosts.push({
      url: `https://codeofmemory.com${localizedPath}`,
      changefreq: "monthly",
      priority: 0.8,
      lastmod: post.lastmod,
      hreflang: lang.hreflang,
      alternates,
    });
  });
  
  return localizedPosts;
});

export const generateSitemap = (): string => {
  const allRoutes = [...routes, ...blogPosts];
  const now = new Date().toISOString().split("T")[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes
  .map(
    (route) => {
      let urlEntry = `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod || now}</lastmod>
    <changefreq>${route.changefreq || "monthly"}</changefreq>
    <priority>${route.priority || 0.5}</priority>`;
      
      // Add hreflang alternates
      if (route.alternates && route.alternates.length > 0) {
        route.alternates.forEach((alt) => {
          urlEntry += `\n    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.url}" />`;
        });
      }
      
      urlEntry += `\n  </url>`;
      return urlEntry;
    }
  )
  .join("\n")}
</urlset>`;

  return sitemap;
};

// Generate language-specific sitemaps
export const generateLanguageSpecificSitemap = (langCode: string): string => {
  const allRoutes = [...routes, ...blogPosts];
  const now = new Date().toISOString().split("T")[0];
  
  // Filter routes for specific language
  const langRoutes = allRoutes.filter((route) => {
    const routeLang = route.url.includes(`/${langCode}/`) || (langCode === "en" && !route.url.match(/\/(de|se|no)\//));
    return routeLang;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${langRoutes
  .map(
    (route) => {
      let urlEntry = `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod || now}</lastmod>
    <changefreq>${route.changefreq || "monthly"}</changefreq>
    <priority>${route.priority || 0.5}</priority>`;
      
      // Add hreflang alternates
      if (route.alternates && route.alternates.length > 0) {
        route.alternates.forEach((alt) => {
          urlEntry += `\n    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.url}" />`;
        });
      }
      
      urlEntry += `\n  </url>`;
      return urlEntry;
    }
  )
  .join("\n")}
</urlset>`;

  return sitemap;
};

// Generate sitemap index
export const generateSitemapIndex = (): string => {
  const now = new Date().toISOString().split("T")[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://codeofmemory.com/sitemap-en.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://codeofmemory.com/sitemap-de.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://codeofmemory.com/sitemap-se.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://codeofmemory.com/sitemap-no.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
};

export const getAllRoutes = (): SitemapEntry[] => {
  return [...routes, ...blogPosts];
};

