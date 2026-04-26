import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Payroll from "./pages/Payroll";
import Vaults from "./pages/Vaults";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Funds from "./pages/Funds";
import Settings from "./pages/Settings";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Developers from "./pages/Developers";
import NotFound from "./pages/NotFound";
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
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/employees" element={<Employees />} />
          <Route path="/app/payroll" element={<Payroll />} />
          <Route path="/app/vaults" element={<Vaults />} />
          <Route path="/app/transactions" element={<Transactions />} />
          <Route path="/app/reports" element={<Reports />} />
          <Route path="/app/funds" element={<Funds />} />
          <Route path="/app/settings" element={<Settings />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/developers" element={<Developers />} />
          {/* Legacy redirects to new structure */}
          <Route path="/employer" element={<Dashboard />} />
          <Route path="/vault" element={<Vaults />} />
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
