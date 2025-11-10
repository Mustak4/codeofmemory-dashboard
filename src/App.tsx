import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Payment from "./pages/Payment";
import MemorialDetail from "./pages/MemorialDetail";
import MemorialProfileEditor from "./pages/MemorialProfileEditor";

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
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/memorial/:id" element={<MemorialDetail />} />
              <Route path="/memorial/:id/edit" element={<MemorialProfileEditor />} />
            </Route>
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
