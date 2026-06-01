"use client";

import { motion } from "framer-motion";
import { KioskBackLink } from "@/components/ui/KioskBackLink";
import { ProgressStepper } from "@/components/ui/ProgressStepper";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { cn } from "@/shared/utils/cn";

export function WizardLayout({
  children,
  title,
  subtitle,
  step,
  compact = false,
  backHref = "/kiosk/cricket/kit-categories",
  backLabel = "← Kit",
  badge = "Cricket",
}) {
  const { fade } = useMotionSafe();

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <div
        className={cn(
          "wizard-shell flex flex-1 flex-col",
          compact ? "py-4 tablet:py-5" : "py-6 tablet:py-8 kiosk:py-10"
        )}
      >
        <header
          className={cn("shrink-0", compact ? "space-y-3" : "space-y-5 tablet:space-y-6")}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <KioskBackLink href={backHref} className="justify-self-start">
              {backLabel}
            </KioskBackLink>
            <span className="justify-self-center text-center text-xs font-bold uppercase tracking-[0.2em] text-accent tablet:text-sm">
              {badge}
            </span>
            <span className="justify-self-end" aria-hidden />
          </div>

          <ProgressStepper currentStep={step} />

          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fade}
            className="text-center"
          >
            <h1 className="text-display">{title}</h1>
            {subtitle ? (
              <p
                className={cn(
                  "mx-auto max-w-xl text-text-muted",
                  compact ? "mt-1.5 text-sm" : "mt-3 text-base tablet:text-lg kiosk:text-xl"
                )}
              >
                {subtitle}
              </p>
            ) : null}
          </motion.div>
        </header>

        <motion.main
          key={`step-${step}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fade, delay: 0.06 }}
          className={cn(
            "flex flex-1 flex-col items-center",
            compact ? "justify-start pt-3" : "justify-center py-8 tablet:py-10 kiosk:py-12"
          )}
        >
          <div className="w-full max-w-[var(--max-form)] mx-auto">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
