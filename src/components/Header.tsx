import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/order", label: "Order" },
    { path: "/reviews", label: "Reviews" },
    { path: "/faq", label: "FAQ" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className="w-5 h-5 text-earth transition-colors group-hover:text-memory" />
            <span className="text-xl font-serif text-memory group-hover:text-earth transition-colors">
              CodeOfMemory
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-earth after:transition-all hover:after:w-full ${
                  location.pathname === link.path
                    ? "text-memory font-medium"
                    : "text-muted-foreground hover:text-memory"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button variant="hero" size="sm" asChild className="hidden md:flex">
            <Link to="/create">Create Memorial</Link>
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
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base transition-colors ${
                  location.pathname === link.path
                    ? "text-memory font-medium"
                    : "text-muted-foreground hover:text-memory"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="hero" size="sm" asChild className="mt-2">
              <Link to="/create" onClick={() => setMobileMenuOpen(false)}>
                Create Memorial
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
