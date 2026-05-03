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
    <div className={cn("inline-flex items-center group", className)}>
      <span className="relative inline-flex items-center justify-center shrink-0">
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-foreground/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <img
          src={logo}
          alt="AuraPayroll"
          draggable={false}
          className={cn(
            "relative object-contain object-left select-none transition-transform duration-500 ease-out group-hover:scale-[1.03] dark:invert",
            withWordmark ? "h-8" : "h-9 w-9",
          )}
          style={
            withWordmark
              ? undefined
              : { objectFit: "cover", objectPosition: "left center", aspectRatio: "1 / 1" }
          }
        />
      </span>
    </div>
  );
};
