import { cn } from "@/lib/utils";
import logo from "@/assets/aura-logo.png";

export const AuraLogo = ({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) => {
  return (
    <div className={cn("inline-flex items-center gap-2 group", className)}>
      <span className="relative inline-flex items-center justify-center h-9 w-9 shrink-0">
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-foreground/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <img
          src={logo}
          alt="AuraPayroll"
          className="relative h-9 w-9 object-contain transition-transform duration-500 ease-out group-hover:rotate-[-6deg] group-hover:scale-105 dark:invert"
          draggable={false}
        />
      </span>
      {withWordmark && (
        <img
          src={logo}
          alt=""
          aria-hidden
          className="h-7 object-contain object-left dark:invert"
          style={{ clipPath: "inset(0 0 0 28%)", marginLeft: "-0.5rem" }}
          draggable={false}
        />
      )}
    </div>
  );
};
