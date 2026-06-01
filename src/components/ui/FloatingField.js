import { forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

export const FloatingField = forwardRef(function FloatingField(
  { id, label, error, success, className, inputClassName, ...inputProps },
  ref
) {
  return (
    <div className={cn("relative", className)}>
      <input
        ref={ref}
        id={id}
        placeholder=" "
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "peer block w-full min-h-[var(--touch-comfort)] rounded-xl border bg-surface-elevated px-4 pb-3 pt-7 text-lg text-brand outline-none transition focus:border-accent/60 tablet:text-xl",
          error && "border-error/70",
          success && !error && "border-brand/30",
          !error && !success && "border-border",
          inputClassName
        )}
        {...inputProps}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute start-5 top-2.5 z-10 origin-[0] -translate-y-1 scale-75 text-base text-text-muted transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2.5 peer-focus:-translate-y-1 peer-focus:scale-75 peer-focus:text-accent"
      >
        {label}
      </label>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      {success && !error && typeof success === "string" ? (
        <p className="mt-1.5 text-xs text-text-muted" role="status">
          {success}
        </p>
      ) : null}
    </div>
  );
});
