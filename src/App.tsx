import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import EmployerDashboard from "./pages/EmployerDashboard.tsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.tsx";
import TaxVault from "./pages/TaxVault.tsx";
import Developers from "./pages/Developers.tsx";
import NotFound from "./pages/NotFound.tsx";
import { SolanaProvider } from "./providers/SolanaProvider";
import { SmoothScroll } from "./components/SmoothScroll";
import { PageTransition } from "./components/PageTransition";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/vault" element={<TaxVault />} />
          <Route path="/developers" element={<Developers />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolanaProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SmoothScroll>
            <AnimatedRoutes />
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </SolanaProvider>
  </QueryClientProvider>
);

export default App;
