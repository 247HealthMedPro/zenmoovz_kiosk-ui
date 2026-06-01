import { cn } from "@/shared/utils/cn";

export function KioskButton({
  className,
  variant = "primary",
  size = "lg",
  disabled,
  type = "button",
  children,
  loading,
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-brand to-brand-light text-text-on-brand shadow-kiosk hover:brightness-110 active:scale-[0.98]",
    accent:
      "bg-gradient-to-r from-accent to-accent-muted text-text-on-brand shadow-kiosk-soft hover:brightness-105 active:scale-[0.98]",
    ghost:
      "border-2 border-border bg-surface-elevated text-brand font-semibold hover:border-brand/35 hover:bg-surface-subtle active:scale-[0.98]",
    subtle:
      "border-2 border-transparent bg-surface-subtle text-brand font-semibold hover:bg-brand-soft active:scale-[0.98]",
    outline:
      "border-2 border-brand/40 bg-transparent text-brand hover:bg-brand/5 active:scale-[0.98]",
  };
  const sizes = {
    xl: "min-h-[var(--touch-large)] px-10 text-xl rounded-kiosk-lg",
    lg: "min-h-[var(--touch-comfort)] px-8 text-lg rounded-kiosk",
    md: "min-h-[var(--touch-min)] px-6 text-base rounded-kiosk-sm",
  };
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-3 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
