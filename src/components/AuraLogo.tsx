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
      <img
        src={logo}
        alt="AuraPayroll"
        draggable={false}
        className={cn(
          "object-contain object-left select-none transition-transform duration-500 ease-out group-hover:scale-[1.04]",
          withWordmark ? "h-16" : "h-12 w-12",
        )}
      />
    </div>
  );
};
