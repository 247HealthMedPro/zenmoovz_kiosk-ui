"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";
import { BatRecommendationCard } from "@/features/kiosk/components/BatRecommendationCard";
import {
  BatAiRichBestPick,
  BatAiRichInsightsOverview,
  BatAiRichInsightsSummary,
} from "@/features/kiosk/components/BatAiRichInsights";
import { DerivedProfileSection } from "@/features/kiosk/components/DerivedProfileSection";
import {
  getBatAiRichInfo,
  getBestBatRecommendation,
  hasBatAiRichContent,
} from "@/lib/utils/batAiRichInfo";
import { KitCategorySection } from "@/features/kiosk/components/KitCategorySection";
import { KitDerivedProfileSection } from "@/features/kiosk/components/KitDerivedProfileSection";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";
import { useAppSelector } from "@/lib/store/hooks";
import { formatCategoryLabel } from "@/lib/utils/kitCategoryFormat";
import {
  normalizeRecommendationReport,
  reportHasBat,
  reportKitCategories,
} from "@/lib/utils/normalizeRecommendationReport";
import { cn } from "@/shared/utils/cn";

function IconClose() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

export function CricketRecommendationReport({ report, onStartAgain }) {
  const router = useRouter();
  const { spring, reduced } = useMotionSafe();
  const selectedModes = useAppSelector((s) => s.kiosk.recommendationMode);

  const normalized = useMemo(() => normalizeRecommendationReport(report), [report]);
  const batRec = normalized?.batRecommendation;
  const kitRec = normalized?.kitRecommendation;

  const tabs = useMemo(() => {
    const list = [];
    const modes = selectedModes?.length ? selectedModes : null;

    if (reportHasBat(report) && (!modes || modes.includes("BAT"))) {
      list.push({ id: "BAT", label: copy.kitTabBat });
    }

    const kitCats = reportKitCategories(report).filter((block) => {
      if (!block?.topProducts?.length) return false;
      if (!modes) return true;
      return modes.includes(block.category);
    });

    kitCats.forEach((block) => {
      list.push({
        id: block.category,
        label: formatCategoryLabel(block.category),
      });
    });

    return list;
  }, [report, selectedModes]);

  const [activeTab, setActiveTab] = useState("BAT");

  const activeId = useMemo(() => {
    if (!tabs.length) return undefined;
    if (tabs.some((t) => t.id === activeTab)) return activeTab;
    return tabs[0].id;
  }, [tabs, activeTab]);

  const sectionMotion = {
    initial: { opacity: 0, y: reduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: spring,
  };

  const dp = batRec?.derivedProfile;
  const brands = batRec?.brandRecommendations ?? [];
  const aiRich = getBatAiRichInfo(batRec);
  const bestBat = getBestBatRecommendation(brands);
  const showAiRich = hasBatAiRichContent(aiRich);
  const activeKitBlock = reportKitCategories(report).find((c) => c.category === activeId);

  return (
    <div
      id="cricket-recommendation-report"
      className="mx-auto max-w-5xl overflow-hidden rounded-kiosk border border-border bg-surface-elevated text-text-primary shadow-kiosk"
    >
      <header className="flex items-center justify-between gap-3 bg-brand px-4 py-3 sm:px-6">
        <h1 className="font-sora text-lg font-bold tracking-tight text-text-on-brand sm:text-xl">
          Cricket kit recommendations
        </h1>
        <button
          type="button"
          onClick={() => router.push("/kiosk/categories")}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-kiosk-sm text-text-on-brand/90 hover:bg-white/10"
          aria-label="Close"
        >
          <IconClose />
        </button>
      </header>

      {tabs.length > 1 ? (
        <div
          className="border-b border-border bg-surface-subtle px-2 py-2 sm:px-4"
          role="tablist"
          aria-label="Recommendation categories"
        >
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {tabs.map((tab) => {
              const on = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "shrink-0 rounded-full border-2 px-4 py-2 font-outfit text-sm font-semibold transition",
                    on
                      ? "border-accent bg-brand text-text-on-brand shadow-kiosk-soft"
                      : "border-border bg-surface-elevated text-brand hover:border-brand/40"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-10 px-3 py-8 sm:px-6">
        {activeId === "BAT" && dp ? (
          <>
            <DerivedProfileSection
              derivedProfile={dp}
              categoryLabel="Bat"
              motionProps={sectionMotion}
            />

            {showAiRich ? (
              <BatAiRichInsightsOverview aiRich={aiRich} motionProps={sectionMotion} />
            ) : null}

            {showAiRich ? (
              <BatAiRichBestPick aiRich={aiRich} bestBat={bestBat} motionProps={sectionMotion} />
            ) : null}

            {brands.map((group, gi) => (
              <motion.section
                key={`${group.brand}-${gi}`}
                {...sectionMotion}
                className="overflow-hidden rounded-kiosk border border-border bg-surface shadow-kiosk-soft"
              >
                <div className="border-b border-border bg-surface-subtle px-4 py-3 sm:px-6">
                  <h2 className="font-sora text-xl font-bold text-brand">{group.brand}</h2>
                  <p className="font-outfit text-xs text-text-muted">Bat recommendations</p>
                </div>
                <div className="divide-y divide-border">
                  {(group.recommendations ?? []).map((rec) => (
                    <BatRecommendationCard
                      key={`${group.brand}-${rec.productCode}`}
                      rec={rec}
                      brand={group.brand}
                    />
                  ))}
                </div>
              </motion.section>
            ))}

            {showAiRich ? (
              <BatAiRichInsightsSummary aiRich={aiRich} motionProps={sectionMotion} />
            ) : null}
          </>
        ) : activeKitBlock ? (
          <>
            {kitRec?.profile ? (
              <KitDerivedProfileSection
                profile={kitRec.profile}
                categoryLabel={formatCategoryLabel(activeId)}
                motionProps={sectionMotion}
              />
            ) : null}
            <KitCategorySection categoryBlock={activeKitBlock} motionProps={sectionMotion} />
          </>
        ) : (
          <p className="text-center font-outfit text-text-muted">
            No recommendations for this category.
          </p>
        )}
      </div>

      <footer className="flex flex-col items-center justify-center gap-4 border-t border-border bg-surface px-6 py-8 sm:flex-row">
        <KioskButton type="button" className="min-w-[200px]" onClick={onStartAgain}>
          {copy.startAgain}
        </KioskButton>
        <Link href="/kiosk/categories">
          <KioskButton variant="ghost" type="button" className="min-w-[200px]">
            {copy.backToCategories}
          </KioskButton>
        </Link>
      </footer>
    </div>
  );
}
