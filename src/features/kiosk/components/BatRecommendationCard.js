"use client";

import { useState } from "react";
import { copy } from "@/lib/constants/kioskCopy";
import { BatRecommendationDetailModal } from "@/features/kiosk/components/BatRecommendationDetailModal";
import { BatFallbackNotice } from "@/features/kiosk/components/BatFallbackNotice";
import { BatMatchPercentageBadge } from "@/features/kiosk/components/BatMatchPercentageBadge";
import { BatKnockingGuideModal } from "@/features/kiosk/components/BatKnockingGuideModal";
import {
  formatInr,
  formatRankType,
} from "@/lib/utils/batRecommendationFormat";
import { cn } from "@/shared/utils/cn";

function IconInfo() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function IconKnockingGuide() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

const CHIP_VARIANTS = {
  height: "bg-emerald-100 text-emerald-900",
  weight: "bg-sky-100 text-sky-900",
  bat: "bg-amber-100 text-amber-950",
  brand: "bg-slate-100 text-slate-700",
  role: "bg-rose-100 text-rose-950",
  style: "bg-rose-100 text-rose-950",
  hand: "bg-violet-100 text-violet-900",
};

function PlayerDetailChip({ label, variant = "brand" }) {
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 font-outfit text-sm font-bold",
        CHIP_VARIANTS[variant] ?? CHIP_VARIANTS.brand
      )}
    >
      {label}
    </span>
  );
}

function buildPlayerDetailChips(pm) {
  const chips = [];

  if (pm.matchedPlayerHeightCm != null && pm.matchedPlayerHeightCm !== "") {
    chips.push({ label: `${pm.matchedPlayerHeightCm}cm`, variant: "height" });
  }
  if (pm.matchedPlayerWeightKg != null && pm.matchedPlayerWeightKg !== "") {
    chips.push({ label: `${pm.matchedPlayerWeightKg}kg`, variant: "weight" });
  }
  if (pm.matchedPlayerBatWeightKg != null && pm.matchedPlayerBatWeightKg !== "") {
    chips.push({ label: `${pm.matchedPlayerBatWeightKg}kg bat`, variant: "bat" });
  }
  if (pm.matchedPlayerRole) {
    chips.push({ label: pm.matchedPlayerRole, variant: "role" });
  }
  if (pm.matchedPlayerStyle) {
    chips.push({ label: pm.matchedPlayerStyle, variant: "style" });
  }
  if (pm.matchedPlayerHand) {
    chips.push({ label: pm.matchedPlayerHand, variant: "hand" });
  }

  return chips;
}

function PlayerMatchBlock({ pm }) {
  if (!pm || !Object.keys(pm).length) return null;

  const matchPct = parseInt(String(pm.batMatchPercent || "").replace(/\D/g, ""), 10) || 0;
  const chips = buildPlayerDetailChips(pm);

  return (
    <div className="rounded-kiosk-sm border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/60 p-4">
      <p className="font-sora text-xs font-bold uppercase tracking-wide text-amber-900">
        Player match
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {pm.recommendedPlayerProfile ? (
            <p className="font-sora text-base font-bold text-brand">{pm.recommendedPlayerProfile}</p>
          ) : null}
          {chips.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <PlayerDetailChip key={`${chip.variant}-${chip.label}`} {...chip} />
              ))}
            </div>
          ) : null}
          {pm.matchReason ? (
            <p className="font-outfit mt-3 text-xs leading-relaxed text-text-muted">{pm.matchReason}</p>
          ) : null}
        </div>
        {pm.batMatchPercent ? (
          <div className="shrink-0 sm:text-right">
            <p className="font-outfit text-xs font-semibold uppercase text-amber-900/80">Style match</p>
            <p className="font-sora text-2xl font-black text-amber-950">{pm.batMatchPercent}</p>
          </div>
        ) : null}
      </div>
      {matchPct > 0 ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-200/70">
          <div
            className="h-full rounded-full bg-amber-600 transition-all"
            style={{ width: `${Math.min(100, matchPct)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function BatRecommendationCard({ rec, brand }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const isBest = rec.rankType === "BEST_MATCH";
  const displayBrand = rec.brand || brand;
  // const pm = rec.playerMatch ?? {};
  const productCode = rec.productCode;

  return (
    <>
      <div>
        {rec.fallback && rec.fallbackReason ? (
          <div className="border-b border-sky-200/80 bg-sky-50 px-4 py-3 sm:px-5">
            <BatFallbackNotice rec={rec} />
          </div>
        ) : null}

        <article className="relative bg-surface-elevated p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 font-outfit text-xs font-bold uppercase tracking-wide",
                isBest ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
              )}
            >
              {formatRankType(rec.rankType)}
            </span>
            <span className="font-outfit text-sm font-semibold uppercase tracking-wider text-accent">
              {displayBrand}
            </span>
          </div>
          <div className="flex shrink-0 gap-2">
            {productCode ? (
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="kiosk-touch flex items-center justify-center rounded-full border-2 border-border bg-surface text-brand shadow-kiosk-soft transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
                aria-label={copy.batKnockingGuide}
              >
                <IconKnockingGuide />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="kiosk-touch flex items-center justify-center rounded-full border-2 border-border bg-surface text-brand shadow-kiosk-soft transition hover:border-accent hover:bg-brand-soft hover:text-accent"
              aria-label={copy.viewDetails}
            >
              <IconInfo />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="font-sora min-w-0 flex-1 text-xl font-bold leading-snug text-brand sm:text-2xl">
            {rec.productName}
          </h3>
          <BatMatchPercentageBadge percentage={rec.matchPercentage} isBest={isBest} />
        </div>

        <p className="font-sora mt-2 text-2xl font-bold text-accent sm:text-3xl">
          {formatInr(rec.mrpPrice)}
        </p>

        {rec.shortMarketingDescription ? (
          <p className="font-outfit mt-4 text-sm leading-relaxed text-text-primary sm:text-base">
            {rec.shortMarketingDescription}
          </p>
        ) : null}

        {/* Player match section — temporarily hidden
        <div className="mt-5">
          <PlayerMatchBlock pm={pm} />
        </div>
        */}

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="font-outfit kiosk-touch flex w-full items-center justify-center gap-3 rounded-kiosk border-2 border-border bg-surface-subtle text-base font-semibold text-brand transition hover:border-brand/30 hover:bg-brand-soft kiosk:text-lg"
          >
            <IconInfo />
            {copy.viewDetails}
          </button>
          {productCode ? (
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="font-outfit kiosk-touch flex w-full items-center justify-center gap-3 rounded-kiosk border-2 border-amber-200 bg-amber-50/80 text-base font-semibold text-amber-950 transition hover:border-amber-300 hover:bg-amber-100 kiosk:text-lg"
            >
              <IconKnockingGuide />
              {copy.batKnockingGuide}
            </button>
          ) : null}
        </div>
        </article>
      </div>

      <BatRecommendationDetailModal
        rec={rec}
        brand={displayBrand}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      <BatKnockingGuideModal
        productCode={productCode}
        productName={rec.productName}
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </>
  );
}
