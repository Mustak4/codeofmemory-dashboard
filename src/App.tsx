import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { languages } from "@/i18n/config";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Payment from "./pages/Payment";
import MemorialDetail from "./pages/MemorialDetail";
import MemorialProfileEditor from "./pages/MemorialProfileEditor";
import Index from "./pages/Index";
import Order from "./pages/Order";
import FAQ from "./pages/FAQ";
import Reviews from "./pages/Reviews";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/blog/BlogPostPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Public routes - Main website */}
              <Route path="/" element={<Index />} />
              <Route path="/de" element={<Index />} />
              <Route path="/sv" element={<Index />} />
              <Route path="/no" element={<Index />} />
              <Route path="/en" element={<Index />} />
              
              <Route path="/order" element={<Order />} />
              <Route path="/de/order" element={<Order />} />
              <Route path="/sv/order" element={<Order />} />
              <Route path="/no/order" element={<Order />} />
              <Route path="/en/order" element={<Order />} />
              
              <Route path="/faq" element={<FAQ />} />
              <Route path="/de/faq" element={<FAQ />} />
              <Route path="/sv/faq" element={<FAQ />} />
              <Route path="/no/faq" element={<FAQ />} />
              <Route path="/en/faq" element={<FAQ />} />
              
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/de/reviews" element={<Reviews />} />
              <Route path="/sv/reviews" element={<Reviews />} />
              <Route path="/no/reviews" element={<Reviews />} />
              <Route path="/en/reviews" element={<Reviews />} />
              
              <Route path="/blog" element={<Blog />} />
              <Route path="/de/blog" element={<Blog />} />
              <Route path="/sv/blog" element={<Blog />} />
              <Route path="/no/blog" element={<Blog />} />
              <Route path="/en/blog" element={<Blog />} />
              
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/de/blog/:slug" element={<BlogPostPage />} />
              <Route path="/sv/blog/:slug" element={<BlogPostPage />} />
              <Route path="/no/blog/:slug" element={<BlogPostPage />} />
              <Route path="/en/blog/:slug" element={<BlogPostPage />} />
              
              <Route path="/contact" element={<Contact />} />
              <Route path="/de/contact" element={<Contact />} />
              <Route path="/sv/contact" element={<Contact />} />
              <Route path="/no/contact" element={<Contact />} />
              <Route path="/en/contact" element={<Contact />} />
              
              {/* Public route for viewing published memorials by slug */}
              <Route path="/memorial/:slug" element={<MemorialDetail />} />
              <Route path="/de/memorial/:slug" element={<MemorialDetail />} />
              <Route path="/sv/memorial/:slug" element={<MemorialDetail />} />
              <Route path="/no/memorial/:slug" element={<MemorialDetail />} />
              <Route path="/en/memorial/:slug" element={<MemorialDetail />} />
              
              {/* Authentication routes */}
              <Route path="/signin" element={<Signin />} />
              {languages.filter(lang => lang.code !== "en").map((lang) => (
                <Route key={`${lang.code}-signin`} path={`${lang.urlPrefix}/signin`} element={<Signin />} />
              ))}
              
              {/* Protected routes - Dashboard */}
              <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {languages.filter(lang => lang.code !== "en").map((lang) => (
                  <Route key={`${lang.code}-dashboard`} path={`${lang.urlPrefix}/dashboard`} element={<Dashboard />} />
                ))}
                <Route path="/onboarding" element={<Onboarding />} />
                {languages.filter(lang => lang.code !== "en").map((lang) => (
                  <Route key={`${lang.code}-onboarding`} path={`${lang.urlPrefix}/onboarding`} element={<Onboarding />} />
                ))}
                <Route path="/payment" element={<Payment />} />
                {languages.filter(lang => lang.code !== "en").map((lang) => (
                  <Route key={`${lang.code}-payment`} path={`${lang.urlPrefix}/payment`} element={<Payment />} />
                ))}
                <Route path="/create-memorial" element={<MemorialProfileEditor />} />
                {languages.filter(lang => lang.code !== "en").map((lang) => (
                  <Route key={`${lang.code}-create-memorial`} path={`${lang.urlPrefix}/create-memorial`} element={<MemorialProfileEditor />} />
                ))}
                <Route path="/memorial/:id" element={<MemorialDetail />} />
                {languages.filter(lang => lang.code !== "en").map((lang) => (
                  <Route key={`${lang.code}-memorial-id`} path={`${lang.urlPrefix}/memorial/:id`} element={<MemorialDetail />} />
                ))}
                <Route path="/memorial/:id/edit" element={<MemorialProfileEditor />} />
                {languages.filter(lang => lang.code !== "en").map((lang) => (
                  <Route key={`${lang.code}-memorial-edit`} path={`${lang.urlPrefix}/memorial/:id/edit`} element={<MemorialProfileEditor />} />
                ))}
              </Route>
              
              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
