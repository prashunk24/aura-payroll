import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  PlayCircle,
  Vault,
  FileText,
  ArrowLeftRight,
  Settings,
  ArrowDownToLine,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuraLogo } from "./AuraLogo";
import { BlobBackground } from "./BlobBackground";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/employees", label: "Employees", icon: Users },
  { to: "/app/payroll", label: "Run Payroll", icon: PlayCircle, highlight: true },
  { to: "/app/vaults", label: "Vaults", icon: Vault },
  { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/funds", label: "Funds", icon: ArrowDownToLine },
];

const SECONDARY = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/developers", label: "Developers", icon: Code2 },
];

const SidebarLink = ({
  to,
  label,
  icon: Icon,
  end,
  highlight,
  onClick,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-foreground/[0.06] border border-foreground/10"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon className={cn("relative w-[18px] h-[18px] shrink-0", isActive && "text-foreground")} />
      <span className="relative truncate">{label}</span>
      {highlight && !isActive && (
        <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-foreground" />
      )}
    </NavLink>
  );
};

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
  <div className="flex flex-col h-full">
    <div className="px-5 pt-6 pb-5">
      <Link to="/" onClick={onNavigate}>
        <AuraLogo />
      </Link>
    </div>

    <div className="px-3">
      <div className="glass-subtle rounded-xl flex items-center gap-2 h-9 px-3 text-muted-foreground">
        <Search className="w-4 h-4 shrink-0" />
        <input
          placeholder="Search…"
          className="bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-muted-foreground/70 text-foreground"
        />
        <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-foreground/[0.06] border border-foreground/10">⌘K</kbd>
      </div>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-5">
      <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70 font-semibold">Workspace</p>
      <ul className="space-y-0.5">
        {NAV.map((n) => (
          <li key={n.to}>
            <SidebarLink {...n} onClick={onNavigate} />
          </li>
        ))}
      </ul>

      <p className="mt-6 px-3 mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70 font-semibold">Account</p>
      <ul className="space-y-0.5">
        {SECONDARY.map((n) => (
          <li key={n.to}>
            <SidebarLink {...n} onClick={onNavigate} />
          </li>
        ))}
      </ul>
    </nav>

    {/* Upgrade card */}
    <div className="p-3">
      <div className="ink-panel rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-15" />
        <Sparkles className="relative w-4 h-4 mb-2 opacity-90" />
        <p className="relative text-sm font-semibold leading-tight">Optimize your treasury</p>
        <p className="relative text-[11px] text-white/60 mt-1">Earn up to 5.4% APY on idle reserves.</p>
        <Link
          to="/app/vaults"
          onClick={onNavigate}
          className="relative mt-3 inline-flex items-center gap-1 text-[11px] font-semibold underline-offset-4 hover:underline"
        >
          Activate yield →
        </Link>
      </div>
    </div>
  </div>
);

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const DashboardShell = ({ children, title, subtitle, actions }: DashboardShellProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex bg-muted/30">
      <BlobBackground />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-[260px] shrink-0 border-r border-foreground/5 bg-background/60 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-foreground/10 lg:hidden"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-8 flex items-center gap-3 border-b border-foreground/5 bg-background/70 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-foreground/5"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden">
            <AuraLogo withWordmark={false} />
          </div>

          <div className="flex-1" />

          <button
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-foreground" />
          </button>

          <div className="h-6 w-px bg-foreground/10" />

          <div className="flex items-center gap-2.5 pl-1 pr-3 h-9 rounded-full hover:bg-foreground/5 cursor-pointer transition-colors">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-foreground to-foreground/70 text-background flex items-center justify-center text-[11px] font-semibold">
              AC
            </span>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-semibold">Acme, Inc.</p>
              <p className="text-[10px] text-muted-foreground">Admin · Pro</p>
            </div>
          </div>
        </header>

        {/* Page header */}
        {(title || actions) && (
          <div className="px-4 sm:px-8 pt-8 pb-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
            >
              <div className="min-w-0">
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </motion.div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 px-4 sm:px-8 py-6">{children}</main>

        <footer className="px-4 sm:px-8 py-6 text-center text-[11px] text-muted-foreground/70 border-t border-foreground/5">
          © {new Date().getFullYear()} AuraPayroll · Modern payroll, automated tax, treasury yield.
        </footer>
      </div>
    </div>
  );
};
