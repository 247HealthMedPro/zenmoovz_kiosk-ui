"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WizardStepper } from "@/features/kiosk/components/WizardStepper";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { cn } from "@/shared/utils/cn";

export function CricketWizardShell({ children, title, subtitle, compact = false }) {
  const { fade } = useMotionSafe();
  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh max-w-3xl flex-col px-4 sm:px-8",
        compact ? "gap-5 py-5" : "gap-8 py-8"
      )}
    >
      <header className={cn("text-center", compact ? "space-y-2" : "space-y-4")}>
        <motion.div className="flex items-center justify-between gap-4">
          <Link
            href="/kiosk/cricket/kit-categories"
            className="min-h-[44px] min-w-[44px] rounded-kiosk-sm border border-border bg-surface-elevated px-3 py-2 text-sm text-text-muted shadow-kiosk-soft hover:border-brand/25 hover:text-brand"
          >
            ← Kit
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Cricket</p>
          <span className="w-[72px]" aria-hidden />
        </motion.div>
        <WizardStepper />
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={fade}
        >
          <h1 className="font-sora text-4xl text-brand sm:text-5xl">{title}</h1>
          {subtitle ? (
            <p className={cn("text-lg text-text-muted", compact ? "mt-1" : "mt-2")}>{subtitle}</p>
          ) : null}
        </motion.div>
      </header>
      <motion.main
        key={title}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...fade, delay: 0.05 }}
        className="flex-1"
      >
        {children}
      </motion.main>
    </div>
  );
}
