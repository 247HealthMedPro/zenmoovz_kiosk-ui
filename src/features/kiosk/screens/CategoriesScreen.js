"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell } from "@/components/ui/KioskShell";
import { KioskBackLink } from "@/components/ui/KioskBackLink";
import { copy } from "@/lib/constants/kioskCopy";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { cn } from "@/shared/utils/cn";

const cricket = {
  title: copy.cricketKit,
  href: "/kiosk/cricket/kit-categories",
  accent: "Cricket",
  image: "/kiosk/Cricket_Kit.jpeg",
  imageAlt: "Cricket kit",
};

const badminton = {
  title: copy.badmintonKit,
  href: "/kiosk/badminton",
  accent: "Badminton",
  image: "/kiosk/Badminton_Kit.jpeg",
  imageFallback: "/kiosk/Badminton_Kit.webp",
  imageAlt: "Badminton kit",
};

export function CategoriesScreen() {
  const { spring } = useMotionSafe();

  return (
    <div className="min-h-dvh bg-gradient-to-b from-surface to-surface-subtle">
      <AppShell className="min-h-dvh justify-center gap-10 py-10 tablet:gap-12 kiosk:gap-14 kiosk:py-14">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-center"
        >
          <h1 className="text-display">{copy.categoriesTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted tablet:text-xl">
            {copy.categoriesSubtitle}
          </p>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-8 kiosk:gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
        >
          <CategoryCard item={cricket} />
          <CategoryCard item={badminton} />
        </motion.div>

        <div className="flex justify-center">
          <KioskBackLink href="/kiosk">← Home</KioskBackLink>
        </div>
      </AppShell>
    </div>
  );
}

function CategoryCard({ item }) {
  const { spring } = useMotionSafe();
  const [src, setSrc] = useState(item.image);

  return (
    <motion.div whileHover={{ y: -4 }} transition={spring}>
      <Link
        href={item.href}
        className={cn(
          "group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl tablet:min-h-[340px] kiosk:min-h-[400px]",
          "border border-white/40 shadow-kiosk transition duration-300",
          "hover:shadow-kiosk hover:border-accent/40 active:scale-[0.99]"
        )}
      >
        <Image
          src={src}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
          onError={() => {
            if (item.imageFallback && src !== item.imageFallback) {
              setSrc(item.imageFallback);
            }
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-deep/95 via-brand/50 to-brand/20"
          aria-hidden
        />
        <div className="glass-panel relative m-5 border-white/25 p-6 tablet:m-6 tablet:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-muted tablet:text-sm">
            {item.accent}
          </span>
          <h2 className="mt-2 font-sora text-3xl font-semibold text-text-on-dark tablet:text-4xl kiosk:text-5xl">
            {item.title}
          </h2>
          <p className="mt-3 text-base text-text-on-dark/75 tablet:text-lg">
            Tap to explore →
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
