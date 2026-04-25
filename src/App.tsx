import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolanaProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/vault" element={<TaxVault />} />
          <Route path="/developers" element={<Developers />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
