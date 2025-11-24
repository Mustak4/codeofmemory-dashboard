import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Header />
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="mb-4 text-6xl md:text-7xl font-serif text-permanence">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="mb-8 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button variant="hero" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
