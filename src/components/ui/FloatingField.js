import { forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

export const FloatingField = forwardRef(function FloatingField(
  { id, label, error, className, inputClassName, ...inputProps },
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
          "peer block w-full rounded-kiosk-sm border-2 border-border bg-surface-elevated px-4 pb-2.5 pt-6 text-lg text-brand outline-none transition focus:border-accent",
          inputClassName
        )}
        {...inputProps}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute start-4 top-2 z-10 origin-[0] -translate-y-1 scale-75 transform text-sm text-text-muted transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-1 peer-focus:scale-75 peer-focus:text-accent"
      >
        {label}
      </label>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
