"use client";

import { cn } from "@/shared/utils/cn";
import { IconCheck } from "@/components/ui/icons/SportIcons";

export function SelectionCard({
  selected,
  onClick,
  title,
  hint,
  icon: Icon,
  className,
  compact,
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "ui-card-interactive relative flex w-full flex-col items-center justify-center gap-2 p-4 text-center tablet:p-5",
        compact ? "min-h-[5.5rem]" : "min-h-[6.5rem] kiosk:min-h-[7.5rem]",
        selected ? "ui-card-selected" : "text-text-muted",
        className
      )}
    >
      {selected ? (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-text-on-brand">
          <IconCheck className="h-3.5 w-3.5" />
        </span>
      ) : null}
      {Icon ? (
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            selected ? "bg-accent/20 text-accent" : "bg-surface-subtle text-brand-muted"
          )}
        >
          <Icon className="h-7 w-7" />
        </span>
      ) : null}
      <span className="font-sora text-base font-semibold text-brand tablet:text-lg">{title}</span>
      {hint ? <span className="text-xs text-text-muted tablet:text-sm">{hint}</span> : null}
    </button>
  );
}
