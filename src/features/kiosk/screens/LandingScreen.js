"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { FullscreenTopControl } from "@/features/kiosk/components/LandingActionDock";
import { copy } from "@/lib/constants/kioskCopy";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { useFullscreenKiosk } from "@/features/kiosk/hooks/useFullscreenKiosk";

const DEFAULT_LOGO_VIDEO = "/videos/logo-animation.webm";

function IconArrowRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

export function LandingScreen() {
  const videoSrc =
    process.env.NEXT_PUBLIC_LOGO_VIDEO_SRC?.trim() ||
    process.env.NEXT_PUBLIC_LANDING_VIDEO_URL?.trim() ||
    DEFAULT_LOGO_VIDEO;
  const { fade, spring, reduced } = useMotionSafe();
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreenKiosk();
  const [videoOk, setVideoOk] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fade}
      className="relative min-h-dvh w-full overflow-hidden bg-surface-dark"
    >
      {videoOk ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onError={() => setVideoOk(false)}
        >
          <source src={videoSrc} type="video/webm" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep via-brand to-brand-light" aria-hidden />
      )}

      <div className="hero-overlay pointer-events-none absolute inset-0" aria-hidden />

      <FullscreenTopControl
        key={isFullscreen ? "minimize" : "fullscreen"}
        isFullscreen={isFullscreen}
        onEnter={enterFullscreen}
        onExit={exitFullscreen}
        className="absolute right-[var(--gutter)] top-[max(1rem,env(safe-area-inset-top))] z-30"
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-[var(--gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduced ? 0 : 0.15 }}
      >
        <Link href="/kiosk/categories" className="block w-full max-w-md tablet:max-w-lg">
          <KioskButton size="xl" className="group w-full gap-4 shadow-kiosk">
            <span>{copy.startExperience}</span>
            <IconArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
          </KioskButton>
        </Link>
      </motion.div>
    </motion.div>
  );
}
