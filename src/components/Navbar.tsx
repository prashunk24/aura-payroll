import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Coins, Search, Moon } from "lucide-react";
import { WalletButton } from "./WalletButton";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/employer", label: "Employer" },
  { to: "/employee", label: "Employee" },
  { to: "/vault", label: "Tax Vault" },
  { to: "/developers", label: "Developers" },
];

export const Navbar = () => {
  const location = useLocation();
  const activePath =
    links.find((l) => (l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to)))?.to ?? "/";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full pt-4 px-4"
    >
      <nav
        className={cn(
          "container flex items-center justify-between gap-2 sm:gap-3",
          "rounded-[28px] px-2 sm:px-3 py-2",
          "bg-[hsl(0_0%_4%/0.85)] text-[hsl(0_0%_98%)]",
          "border border-[hsl(0_0%_100%/0.06)]",
          "backdrop-blur-2xl backdrop-saturate-150",
          "shadow-[0_10px_40px_-10px_hsl(0_0%_0%/0.5),inset_0_1px_0_hsl(0_0%_100%/0.06)]"
        )}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 pl-2 pr-1 shrink-0">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-[hsl(0_0%_100%)] text-[hsl(0_0%_4%)]"
          >
            <Coins className="w-4 h-4" />
          </motion.span>
        </Link>

        {/* Search */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-2 flex-1 max-w-[260px]",
            "h-10 px-3 rounded-2xl",
            "bg-[hsl(0_0%_100%/0.04)] border border-[hsl(0_0%_100%/0.06)]",
            "text-[hsl(0_0%_60%)]"
          )}
        >
          <Search className="w-4 h-4 shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-[hsl(0_0%_45%)] text-[hsl(0_0%_90%)]"
          />
          <div className="hidden md:flex items-center gap-1 text-[10px]">
            <kbd className="px-1.5 py-0.5 rounded-md bg-[hsl(0_0%_100%/0.06)] border border-[hsl(0_0%_100%/0.08)] font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded-md bg-[hsl(0_0%_100%/0.06)] border border-[hsl(0_0%_100%/0.08)] font-mono">K</kbd>
          </div>
        </div>

        {/* Links with animated indicator */}
        <ul className="hidden lg:flex items-center gap-1 mx-2">
          {links.map((l) => {
            const isActive = activePath === l.to;
            return (
              <li key={l.to} className="relative">
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={cn(
                    "relative inline-flex px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "text-[hsl(0_0%_100%)]"
                      : "text-[hsl(0_0%_60%)] hover:text-[hsl(0_0%_95%)]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-[hsl(0_0%_100%/0.08)] border border-[hsl(0_0%_100%/0.08)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
          <div className="hidden md:block w-px h-6 bg-[hsl(0_0%_100%/0.08)]" />
          <motion.button
            whileHover={{ rotate: -15 }}
            whileTap={{ scale: 0.92 }}
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full text-[hsl(0_0%_70%)] hover:text-[hsl(0_0%_100%)] hover:bg-[hsl(0_0%_100%/0.06)] transition-colors"
            aria-label="Toggle theme"
          >
            <Moon className="w-4 h-4" />
          </motion.button>
          <WalletButton size="sm" />
        </div>
      </nav>
    </motion.header>
  );
};
