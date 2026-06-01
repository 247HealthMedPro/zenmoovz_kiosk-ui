"use client";

import { motion } from "framer-motion";
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

const topChipClass =
  "kiosk-touch flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-brand-deep/80 px-5 text-sm font-semibold text-text-on-dark shadow-kiosk backdrop-blur-md transition hover:bg-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function FullscreenTopControl({ isFullscreen, onEnter, onExit, className }) {
  if (isFullscreen) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(topChipClass, "border-accent/50", className)}
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

/** @deprecated Landing embeds CTA directly */
export function LandingActionDock() {
  return null;
}
