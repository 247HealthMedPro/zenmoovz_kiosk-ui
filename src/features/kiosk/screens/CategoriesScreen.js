"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { copy } from "@/lib/constants/kioskCopy";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { cn } from "@/shared/utils/cn";

const cricket = {
  title: copy.cricketKit,
  href: "/kiosk/cricket/kit-categories",
  accent: "Cricket",
  image: "/kiosk/Cricket_Kit.jpeg",
  imageAlt: "Cricket kit",
  gradient: "from-brand-soft/80 via-transparent to-brand/20",
};

const badminton = {
  title: copy.badmintonKit,
  href: "/kiosk/badminton",
  accent: "Badminton",
  image: "/kiosk/Badminton_Kit.webp",
  imageAlt: "Badminton kit",
  gradient: "from-sky-100/80 via-transparent to-brand-soft/30",
};

export function CategoriesScreen() {
  const { spring } = useMotionSafe();

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-8 px-4 py-10 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="text-center"
      >
        <h1 className="font-sora text-4xl text-brand sm:text-5xl">Choose your sport</h1>
        <p className="mt-2 text-lg text-text-muted">Large cards · built for touch</p>
      </motion.header>

      <motion.div className="grid flex-1 gap-6 sm:grid-cols-2 sm:items-stretch">
        <CategoryCard item={cricket} delay={0} />
        <CategoryCard item={badminton} delay={0.08} />
      </motion.div>

      <div className="text-center">
        <Link
          href="/kiosk"
          className="text-text-muted underline-offset-4 hover:text-brand hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function CategoryCard({ item, delay }) {
  const { spring } = useMotionSafe();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
      className="h-full min-h-[220px]"
    >
      <Link
        href={item.href}
        className={cn(
          "group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-kiosk border border-border bg-surface-elevated p-8 shadow-[0_2px_12px_rgb(22_48_74/0.04)] transition hover:border-accent/50 hover:shadow-[0_6px_18px_rgb(22_48_74/0.07)] sm:min-h-[280px]"
        )}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-60 mix-blend-multiply",
              item.gradient
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/65 via-surface/30 to-transparent" />
        </div>
        <div className="relative z-10">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            {item.accent}
          </span>
          <h2 className="mt-2 font-sora text-4xl text-brand sm:text-5xl">{item.title}</h2>
          <p className="mt-4 text-text-muted opacity-0 transition group-hover:opacity-100">
            Tap to continue
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
