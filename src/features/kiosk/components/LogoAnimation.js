"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";

const DEFAULT_LOGO_WEBM = "/videos/logo-animation.webm";

/**
 * Animated brand logo (WebM). Falls back to static image or wordmark text.
 */
export function LogoAnimation({
  brandName = "ZenMoovz",
  className,
  videoClassName,
  width = 280,
  height = 120,
}) {
  const videoSrc =
    process.env.NEXT_PUBLIC_LOGO_VIDEO_SRC?.trim() || DEFAULT_LOGO_WEBM;
  const staticLogo = process.env.NEXT_PUBLIC_LOGO_SRC?.trim();
  const { spring } = useMotionSafe();
  const [videoOk, setVideoOk] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className={cn("flex flex-col items-center", className)}
    >
      {videoOk ? (
        <video
          className={cn(
            "h-auto max-h-28 w-auto max-w-[min(90vw,320px)] object-contain drop-shadow-kiosk sm:max-h-32",
            videoClassName
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          width={width}
          height={height}
          aria-label={`${brandName} logo`}
          onError={() => setVideoOk(false)}
        >
          <source src={videoSrc} type="video/webm" />
        </video>
      ) : staticLogo ? (
        <Image
          src={staticLogo}
          alt=""
          width={width}
          height={height}
          className="h-16 w-auto max-w-[min(90vw,280px)] object-contain drop-shadow-kiosk sm:h-20"
          priority
        />
      ) : (
        <p className="font-sora text-5xl tracking-[0.2em] text-brand drop-shadow-sm sm:text-6xl md:text-7xl">
          {brandName}
        </p>
      )}
    </motion.div>
  );
}
