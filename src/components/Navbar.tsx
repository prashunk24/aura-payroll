import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import { WalletButton } from "./WalletButton";
import logo from "@/assets/aura-logo.png";
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
      className="sticky top-0 z-50 w-full pt-4 px-3 sm:px-4"
    >
      <nav
        className={cn(
          "container flex items-center gap-2 h-14",
          "rounded-full pl-2 pr-2",
          "bg-[hsl(0_0%_4%/0.85)] text-[hsl(0_0%_98%)]",
          "border border-[hsl(0_0%_100%/0.06)]",
          "backdrop-blur-2xl backdrop-saturate-150",
          "shadow-[0_10px_40px_-10px_hsl(0_0%_0%/0.5),inset_0_1px_0_hsl(0_0%_100%/0.06)]"
        )}
      >
        {/* Brand */}
        <Link to="/" className="group flex items-center shrink-0 pl-2 pr-3">
          <motion.img
            src={logo}
            alt="AuraPayroll"
            draggable={false}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="h-12 sm:h-14 w-auto object-contain invert"
          />
        </Link>

        {/* Search removed */}

        {/* Links with animated indicator */}
        <ul className="hidden lg:flex items-center gap-0.5 flex-1 justify-center min-w-0">
          {links.map((l) => {
            const isActive = activePath === l.to;
            return (
              <li key={l.to} className="relative">
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={cn(
                    "relative inline-flex items-center h-10 px-3 xl:px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
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

        {/* Spacer to push right cluster when links hidden */}
        <div className="flex-1 lg:hidden" />

        {/* Right cluster */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <motion.button
            whileHover={{ rotate: -15 }}
            whileTap={{ scale: 0.92 }}
            className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full text-[hsl(0_0%_70%)] hover:text-[hsl(0_0%_100%)] hover:bg-[hsl(0_0%_100%/0.06)] transition-colors shrink-0"
            aria-label="Toggle theme"
          >
            <Moon className="w-4 h-4" />
          </motion.button>
          <div className="hidden md:block w-px h-6 bg-[hsl(0_0%_100%/0.08)]" />
          <WalletButton size="sm" />
        </div>
      </nav>
    </motion.header>
  );
};
