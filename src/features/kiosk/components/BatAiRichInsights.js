"use client";

import { motion } from "framer-motion";
import { copy } from "@/lib/constants/kioskCopy";
import { formatInr } from "@/lib/utils/batRecommendationFormat";
import { hasBatAiRichContent } from "@/lib/utils/batAiRichInfo";
import { cn } from "@/shared/utils/cn";

function IconSparkle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.2 4.2L17.4 7.6 13.2 8.8 12 13l-1.2-4.2L6.6 7.6l4.2-1.4L12 2zm7 7l.9 3.1L23 13l-3.1 1.1L19 17.2l-.9-3.1L15 13l3.1-.9L19 9zm-14 0l.9 3.1L6 13l-3.1 1.1L5 17.2l-.9-3.1L1 13l3.1-.9L5 9z" />
    </svg>
  );
}

function IconCheck({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AdviceCard({ title, children, className, icon: Icon }) {
  if (!children) return null;
  return (
    <div
      className={cn(
        "rounded-kiosk border border-border bg-surface-elevated p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-5 w-5 shrink-0 text-accent" /> : null}
        <h3 className="font-sora text-sm font-bold uppercase tracking-wide text-brand">{title}</h3>
      </div>
      <div className="mt-3 font-outfit text-sm leading-relaxed text-text-primary sm:text-[15px]">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items, className }) {
  const list = (items ?? []).filter(Boolean);
  if (!list.length) return null;
  return (
    <ul className={cn("space-y-2.5", className)}>
      {list.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <IconCheck className="h-3 w-3" />
          </span>
          <span className="font-outfit text-sm leading-relaxed text-text-primary sm:text-[15px]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AlertBanner({ text, variant = "amber" }) {
  if (!String(text ?? "").trim()) return null;
  const styles =
    variant === "sky"
      ? "border-sky-200 bg-sky-50 text-sky-950"
      : "border-amber-200 bg-amber-50 text-amber-950";
  return (
    <p className={cn("rounded-kiosk-sm border px-4 py-3 font-outfit text-sm leading-relaxed", styles)}>
      {text}
    </p>
  );
}

/**
 * @typedef {Object} BatAiRichInfo
 * @property {string} [profileHeadline]
 * @property {string} [bodyFrameAdvice]
 * @property {string} [beginnerAdvice]
 * @property {string} [batSpecAdvice]
 * @property {string[]} [skillDevelopmentAdvice]
 * @property {string} [willowGradeAdvice]
 * @property {string} [bestBatSummary]
 * @property {string} [brandComparison]
 * @property {string} [buyingAdvice]
 * @property {string[]} [knockingGuide]
 * @property {string} [playerMatchExplanation]
 * @property {string} [shopkeeperPitch]
 * @property {string} [warningNote]
 */

/**
 * Profile-level AI guidance — shown after derived profile, before product cards.
 */
export function BatAiRichInsightsOverview({ aiRich, motionProps }) {
  if (!hasBatAiRichContent(aiRich)) return null;

  const hasHero =
    aiRich.profileHeadline?.trim() || aiRich.bodyFrameAdvice?.trim();
  const hasSpecGrid =
    aiRich.batSpecAdvice?.trim() ||
    aiRich.willowGradeAdvice?.trim() ||
    aiRich.beginnerAdvice?.trim();
  const hasSkills = aiRich.skillDevelopmentAdvice?.some(Boolean);
  const hasWarning = aiRich.warningNote?.trim();

  if (!hasHero && !hasSpecGrid && !hasSkills && !hasWarning) return null;

  return (
    <motion.section
      {...motionProps}
      className="space-y-4"
      aria-labelledby="bat-ai-overview-heading"
    >
      <h2 id="bat-ai-overview-heading" className="sr-only">
        {copy.batAiOverviewTitle}
      </h2>

      {hasHero ? (
        <div className="overflow-hidden rounded-kiosk border border-brand/20 bg-gradient-to-br from-brand via-brand-light to-brand shadow-kiosk-soft">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start gap-3">
              <IconSparkle className="mt-0.5 h-6 w-6 shrink-0 text-accent-muted" />
              <div className="min-w-0 flex-1">
                {aiRich.profileHeadline ? (
                  <p className="font-sora text-lg font-bold leading-snug text-text-on-brand sm:text-xl">
                    {aiRich.profileHeadline}
                  </p>
                ) : null}
                {aiRich.bodyFrameAdvice ? (
                  <p className="font-outfit mt-2 text-sm leading-relaxed text-text-on-brand/90 sm:text-base">
                    {aiRich.bodyFrameAdvice}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {hasWarning ? <AlertBanner text={aiRich.warningNote} variant="amber" /> : null}

      {hasSpecGrid ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {aiRich.batSpecAdvice ? (
            <AdviceCard title={copy.batAiBatSpecAdvice}>{aiRich.batSpecAdvice}</AdviceCard>
          ) : null}
          {aiRich.willowGradeAdvice ? (
            <AdviceCard title={copy.batAiWillowAdvice}>{aiRich.willowGradeAdvice}</AdviceCard>
          ) : null}
          {aiRich.beginnerAdvice ? (
            <AdviceCard
              title={copy.batAiBeginnerAdvice}
              className="sm:col-span-2"
              icon={IconSparkle}
            >
              {aiRich.beginnerAdvice}
            </AdviceCard>
          ) : null}
        </div>
      ) : null}

      {hasSkills ? (
        <AdviceCard title={copy.batAiSkillTips} icon={IconSparkle}>
          <BulletList items={aiRich.skillDevelopmentAdvice} />
        </AdviceCard>
      ) : null}
    </motion.section>
  );
}

/**
 * Top pick callout — shown right before brand product lists.
 */
export function BatAiRichBestPick({ aiRich, bestBat, motionProps }) {
  if (!aiRich?.bestBatSummary?.trim() && !aiRich?.playerMatchExplanation?.trim()) {
    return null;
  }

  return (
    <motion.section
      {...motionProps}
      className="overflow-hidden rounded-kiosk border-2 border-emerald-300/80 bg-gradient-to-br from-emerald-50 via-white to-brand-soft/40 shadow-kiosk-soft"
      aria-labelledby="bat-ai-best-pick-heading"
    >
      <div className="border-b border-emerald-200/80 bg-emerald-600/10 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="bat-ai-best-pick-heading"
            className="font-sora text-sm font-bold uppercase tracking-wide text-emerald-900"
          >
            {copy.batAiBestPickTitle}
          </h2>
          {bestBat ? (
            <span className="font-outfit text-xs font-semibold text-emerald-800">
              {bestBat.brand} · {bestBat.productName}
              {bestBat.mrpPrice != null ? ` · ${formatInr(bestBat.mrpPrice)}` : ""}
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
        {aiRich.bestBatSummary ? (
          <p className="font-outfit text-sm leading-relaxed text-brand sm:text-base">
            {aiRich.bestBatSummary}
          </p>
        ) : null}
        {aiRich.playerMatchExplanation ? (
          <div className="rounded-kiosk-sm border border-amber-200/80 bg-amber-50/80 px-4 py-3">
            <p className="font-sora text-xs font-bold uppercase tracking-wide text-amber-900">
              {copy.batAiPlayerMatchTitle}
            </p>
            <p className="font-outfit mt-2 text-sm leading-relaxed text-amber-950">
              {aiRich.playerMatchExplanation}
            </p>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}

/**
 * Post-recommendations guidance — brand compare, buying, knocking, pitch.
 */
export function BatAiRichInsightsSummary({ aiRich, motionProps }) {
  if (!hasBatAiRichContent(aiRich)) return null;

  const hasCompare = aiRich.brandComparison?.trim();
  const hasBuying = aiRich.buyingAdvice?.trim();
  const hasKnocking = aiRich.knockingGuide?.some(Boolean);
  const hasPitch = aiRich.shopkeeperPitch?.trim();

  if (!hasCompare && !hasBuying && !hasKnocking && !hasPitch) return null;

  return (
    <motion.section
      {...motionProps}
      className="space-y-4"
      aria-labelledby="bat-ai-summary-heading"
    >
      <h2
        id="bat-ai-summary-heading"
        className="font-sora text-center text-base font-bold uppercase tracking-wide text-brand sm:text-lg"
      >
        {copy.batAiSummaryTitle}
      </h2>

      {hasCompare ? (
        <AdviceCard title={copy.batAiBrandCompare} className="border-brand/15 bg-brand-soft/30">
          {aiRich.brandComparison}
        </AdviceCard>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        {hasBuying ? (
          <AdviceCard title={copy.batAiBuyingAdvice}>{aiRich.buyingAdvice}</AdviceCard>
        ) : null}
        {hasKnocking ? (
          <AdviceCard
            title={copy.batAiKnockingTips}
            className="border-amber-200/80 bg-amber-50/50"
          >
            <BulletList items={aiRich.knockingGuide} />
          </AdviceCard>
        ) : null}
      </div>

      {hasPitch ? (
        <div className="rounded-kiosk border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-brand-soft px-5 py-4 sm:px-6 sm:py-5">
          <p className="font-sora text-xs font-bold uppercase tracking-widest text-accent">
            {copy.batAiShopkeeperPitch}
          </p>
          <p className="font-outfit mt-2 text-sm leading-relaxed text-brand sm:text-base">
            {aiRich.shopkeeperPitch}
          </p>
        </div>
      ) : null}
    </motion.section>
  );
}
