import { cn } from "@/shared/utils/cn";

export function Skeleton({ className }) {
  return (
    <div
      className={cn("animate-pulse rounded-kiosk-sm bg-brand-soft", className)}
      aria-hidden
    />
  );
}
