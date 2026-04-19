import { Link, NavLink } from "react-router-dom";
import { WalletButton } from "./WalletButton";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/employer", label: "Employer" },
  { to: "/employee", label: "Employee" },
  { to: "/vault", label: "Tax Vault" },
  { to: "/developers", label: "Developers" },
];

export const Navbar = () => (
  <header className="sticky top-0 z-50 w-full pt-4 px-4">
    <nav className="container glass-strong rounded-full px-3 py-2 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 pl-3 pr-2">
        <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-primary glow-primary">
          <Coins className="w-5 h-5 text-primary-foreground" />
        </span>
        <span className="font-bold text-lg tracking-tight">SolPay</span>
      </Link>

      <ul className="hidden md:flex items-center gap-1">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  isActive && "text-foreground bg-white/10 shadow-inner"
                )
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <WalletButton size="sm" />
    </nav>
  </header>
);
