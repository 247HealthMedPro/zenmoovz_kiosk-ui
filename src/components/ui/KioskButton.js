import { cn } from "@/shared/utils/cn";

export function KioskButton({
  className,
  variant = "primary",
  size = "lg",
  disabled,
  type = "button",
  children,
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-accent to-accent-muted text-text-on-brand font-semibold shadow-kiosk-soft hover:brightness-105 active:scale-[0.98]",
    ghost:
      "border-2 border-border bg-surface-elevated text-brand font-medium hover:border-brand/30 hover:bg-surface-subtle active:scale-[0.98]",
    subtle:
      "bg-surface-subtle text-brand hover:bg-brand-soft/80 active:scale-[0.98]",
  };
  const sizes = {
    lg: "min-h-14 px-8 text-lg rounded-kiosk",
    md: "min-h-12 px-6 text-base rounded-kiosk-sm",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
