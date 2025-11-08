import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4 group">
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              Preserving memories with dignity through technology and love.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif text-memory mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-memory transition-colors">
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
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Order Process
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-memory transition-colors">
                  Terms of Service
                </a>
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
                <a href="tel:+441234567890" className="text-muted-foreground hover:text-memory transition-colors">
                  +44 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-earth mt-0.5 flex-shrink-0" aria-hidden="true" />
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
