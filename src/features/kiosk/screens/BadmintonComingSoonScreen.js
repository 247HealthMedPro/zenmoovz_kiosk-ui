"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/ui/KioskShell";
import { KioskBackLink } from "@/components/ui/KioskBackLink";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";

const BADMINTON_IMAGES = ["/kiosk/Badminton_Kit.jpeg", "/kiosk/Badminton_Kit.webp"];

export function BadmintonComingSoonScreen() {
  const { spring } = useMotionSafe();
  const [imageSrc, setImageSrc] = useState(BADMINTON_IMAGES[0]);
  const [imageOk, setImageOk] = useState(true);

  const onImageError = () => {
    const idx = BADMINTON_IMAGES.indexOf(imageSrc);
    const next = BADMINTON_IMAGES[idx + 1];
    if (next) {
      setImageSrc(next);
      return;
    }
    setImageOk(false);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-brand-deep via-brand to-brand-light">
      {imageOk ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={onImageError}
        />
      ) : null}

      <div className="absolute inset-0 bg-brand-deep/75" aria-hidden />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <AppShell className="flex flex-1 flex-col items-center justify-center gap-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="ui-card-elevated w-full max-w-xl p-10 tablet:p-12"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
              {copy.badmintonKit}
            </p>
            <h1 className="mt-4 text-headline text-4xl tablet:text-5xl">{copy.comingSoonTitle}</h1>
            <p className="mt-4 text-lg text-text-muted tablet:text-xl">{copy.comingSoonBody}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <KioskBackLink href="/kiosk/categories">{copy.backToCategories}</KioskBackLink>
            <Link href="/kiosk">
              <KioskButton variant="ghost" size="lg">
                Back to home
              </KioskButton>
            </Link>
          </motion.div>
        </AppShell>
      </div>
    </div>
  );
}
