"use client";

import { cn } from "@/shared/utils/cn";

/**
 * Large touch-friendly selectable card for wizard choices.
 */
export function KioskOptionCard({
  selected,
  onClick,
  title,
  hint,
  className,
  compact = false,
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "kiosk-card-interactive flex flex-col items-center justify-center text-center",
        compact ? "min-h-[5.5rem] p-4" : "min-h-[6.5rem] p-5 kiosk:min-h-[7.5rem]",
        selected ? "kiosk-card-selected font-semibold" : "text-text-muted",
        className
      )}
    >
      <span className="text-lg font-semibold kiosk:text-xl">{title}</span>
      {hint ? (
        <span className="mt-1.5 text-sm text-text-muted kiosk:text-base">{hint}</span>
      ) : null}
    </button>
  );
}
