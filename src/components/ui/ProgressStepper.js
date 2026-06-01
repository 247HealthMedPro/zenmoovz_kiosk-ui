"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { copy } from "@/lib/constants/kioskCopy";
import { useAppSelector } from "@/redux/hooks";

const STEPS = [
  { n: 1, href: "/kiosk/cricket/step-1", short: "1", label: copy.stepUser },
  { n: 2, href: "/kiosk/cricket/step-2", short: "2", label: copy.stepPhysical },
  { n: 3, href: "/kiosk/cricket/step-3", short: "3", label: copy.stepPlaying },
];

function canAccessStep(stepN, auth, kiosk) {
  if (stepN === 1) return true;
  if (stepN === 2) return auth.otpVerified;
  if (stepN === 3) return auth.otpVerified && Boolean(kiosk.genderCategory);
  return false;
}

export function ProgressStepper({ currentStep: currentProp }) {
  const pathname = usePathname();
  const auth = useAppSelector((s) => s.auth);
  const kiosk = useAppSelector((s) => s.kiosk);

  const current =
    currentProp ?? STEPS.find((s) => pathname.endsWith(`step-${s.n}`))?.n ?? 1;

  const progressPct = ((current - 1) / (STEPS.length - 1)) * 100;

  return (
    <nav aria-label="Progress" className="w-full">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-text-muted tablet:text-sm">
        <span className="shrink-0">
          Step <strong className="text-brand">{current}</strong> of {STEPS.length}
        </span>
        <span className="truncate text-right">{STEPS[current - 1]?.label}</span>
      </div>

      <div
        className="mb-3 h-1 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
      >
        <div
          className="h-full rounded-full bg-accent/80 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <ol className="flex w-full items-stretch gap-1.5 tablet:gap-2">
        {STEPS.map((s) => {
          const active = s.n === current;
          const done = s.n < current;
          const accessible = canAccessStep(s.n, auth, kiosk);

          const pillClass = cn(
            "flex h-full min-h-[2.75rem] w-full flex-col items-center justify-center rounded-lg border px-1.5 py-1.5 text-center transition tablet:min-h-[3rem]",
            active && "border-accent/50 bg-accent/8 text-brand",
            done && accessible && "border-brand/25 bg-brand-soft/50 text-brand",
            !active && !done && accessible && "border-border/80 bg-surface-elevated text-text-muted",
            !accessible && "cursor-not-allowed border-border/60 bg-surface-subtle/60 text-text-muted/45"
          );

          const badgeClass = cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tablet:h-7 tablet:w-7",
            active && "bg-accent text-text-on-brand",
            done && !active && "bg-brand/80 text-text-on-brand",
            !active && !done && "bg-surface-subtle text-text-muted"
          );

          const inner = (
            <>
              <span className={badgeClass}>{done && !active ? "✓" : s.short}</span>
              <span className="mt-0.5 hidden text-[10px] font-semibold leading-tight tablet:block">
                {s.label}
              </span>
            </>
          );

          return (
            <li key={s.href} className="flex min-w-0 flex-1 basis-0">
              {accessible ? (
                <Link
                  href={s.href}
                  aria-current={active ? "step" : undefined}
                  className={pillClass}
                >
                  {inner}
                </Link>
              ) : (
                <button type="button" disabled className={pillClass} aria-disabled="true">
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
