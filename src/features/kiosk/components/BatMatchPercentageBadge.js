import { cn } from "@/shared/utils/cn";

export function BatMatchPercentageBadge({ percentage, isBest = false, variant = "card" }) {
  if (percentage == null || percentage === "") return null;

  const isOnBrand = variant === "modal";

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-kiosk-sm border-2 text-center shadow-kiosk-soft",
        variant === "card" ? "min-w-[72px] px-3 py-2 sm:min-w-[80px] sm:px-3.5 sm:py-2.5" : "min-w-[68px] px-2.5 py-2",
        isOnBrand
          ? "border-white/40 bg-white/15"
          : isBest
            ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100"
            : "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50"
      )}
      aria-label={`${percentage} percent match`}
    >
      <span
        className={cn(
          "font-sora font-black leading-none",
          variant === "card" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
          isOnBrand ? "text-text-on-brand" : isBest ? "text-emerald-800" : "text-amber-950"
        )}
      >
        {percentage}%
      </span>
      <span
        className={cn(
          "font-outfit font-bold uppercase tracking-wider",
          variant === "card" ? "mt-0.5 text-[10px] sm:text-xs" : "mt-0.5 text-[10px]",
          isOnBrand ? "text-text-on-brand/85" : isBest ? "text-emerald-700" : "text-amber-900/80"
        )}
      >
        Match
      </span>
    </div>
  );
}
