import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/i18n/config";
import { Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to={getLocalizedPath("/", language)} className="flex items-center mb-4 group">
              <img 
                src="/logo.png" 
                alt="CodeOfMemory" 
                className="h-10 w-auto" 
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Preserving memories with dignity through technology and love.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <Button variant="outline" size="sm" asChild className="w-full border-memory text-memory hover:bg-memory/10">
                <Link to={user ? "/dashboard" : "/signin"}>
                  {user ? "Login" : t("common.login")}
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild className="w-full bg-memory text-warmth hover:bg-memory/90">
                <Link to={getLocalizedPath("/order", language)}>{t("common.createMemorial")}</Link>
              </Button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif text-memory mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to={getLocalizedPath("/reviews", language)} className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath("/blog", language)} className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath("/contact", language)} className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-memory mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to={getLocalizedPath("/faq", language)} className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath("/order-process", language)} className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Order Process
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath("/privacy", language)} className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath("/terms", language)} className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-memory mb-4">Get in Touch</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 text-earth mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:hello@codeofmemory.com" className="text-muted-foreground hover:text-memory transition-colors">
                  hello@codeofmemory.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 text-earth mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href="tel:+447741453154" className="text-muted-foreground hover:text-memory transition-colors">
                  +44 7741453154
                </a>
              </li>
            </ul>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-earth transition-colors" aria-label="Visit our Facebook page">
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-earth transition-colors" aria-label="Visit our Instagram page">
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-earth transition-colors" aria-label="Visit our Twitter page">
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 CodeOfMemory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
