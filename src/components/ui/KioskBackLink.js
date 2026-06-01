import Link from "next/link";
import { cn } from "@/shared/utils/cn";

export function KioskBackLink({ href, children, className }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-[var(--touch-min)] items-center justify-center rounded-xl border-2 border-border bg-surface-elevated px-4 text-sm font-semibold text-text-muted shadow-sm transition hover:border-brand/30 hover:text-brand active:scale-[0.98] tablet:px-5 tablet:text-base",
        className
      )}
    >
      {children}
    </Link>
  );
}
