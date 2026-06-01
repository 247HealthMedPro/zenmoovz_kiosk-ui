"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FullscreenTopControl,
  LandingActionDock,
} from "@/features/kiosk/components/LandingActionDock";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { useFullscreenKiosk } from "@/features/kiosk/hooks/useFullscreenKiosk";

const DEFAULT_LOGO_VIDEO = "/videos/logo-animation.webm";

export function LandingScreen() {
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "ZenMoovz";
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
      className="relative min-h-dvh w-full overflow-hidden bg-surface"
    >
      {videoOk ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onError={() => setVideoOk(false)}
        >
          <source src={videoSrc} type="video/webm" />
        </video>
      ) : (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-surface-subtle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-sora text-4xl tracking-[0.15em] text-brand sm:text-6xl">{brand}</p>
        </motion.div>
      )}

      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/95 via-surface/20 to-transparent"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...fade, delay: reduced ? 0 : 0.1 }}
      />

      <FullscreenTopControl
        key={isFullscreen ? "minimize" : "fullscreen"}
        isFullscreen={isFullscreen}
        onEnter={enterFullscreen}
        onExit={exitFullscreen}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30"
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20 sm:px-8"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduced ? 0 : 0.15 }}
      >
        <LandingActionDock />
      </motion.div>
    </motion.div>
  );
}
