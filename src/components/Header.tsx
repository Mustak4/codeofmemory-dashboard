import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath, removeLanguageFromPath, languages } from "@/i18n/config";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, t } = useLanguage();

  const basePath = removeLanguageFromPath(location.pathname);

  const navLinks = [
    { path: "/", key: "home" },
    { path: "/about", key: "about" },
    { path: "/order", key: "order" },
    { path: "/reviews", key: "reviews" },
    { path: "/faq", key: "faq" },
    { path: "/blog", key: "blog" },
    { path: "/contact", key: "contact" },
  ];

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to={getLocalizedPath("/", language)} className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="CodeOfMemory" 
              className="h-10 w-auto transition-opacity group-hover:opacity-80" 
              width="40"
              height="40"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const localizedPath = getLocalizedPath(link.path, language);
              const isActive = basePath === link.path;
              return (
                <Link
                  key={link.path}
                  to={localizedPath}
                  className={`text-sm transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-earth after:transition-all hover:after:w-full ${
                    isActive
                      ? "text-memory font-medium"
                      : "text-muted-foreground hover:text-memory"
                  }`}
                >
                  {t(`common.${link.key}`)}
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            {languages.map((lang) => {
              const localizedPath = getLocalizedPath(basePath, lang.code);
              return (
                <Link
                  key={lang.code}
                  to={localizedPath}
                  className={`text-xs transition-colors px-2 py-1 rounded ${
                    language === lang.code
                      ? "text-memory font-medium bg-muted"
                      : "text-muted-foreground hover:text-memory"
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                >
                  {lang.code.toUpperCase()}
                </Link>
              );
            })}
          </div>

          <Button variant="hero" size="sm" asChild className="hidden md:flex">
            <Link to={getLocalizedPath("/create", language)}>{t("common.createMemorial")}</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-memory"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 flex flex-col gap-4 animate-fade-in">
            {navLinks.map((link) => {
              const localizedPath = getLocalizedPath(link.path, language);
              const isActive = basePath === link.path;
              return (
                <Link
                  key={link.path}
                  to={localizedPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base transition-colors ${
                    isActive
                      ? "text-memory font-medium"
                      : "text-muted-foreground hover:text-memory"
                  }`}
                >
                  {t(`common.${link.key}`)}
                </Link>
              );
            })}
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-2 mt-2 pt-4 border-t border-border/50">
              {languages.map((lang) => {
                const localizedPath = getLocalizedPath(basePath, lang.code);
                return (
                  <Link
                    key={lang.code}
                    to={localizedPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs transition-colors px-2 py-1 rounded ${
                      language === lang.code
                        ? "text-memory font-medium bg-muted"
                        : "text-muted-foreground hover:text-memory"
                    }`}
                    aria-label={`Switch to ${lang.name}`}
                  >
                    {lang.code.toUpperCase()}
                  </Link>
                );
              })}
            </div>
            <Button variant="hero" size="sm" asChild className="mt-2">
              <Link to={getLocalizedPath("/create", language)} onClick={() => setMobileMenuOpen(false)}>
                {t("common.createMemorial")}
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
