"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";
import { cn } from "@/shared/utils/cn";

function IconExpand({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
      />
    </svg>
  );
}

function IconCompress({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 4H4v5M4 4l5 5m6-1h5v5m0-5l-5 5M9 20H4v-5M4 20l5-5m6 1h5v-5m0 5l-5-5"
      />
    </svg>
  );
}

function IconArrowRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

const topChipClass =
  "font-outfit z-50 flex min-h-11 min-w-[11rem] items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated/95 px-4 py-2.5 text-sm font-semibold text-brand shadow-kiosk-soft backdrop-blur-md transition hover:border-brand/25 hover:bg-surface-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function LandingActionDock({ className }) {
  return (
    <motion.div
      className={cn("w-full max-w-md", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="rounded-kiosk border border-border bg-surface-elevated/95 p-3 shadow-kiosk backdrop-blur-xl sm:p-4"
        layout
      >
        <Link href="/kiosk/categories" className="block" onClick={(e) => e.stopPropagation()}>
          <KioskButton className="group w-full min-h-[3.75rem] gap-3 text-base shadow-kiosk-soft sm:min-h-[4rem] sm:text-lg">
            <span>{copy.startExperience}</span>
            <IconArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </KioskButton>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function FullscreenTopControl({ isFullscreen, onEnter, onExit, className }) {
  if (isFullscreen) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={cn(topChipClass, "border-accent/40 text-accent", className)}
        onClick={(e) => {
          e.stopPropagation();
          onExit();
        }}
        aria-label={copy.exitFullscreen}
      >
        <IconCompress className="h-4 w-4 shrink-0" />
        {copy.exitFullscreen}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(topChipClass, className)}
      onClick={(e) => {
        e.stopPropagation();
        onEnter();
      }}
      aria-label={copy.fullscreen}
    >
      <IconExpand className="h-4 w-4 shrink-0" />
      {copy.fullscreen}
    </motion.button>
  );
}
