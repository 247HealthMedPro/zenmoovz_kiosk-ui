"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { copy } from "@/lib/constants/kioskCopy";
import { useGetRecommendationCategoriesQuery } from "@/lib/store/api/categoriesApi";
import { setRecommendationMode } from "@/lib/store/slices/kioskSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import {
  formatCategoryLabel,
  KIT_CATEGORY_GROUPS,
} from "@/lib/utils/kitCategoryFormat";
import { cn } from "@/shared/utils/cn";

export function CricketKitCategoriesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.kiosk.recommendationMode);
  const { data: apiCategories, isLoading, isError, refetch } = useGetRecommendationCategoriesQuery();
  const { spring } = useMotionSafe();

  const available = useMemo(() => new Set(apiCategories ?? []), [apiCategories]);

  const [selected, setSelected] = useState(() => new Set(saved));

  useEffect(() => {
    if (!apiCategories?.length) return;
    setSelected((prev) => {
      if (prev.size > 0) {
        const next = new Set([...prev].filter((c) => available.has(c)));
        return next.size > 0 ? next : new Set(apiCategories.includes("BAT") ? ["BAT"] : [apiCategories[0]]);
      }
      if (apiCategories.includes("BAT")) return new Set(["BAT"]);
      return new Set([apiCategories[0]]);
    });
  }, [apiCategories, available]);

  const groups = useMemo(() => {
    if (!apiCategories?.length) return [];
    return KIT_CATEGORY_GROUPS.map((g) => ({
      ...g,
      categories: g.categories.filter((c) => available.has(c)),
    })).filter((g) => g.categories.length > 0);
  }, [apiCategories, available]);

  const uncategorized = useMemo(() => {
    const grouped = new Set(KIT_CATEGORY_GROUPS.flatMap((g) => g.categories));
    return (apiCategories ?? []).filter((c) => !grouped.has(c));
  }, [apiCategories]);

  const toggle = (code) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const setGroup = (codes, on) => {
    setSelected((prev) => {
      const next = new Set(prev);
      codes.forEach((c) => (on ? next.add(c) : next.delete(c)));
      return next;
    });
  };

  const onContinue = () => {
    const modes = [...selected];
    if (!modes.length) return;
    dispatch(setRecommendationMode(modes));
    router.push("/kiosk/cricket/step-1");
  };

  const count = selected.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-8 sm:px-8"
    >
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/kiosk/categories"
            className="min-h-[44px] rounded-kiosk-sm border border-border bg-surface-elevated px-3 py-2 text-sm text-text-muted shadow-kiosk-soft hover:border-brand/25 hover:text-brand"
          >
            ← Sports
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Cricket</p>
          <span className="w-[72px]" aria-hidden />
        </div>
        <h1 className="font-sora text-4xl text-brand sm:text-5xl">{copy.kitCategoriesTitle}</h1>
        <p className="text-lg text-text-muted">{copy.kitCategoriesSubtitle}</p>
      </header>

      <main className="mt-8 flex-1 space-y-8 pb-32">
        {isLoading ? (
          <motion.div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <p className="text-center text-sm text-text-muted">{copy.kitCategoriesLoading}</p>
          </motion.div>
        ) : isError || !apiCategories?.length ? (
          <motion.div className="rounded-kiosk border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-outfit text-sm text-red-800">{copy.kitCategoriesError}</p>
            <KioskButton type="button" className="mt-4" onClick={() => refetch()}>
              {copy.tryAgain}
            </KioskButton>
          </motion.div>
        ) : (
          <>
            {groups.map((group) => (
              <CategoryGroup
                key={group.id}
                group={group}
                selected={selected}
                onToggle={toggle}
                onSelectAll={() => setGroup(group.categories, true)}
                onClear={() => setGroup(group.categories, false)}
              />
            ))}
            {uncategorized.length > 0 ? (
              <CategoryGroup
                group={{
                  id: "other",
                  title: "More gear",
                  description: "Additional categories",
                  categories: uncategorized,
                }}
                selected={selected}
                onToggle={toggle}
                onSelectAll={() => setGroup(uncategorized, true)}
                onClear={() => setGroup(uncategorized, false)}
              />
            ) : null}
          </>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-md sm:px-8">
        <motion.div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center font-outfit text-sm text-text-muted sm:text-left">
            <span className="font-semibold text-brand">{count}</span> {copy.kitCategoriesSelected}
            {count === 0 ? (
              <span className="block text-red-600">{copy.kitCategoriesSelectOne}</span>
            ) : null}
          </p>
          <KioskButton
            type="button"
            className="w-full sm:min-w-[240px] sm:w-auto"
            disabled={count === 0 || isLoading}
            onClick={onContinue}
          >
            {copy.kitCategoriesContinue}
          </KioskButton>
        </motion.div>
      </footer>
    </motion.div>
  );
}

function CategoryGroup({ group, selected, onToggle, onSelectAll, onClear }) {
  const allOn = group.categories.every((c) => selected.has(c));
  return (
    <section className="rounded-kiosk border border-border bg-surface-elevated p-4 shadow-kiosk-soft sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-sora text-lg font-bold text-brand">{group.title}</h2>
          <p className="font-outfit text-xs text-text-muted">{group.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={allOn ? onClear : onSelectAll}
            className="min-h-10 rounded-kiosk-sm border border-border px-3 text-xs font-semibold text-brand hover:bg-surface-subtle"
          >
            {allOn ? copy.kitCategoriesClear : copy.kitCategoriesSelectAll}
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {group.categories.map((code) => {
          const on = selected.has(code);
          return (
            <motion.button
              key={code}
              type="button"
              layout
              whileTap={{ scale: 0.97 }}
              aria-pressed={on}
              onClick={() => onToggle(code)}
              className={cn(
                "min-h-11 rounded-full border-2 px-4 py-2 font-outfit text-sm font-semibold transition",
                on
                  ? "border-accent bg-gradient-to-br from-accent/20 to-brand-soft text-brand shadow-kiosk-soft"
                  : "border-border bg-surface text-text-muted hover:border-brand/30"
              )}
            >
              {formatCategoryLabel(code)}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
