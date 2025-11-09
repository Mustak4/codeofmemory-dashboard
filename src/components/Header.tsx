import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";
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
    { path: "/order", key: "order" },
    { path: "/reviews", key: "reviews" },
    { path: "/faq", key: "faq" },
    { path: "/blog", key: "blog" },
    { path: "/contact", key: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 py-4">
      <div className="container mx-auto px-6">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to={getLocalizedPath("/", language)} className="flex items-center group">
              <img 
                src="/logo.png" 
                alt="CodeOfMemory" 
                className="h-12 w-auto transition-opacity group-hover:opacity-80" 
                width="48"
                height="48"
                loading="eager"
                decoding="async"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
              {navLinks.map((link) => {
                const localizedPath = getLocalizedPath(link.path, language);
                const isActive = basePath === link.path;
                return (
                  <Link
                    key={link.path}
                    to={localizedPath}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-memory"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`common.${link.key}`)}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background hover:bg-muted/50 text-sm font-medium border border-border/50"
                  >
                    <span className="flex items-center gap-1.5">
                      {languages.find(lang => lang.code === language)?.code.toUpperCase() || 'EN'}
                      <ChevronDown className="w-3 h-3" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[100px]">
                  {languages.map((lang) => {
                    const localizedPath = getLocalizedPath(basePath, lang.code);
                    return (
                      <DropdownMenuItem key={lang.code} asChild>
                        <Link
                          to={localizedPath}
                          className={`cursor-pointer ${
                            language === lang.code ? "bg-muted font-medium" : ""
                          }`}
                        >
                          {lang.code.toUpperCase()}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Create Memorial Button with Gradient */}
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-memory to-earth text-warmth hover:opacity-90 shadow-md hover:shadow-lg transition-all font-medium"
                asChild
              >
                <Link to={getLocalizedPath("/create", language)}>
                  {t("common.createMemorial")}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-memory p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border/50 flex flex-col gap-3 animate-fade-in">
              {navLinks.map((link) => {
                const localizedPath = getLocalizedPath(link.path, language);
                const isActive = basePath === link.path;
                return (
                  <Link
                    key={link.path}
                    to={localizedPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium transition-colors py-2 ${
                      isActive
                        ? "text-memory"
                        : "text-muted-foreground hover:text-foreground"
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
                      className={`text-xs transition-colors px-3 py-1.5 rounded-md font-medium ${
                        language === lang.code
                          ? "text-memory bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      aria-label={`Switch to ${lang.name}`}
                    >
                      {lang.code.toUpperCase()}
                    </Link>
                  );
                })}
              </div>
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-memory to-earth text-warmth hover:opacity-90 shadow-md mt-2 font-medium"
                asChild
              >
                <Link to={getLocalizedPath("/create", language)} onClick={() => setMobileMenuOpen(false)}>
                  {t("common.createMemorial")}
                </Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
