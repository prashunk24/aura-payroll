import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { BlobBackground } from "./BlobBackground";

export const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen">
    <BlobBackground />
    <Navbar />
    <main className="container px-4 sm:px-6 py-6 sm:py-10">{children}</main>
    <footer className="container px-4 sm:px-6 py-8 sm:py-10 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} SolPay — Decentralized payroll on Solana.
    </footer>
  </div>
);
