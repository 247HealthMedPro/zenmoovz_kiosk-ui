import { cn } from "@/shared/utils/cn";

export function Skeleton({ className }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-surface-subtle", className)}
      aria-hidden
    />
  );
}
