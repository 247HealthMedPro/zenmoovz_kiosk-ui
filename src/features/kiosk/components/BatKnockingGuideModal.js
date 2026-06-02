"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { useGetKnockingGuideQuery } from "@/redux/api/knockingGuideApi";
import { copy } from "@/lib/constants/kioskCopy";
import { cn } from "@/shared/utils/cn";

const PHASE_STYLES = [
  { card: "border-l-emerald-500 bg-emerald-50/90", tag: "bg-emerald-100/90 text-emerald-900" },
  { card: "border-l-sky-500 bg-sky-50/90", tag: "bg-sky-100/90 text-sky-900" },
  { card: "border-l-violet-500 bg-violet-50/90", tag: "bg-violet-100/90 text-violet-900" },
  { card: "border-l-amber-500 bg-amber-50/90", tag: "bg-amber-100/90 text-amber-900" },
  { card: "border-l-teal-500 bg-teal-50/90", tag: "bg-teal-100/90 text-teal-900" },
];

function guideSubtitle(guide) {
  if (!guide) return "";
  const parts = [guide.willowType, guide.willowGrade].filter(Boolean);
  if (guide.alreadyKnockedIn) parts.push("Already knocked in");
  else if (guide.prePrepared) parts.push("Pre-prepared");
  else parts.push("New bat");
  return parts.join(" · ");
}

function PhaseCard({ phase, index }) {
  const style = PHASE_STYLES[index % PHASE_STYLES.length];
  const knockLabel = phase.knockCount ? ` · ${phase.knockCount}` : "";

  return (
    <article
      className={cn(
        "rounded-kiosk-sm border border-border/60 border-l-[5px] p-4 sm:p-5",
        style.card
      )}
    >
      <h3 className="font-sora text-base font-bold text-brand sm:text-lg">
        Phase {phase.number} — {phase.title}
        {phase.dayRange ? (
          <span className="font-outfit font-semibold text-text-muted">
            {" "}
            ({phase.dayRange}
            {knockLabel})
          </span>
        ) : null}
      </h3>
      {phase.description ? (
        <p className="font-outfit mt-2 text-sm leading-relaxed text-text-primary sm:text-[15px]">
          {phase.description}
        </p>
      ) : null}
      {phase.tags?.length ? (
        <motion.div className="mt-3 flex flex-wrap gap-2">
          {phase.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full px-3 py-1 font-outfit text-xs font-semibold",
                style.tag
              )}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      ) : null}
    </article>
  );
}

function RuleList({ items, variant }) {
  if (!items?.length) return null;
  const isDo = variant === "do";

  return (
    <ul className="space-y-3 font-outfit text-sm">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              isDo ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
            )}
            aria-hidden
          >
            {isDo ? "✓" : "×"}
          </span>
          <motion.div className="min-w-0">
            <p className="font-medium leading-snug text-brand">{item.rule}</p>
            {item.reason ? (
              <p className="mt-1 text-xs leading-relaxed text-text-muted">{item.reason}</p>
            ) : null}
          </motion.div>
        </li>
      ))}
    </ul>
  );
}

function GuideSkeleton() {
  return (
    <motion.div className="space-y-4 px-4 py-6 sm:px-6" aria-busy="true">
      <motion.div className="h-20 animate-pulse rounded-kiosk-sm bg-surface-subtle" />
      <motion.div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((n) => (
          <motion.div key={n} className="h-16 animate-pulse rounded-kiosk-sm bg-surface-subtle" />
        ))}
      </motion.div>
      {[1, 2, 3].map((n) => (
        <motion.div key={n} className="h-28 animate-pulse rounded-kiosk-sm bg-surface-subtle" />
      ))}
    </motion.div>
  );
}

export function BatKnockingGuideModal({ productCode, productName, open, onClose }) {
  const { data: guide, isLoading, isFetching, isError, error, refetch } =
    useGetKnockingGuideQuery(productCode, { skip: !open || !productCode });

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

  const loading = isLoading || isFetching;
  const phaseCount = guide?.phases?.length ?? 0;
  const errMsg =
    error?.data?.message || (typeof error === "string" ? error : copy.knockingGuideError);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="no-print fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          role="presentation"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-brand/45 backdrop-blur-sm"
            aria-label="Close knocking guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="knocking-guide-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative flex max-h-[min(94dvh,920px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-kiosk border border-border bg-surface shadow-kiosk sm:rounded-kiosk"
          >
            <header className="shrink-0 bg-[#3d2914] px-4 py-4 sm:px-6">
              <motion.div className="flex items-start justify-between gap-3">
                <motion.div className="min-w-0">
                  <h2
                    id="knocking-guide-title"
                    className="font-sora text-lg font-bold text-white sm:text-xl"
                  >
                    {copy.batKnockingGuide}
                  </h2>
                  <p className="font-outfit mt-1 text-sm text-white/85">
                    {guide ? guideSubtitle(guide) : productName || productCode || "—"}
                  </p>
                  {guide?.productName ? (
                    <p className="font-outfit mt-0.5 text-xs text-white/70">{guide.productName}</p>
                  ) : null}
                </motion.div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                  aria-label="Close"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </motion.div>
            </header>

            <motion.div className="flex-1 overflow-y-auto">
              {loading && !guide ? (
                <GuideSkeleton />
              ) : isError && !guide ? (
                <motion.div className="px-4 py-10 text-center sm:px-6">
                  <p className="font-outfit text-sm text-red-700">{errMsg}</p>
                  <KioskButton
                    type="button"
                    variant="ghost"
                    size="md"
                    className="mt-4"
                    onClick={() => refetch()}
                  >
                    {copy.tryAgain}
                  </KioskButton>
                </motion.div>
              ) : guide ? (
                guide.alreadyKnockedIn ? (
                  <motion.div className="px-4 py-8 sm:px-6 sm:py-10">
                    {guide.importantNote ? (
                      <p className="rounded-kiosk-sm border border-emerald-200 bg-emerald-50 px-5 py-4 font-outfit text-base leading-relaxed text-emerald-950 sm:text-lg">
                        {guide.importantNote}
                      </p>
                    ) : (
                      <p className="text-center font-outfit text-sm text-text-muted">
                        This bat is already knocked in and ready for use.
                      </p>
                    )}
                  </motion.div>
                ) : (
                <motion.div className="space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-6">
                  <motion.div className="grid grid-cols-3 gap-3 rounded-kiosk-sm border border-border bg-surface-elevated p-4 text-center sm:gap-4 sm:p-5">
                    <motion.div>
                      <p className="font-sora text-2xl font-black text-brand sm:text-3xl">
                        {guide.totalKnocks ?? "—"}
                      </p>
                      <p className="font-outfit mt-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Total knocks
                      </p>
                    </motion.div>
                    <motion.div>
                      <p className="font-sora text-2xl font-black text-brand sm:text-3xl">
                        {guide.totalDays ?? "—"}
                      </p>
                      <p className="font-outfit mt-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Total days
                      </p>
                    </motion.div>
                    <motion.div>
                      <p className="font-sora text-2xl font-black text-brand sm:text-3xl">
                        {phaseCount}
                      </p>
                      <p className="font-outfit mt-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Phases
                      </p>
                    </motion.div>
                  </motion.div>

                  <motion.div className="space-y-3 sm:space-y-4">
                    {(guide.phases ?? []).map((phase, i) => (
                      <PhaseCard key={phase.number ?? i} phase={phase} index={i} />
                    ))}
                  </motion.div>

                  {guide.importantNote ? (
                    <p className="rounded-kiosk-sm border border-sky-200 bg-sky-50 px-4 py-3 font-outfit text-sm leading-relaxed text-sky-950">
                      {guide.importantNote}
                    </p>
                  ) : null}

                  {!guide.alreadyKnockedIn && !guide.prePrepared ? (
                    <p className="rounded-kiosk-sm border border-red-200 bg-red-50 px-4 py-3 font-outfit text-sm font-semibold leading-relaxed text-red-900">
                      {copy.knockingGuideWarning}
                    </p>
                  ) : null}

                  <motion.div className="grid gap-4 sm:grid-cols-2">
                    <section className="rounded-kiosk-sm border border-emerald-200/80 border-l-[5px] border-l-emerald-600 bg-emerald-50/80 p-4 sm:p-5">
                      <h3 className="font-sora mb-3 text-base font-bold text-emerald-950">
                        Do&apos;s
                      </h3>
                      <RuleList items={guide.dos} variant="do" />
                    </section>
                    <section className="rounded-kiosk-sm border border-red-200/80 border-l-[5px] border-l-red-500 bg-red-50/80 p-4 sm:p-5">
                      <h3 className="font-sora mb-3 text-base font-bold text-red-950">
                        Don&apos;ts
                      </h3>
                      <RuleList items={guide.donts} variant="dont" />
                    </section>
                  </motion.div>
                </motion.div>
                )
              ) : null}
            </motion.div>

            <footer className="shrink-0 border-t border-border bg-surface-subtle px-4 py-4 sm:px-6">
              <KioskButton type="button" className="w-full" onClick={onClose}>
                {copy.close}
              </KioskButton>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
