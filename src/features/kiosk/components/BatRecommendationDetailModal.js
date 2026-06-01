"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import {
  formatInr,
  formatRankType,
  formatSpecValue,
  formatTotalScore,
  SCORE_LABELS,
  SCORE_MAX,
  toSpecRows,
} from "@/lib/utils/batRecommendationFormat";
import { cn } from "@/shared/utils/cn";
import { BatMatchPercentageBadge } from "@/features/kiosk/components/BatMatchPercentageBadge";

function DetailBlock({ title, children, className }) {
  if (!children) return null;
  return (
    <section className={cn("rounded-kiosk-sm border border-border bg-surface-elevated p-4", className)}>
      <h3 className="font-sora mb-3 text-sm font-bold uppercase tracking-wide text-brand">{title}</h3>
      {children}
    </section>
  );
}

function SpecTable({ rows }) {
  if (!rows?.length) return null;
  return (
    <div className="divide-y divide-border font-outfit text-sm">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
        >
          <span className="text-text-muted">{label}</span>
          <span className="max-w-[60%] text-right font-medium text-brand">
            {formatSpecValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScoreBreakdown({ breakdown }) {
  if (!breakdown || typeof breakdown !== "object") return null;
  const entries = Object.entries(breakdown).filter(
    ([key, v]) => v != null && (SCORE_LABELS[key] || SCORE_MAX[key])
  );
  return (
    <div className="space-y-3">
      {entries.map(([key, raw]) => {
        const val = Number(raw) || 0;
        const cap = SCORE_MAX[key] ?? val;
        const pct = cap > 0 ? Math.min(100, (val / cap) * 100) : 0;
        const label = SCORE_LABELS[key] || key.replace(/([A-Z])/g, " $1").trim();
        return (
          <div key={key}>
            <div className="mb-1 flex justify-between font-outfit text-xs text-text-muted">
              <span>{label}</span>
              <span className="font-semibold text-brand">
                {cap > 0 ? `${val}/${cap}` : val}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BatRecommendationDetailModal({ rec, brand, open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!rec) return null;

  const ws = rec.willowSpec ?? {};
  const bs = rec.bladeSpec ?? {};
  const pt = rec.playerTarget ?? {};

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="no-print fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          role="presentation"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-brand/40 backdrop-blur-sm"
            aria-label="Close details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bat-detail-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative flex max-h-[min(92dvh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-kiosk border border-border bg-surface shadow-kiosk sm:rounded-kiosk"
          >
            <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border bg-brand px-4 py-4 sm:px-6">
              <div className="min-w-0 flex-1 pr-2">
                <p className="font-outfit text-xs font-semibold uppercase tracking-widest text-text-on-brand/80">
                  {brand || rec.brand}
                </p>
                <h2 id="bat-detail-title" className="font-sora text-lg font-bold text-text-on-brand sm:text-xl">
                  {rec.productName}
                </h2>
                <p className="font-outfit mt-1 text-sm text-text-on-brand/90">
                  {formatRankType(rec.rankType)} · {formatInr(rec.mrpPrice)}
                </p>
              </div>
              <div className="flex shrink-0 items-start gap-2">
                <BatMatchPercentageBadge
                  percentage={rec.matchPercentage}
                  isBest={rec.rankType === "BEST_MATCH"}
                  variant="modal"
                />
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-text-on-brand hover:bg-white/25"
                aria-label="Close"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
              </div>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
              <DetailBlock title="Overview">
                <dl className="font-outfit text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <dt className="text-text-muted">Total score</dt>
                    <dd className="font-medium text-brand">{formatTotalScore(rec)}</dd>
                  </div>
                </dl>
                {rec.shortMarketingDescription ? (
                  <p className="font-outfit mt-3 text-sm leading-relaxed text-text-primary">
                    {rec.shortMarketingDescription}
                  </p>
                ) : null}
                {rec.detailedDescription ? (
                  <p className="font-outfit mt-3 text-sm leading-relaxed text-text-muted">
                    {rec.detailedDescription}
                  </p>
                ) : null}
              </DetailBlock>

              {rec.recommendationReasons?.length ? (
                <DetailBlock title="Why this bat">
                  <ul className="font-outfit list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-primary">
                    {rec.recommendationReasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </DetailBlock>
              ) : null}

              <DetailBlock title="Score breakdown">
                <ScoreBreakdown breakdown={rec.scoreBreakdown} />
              </DetailBlock>

              <DetailBlock title="Willow spec">
                <SpecTable rows={toSpecRows(ws)} />
              </DetailBlock>

              <DetailBlock title="Blade spec">
                <SpecTable rows={toSpecRows(bs)} />
              </DetailBlock>

              <DetailBlock title="Player target">
                <SpecTable rows={toSpecRows(pt)} />
              </DetailBlock>
            </div>

            <footer className="shrink-0 border-t border-border bg-surface-subtle px-4 py-4 sm:px-6">
              <KioskButton type="button" className="w-full" onClick={onClose}>
                Close
              </KioskButton>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
