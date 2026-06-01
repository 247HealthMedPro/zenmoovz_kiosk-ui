"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { copy } from "@/lib/constants/kioskCopy";
import { useAppSelector } from "@/redux/hooks";

const STEPS = [
  { n: 1, href: "/kiosk/cricket/step-1", label: copy.stepUser },
  { n: 2, href: "/kiosk/cricket/step-2", label: copy.stepPhysical },
  { n: 3, href: "/kiosk/cricket/step-3", label: copy.stepPlaying },
];

function canAccessStep(stepN, auth, kiosk) {
  if (stepN === 1) return true;
  if (stepN === 2) return auth.otpVerified;
  if (stepN === 3) return auth.otpVerified && Boolean(kiosk.genderCategory);
  return false;
}

export function WizardStepper() {
  const pathname = usePathname();
  const auth = useAppSelector((s) => s.auth);
  const kiosk = useAppSelector((s) => s.kiosk);

  const current = STEPS.find((s) => pathname.endsWith(`step-${s.n}`))?.n ?? 1;

  return (
    <nav aria-label="Cricket wizard progress" className="w-full">
      <ol className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        {STEPS.map((s) => {
          const active = s.n === current;
          const done = s.n < current;
          const accessible = canAccessStep(s.n, auth, kiosk);

          const className = cn(
            "flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 px-4 text-sm font-semibold transition sm:min-w-0 sm:px-5 sm:text-base",
            active && "border-accent bg-accent/15 text-brand",
            done && accessible && "border-brand/40 bg-brand-soft text-brand",
            !active && !done && accessible && "border-border bg-surface-elevated text-text-muted",
            !accessible && "cursor-not-allowed border-border/80 bg-surface-subtle text-text-muted/60"
          );

          return (
            <li key={s.href} className="flex items-center gap-2">
              {accessible ? (
                <Link href={s.href} aria-current={active ? "step" : undefined} className={className}>
                  <span className="sr-only">Step {s.n}: </span>
                  {s.n}. {s.label}
                </Link>
              ) : (
                <button type="button" disabled className={className} aria-disabled="true">
                  <span className="sr-only">Step {s.n} (locked): </span>
                  {s.n}. {s.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
