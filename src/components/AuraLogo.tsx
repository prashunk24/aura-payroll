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
    <div
      className={cn(
        "inline-flex items-center group bg-white rounded-xl px-2.5 py-1.5 ring-1 ring-foreground/5 shadow-sm",
        className,
      )}
    >
      <img
        src={logo}
        alt="AuraPayroll"
        draggable={false}
        className={cn(
          "object-contain object-left select-none transition-transform duration-500 ease-out group-hover:scale-[1.04]",
          withWordmark ? "h-6" : "h-7 w-7",
        )}
        style={
          withWordmark
            ? undefined
            : { objectFit: "cover", objectPosition: "left center", aspectRatio: "1 / 1" }
        }
      />
    </div>
  );
};
