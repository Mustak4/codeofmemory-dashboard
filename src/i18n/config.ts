export type Language = "en" | "de" | "sv" | "no";

export const languages: { code: Language; name: string; hreflang: string; urlPrefix: string }[] = [
  { code: "en", name: "English", hreflang: "en", urlPrefix: "/en" },
  { code: "de", name: "Deutsch", hreflang: "de", urlPrefix: "/de" },
  { code: "sv", name: "Svenska", hreflang: "sv", urlPrefix: "/sv" },
  { code: "no", name: "Norsk", hreflang: "no", urlPrefix: "/no" },
];

export const defaultLanguage: Language = "en";

export const getLanguageFromPath = (pathname: string): Language => {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment === "de") return "de";
  if (firstSegment === "sv") return "sv";
  if (firstSegment === "no") return "no";
  if (firstSegment === "en") return "en";
  // Default to English if no language prefix
  return "en";
};

export const getLocalizedPath = (path: string, lang: Language): string => {
  // Remove any existing language prefix
  const cleanPath = removeLanguageFromPath(path);
  // Add the language prefix
  const langConfig = languages.find(l => l.code === lang);
  return langConfig ? `${langConfig.urlPrefix}${cleanPath}` : cleanPath;
};

export const removeLanguageFromPath = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  
  if (["en", "de", "sv", "no"].includes(firstSegment)) {
    return "/" + segments.slice(1).join("/") || "/";
  }
  return pathname;
};

