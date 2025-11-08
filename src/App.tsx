import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import PlausibleAnalytics from "@/components/PlausibleAnalytics";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { languages } from "@/i18n/config";
import Index from "./pages/Index";
import Memorial from "./pages/Memorial";
import CreateTribute from "./pages/CreateTribute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import FAQ from "./pages/FAQ";
import Order from "./pages/Order";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import BlogPostPage from "./pages/blog/BlogPostPage";

const queryClient = new QueryClient();

// Helper to create localized routes (including /en/ prefix)
const createLocalizedRoute = (path: string, element: React.ReactElement, includeRoot = false) => {
  const routes: React.ReactElement[] = [];
  
  // Create routes for all languages including English with /en/ prefix
  languages.forEach((lang) => {
    routes.push(
      <Route
        key={`${lang.code}${path}`}
        path={`${lang.urlPrefix}${path}`}
        element={element}
      />
    );
  });
  
  // Also support root path without prefix for backward compatibility
  if (includeRoot || path === "/") {
    routes.push(
      <Route key={`root${path}`} path={path} element={element} />
    );
  }
  
  return routes;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <PlausibleAnalytics />
          <ScrollToTop />
          <Routes>
            {createLocalizedRoute("/", <Index />)}
            {createLocalizedRoute("/about", <About />)}
            {createLocalizedRoute("/contact", <Contact />)}
            {createLocalizedRoute("/reviews", <Reviews />)}
            {createLocalizedRoute("/faq", <FAQ />)}
            {createLocalizedRoute("/order", <Order />)}
            {/* Blog routes - include root paths for backward compatibility */}
            <Route key="blog-root" path="/blog" element={<Blog />} />
            {createLocalizedRoute("/blog", <Blog />)}
            <Route key="blog-slug-root" path="/blog/:slug" element={<BlogPostPage />} />
            {createLocalizedRoute("/blog/:slug", <BlogPostPage />)}
            {createLocalizedRoute("/create", <CreateTribute />)}
            {createLocalizedRoute("/memorial/:id", <Memorial />)}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
