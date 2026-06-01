"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";

const BADMINTON_KIT_IMAGE = "/kiosk/Badminton_Kit.webp";

export function BadmintonComingSoonScreen() {
  const { spring } = useMotionSafe();
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <Image
          src={BADMINTON_KIT_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-surface/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/70 via-surface/85 to-surface" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        className="max-w-lg rounded-kiosk border border-border bg-surface-elevated/95 p-10 shadow-kiosk backdrop-blur-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          {copy.badmintonKit}
        </p>
        <h1 className="mt-4 font-sora text-5xl text-brand sm:text-6xl">{copy.comingSoonTitle}</h1>
        <p className="mt-4 text-lg text-text-muted">{copy.comingSoonBody}</p>
      </motion.div>
      <Link href="/kiosk/categories">
        <KioskButton variant="ghost">{copy.backToCategories}</KioskButton>
      </Link>
    </div>
  );
}
