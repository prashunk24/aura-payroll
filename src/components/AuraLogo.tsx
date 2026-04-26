import { cn } from "@/lib/utils";

export const AuraLogo = ({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) => {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-foreground text-background overflow-hidden">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18 L9 6 L12 13 L15 6 L20 18" />
          <path d="M7 14 H17" opacity="0.6" />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-semibold tracking-tight text-[15px]">
          Aura<span className="text-muted-foreground font-normal">Payroll</span>
        </span>
      )}
    </div>
  );
};
