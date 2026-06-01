"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/ui/KioskShell";
import { KioskBackLink } from "@/components/ui/KioskBackLink";
import { KioskButton } from "@/components/ui/KioskButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { copy } from "@/lib/constants/kioskCopy";
import { useGetRecommendationCategoriesQuery } from "@/redux/api/categoriesApi";
import { setRecommendationMode } from "@/api/kioskSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
    <div className="min-h-dvh bg-gradient-to-b from-surface to-surface-subtle">
      <AppShell
        as={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="pb-36 kiosk:pb-40"
      >
        <header className="space-y-4 py-8 text-center tablet:space-y-5 kiosk:py-10">
          <div className="flex items-center justify-between gap-4">
            <KioskBackLink href="/kiosk/categories">← Sports</KioskBackLink>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent tablet:text-sm">
              Cricket
            </span>
            <span className="w-[5.5rem] tablet:w-[6.5rem]" aria-hidden />
          </div>
          <h1 className="text-display">{copy.kitCategoriesTitle}</h1>
          <p className="mx-auto max-w-2xl text-lg text-text-muted tablet:text-xl">
            {copy.kitCategoriesSubtitle}
          </p>
        </header>

        <main className="space-y-6 tablet:space-y-8 kiosk:grid kiosk:grid-cols-2 kiosk:gap-8 kiosk:space-y-0">
          {isLoading ? (
            <div className="kiosk:col-span-2 space-y-4">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <p className="text-center text-text-muted">{copy.kitCategoriesLoading}</p>
            </div>
          ) : isError || !apiCategories?.length ? (
            <div className="kiosk:col-span-2 ui-card-elevated p-8 text-center">
              <p className="text-error">{copy.kitCategoriesError}</p>
              <KioskButton type="button" className="mt-4" onClick={() => refetch()}>
                {copy.tryAgain}
              </KioskButton>
            </div>
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

        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface-elevated/98 shadow-kiosk">
          <div className="app-shell flex flex-col gap-4 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
            <p className="text-center text-base text-text-muted tablet:text-left">
              <span className="font-semibold text-brand">{count}</span> {copy.kitCategoriesSelected}
              {count === 0 ? (
                <span className="mt-1 block text-error">{copy.kitCategoriesSelectOne}</span>
              ) : null}
            </p>
            <KioskButton
              type="button"
              size="xl"
              className="w-full tablet:min-w-[280px] tablet:w-auto"
              disabled={count === 0 || isLoading}
              onClick={onContinue}
            >
              {copy.kitCategoriesContinue}
            </KioskButton>
          </div>
        </footer>
      </AppShell>
    </div>
  );
}

function CategoryGroup({ group, selected, onToggle, onSelectAll, onClear }) {
  const allOn = group.categories.every((c) => selected.has(c));
  return (
    <section className="ui-card-elevated p-5 tablet:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-sora text-xl font-bold text-brand">{group.title}</h2>
          <p className="mt-1 text-sm text-text-muted">{group.description}</p>
        </div>
        <button
          type="button"
          onClick={allOn ? onClear : onSelectAll}
          className="kiosk-touch rounded-xl border-2 border-border px-4 text-sm font-semibold text-brand hover:bg-surface-subtle"
        >
          {allOn ? copy.kitCategoriesClear : copy.kitCategoriesSelectAll}
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {group.categories.map((code) => {
          const on = selected.has(code);
          return (
            <button
              key={code}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(code)}
              className={cn(
                "kiosk-touch rounded-full border-2 px-5 text-sm font-semibold transition active:scale-[0.98] tablet:text-base",
                on ? "ui-card-selected border-accent" : "border-border bg-surface text-text-muted"
              )}
            >
              {formatCategoryLabel(code)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
