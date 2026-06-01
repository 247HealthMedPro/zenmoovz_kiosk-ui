"use client";

import { motion } from "framer-motion";
import { RecommendationProfileHeader } from "@/features/kiosk/components/RecommendationProfileHeader";
import { useAppSelector } from "@/redux/hooks";
import { formatCategoryRecommendationTitle } from "@/lib/utils/kitCategoryFormat";
import { cn } from "@/shared/utils/cn";

const SPEC_ROWS = [
  { label: "Bat Length", key: "batLengthInches" },
  { label: "Handle", key: "handleType" },
  { label: "Grip Size", key: "gripSize" },
  { label: "Willow", key: "willow" },
  { label: "Batting Hand", key: "battingHand" },
  { label: "Gender / Age Group", key: "genderAgeGroup" },
  { label: "Batting Position", key: "battingPosition" },
  { label: "Edge Thickness", key: "edgeThickness" },
  { label: "Sweet Spot", key: "sweetSpot" },
  { label: "Bat Profile", key: "batProfile" },
];

const INSIGHT_STYLES = [
  "border-emerald-200/80 bg-emerald-50 text-emerald-950",
  "border-sky-200/80 bg-sky-50 text-sky-950",
  "border-amber-200/80 bg-amber-50 text-amber-950",
];

function HighlightMetric({ value, label, sublabel, valueClassName }) {
  return (
    <div className="flex flex-col items-center px-2 text-center sm:px-4">
      <p
        className={cn(
          "font-sora text-3xl font-bold leading-none sm:text-4xl",
          valueClassName ?? "text-emerald-600"
        )}
      >
        {value || "—"}
      </p>
      <p className="font-outfit mt-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </p>
      {sublabel ? (
        <p className="font-outfit mt-0.5 text-[11px] text-slate-500 sm:text-xs">{sublabel}</p>
      ) : null}
    </div>
  );
}

export function DerivedProfileSection({
  derivedProfile,
  motionProps,
  categoryLabel = "Bat",
}) {
  const kioskName = useAppSelector((s) => s.kiosk.name);
  const dp = derivedProfile;
  if (!dp) return null;

  const spec = dp.batSpec ?? {};
  const userName = dp.username || kioskName;
  const title = formatCategoryRecommendationTitle(userName, categoryLabel);
  const specsTitle = spec.weightAdjustment
    ? "Bat specs — position adjusted"
    : "Bat specs";

  const batSizeDisplay = spec.batSizeLabel || spec.batSize || dp.recommendedBatSize || "—";
  const batSizeSub =
    spec.batSize && spec.batSize !== batSizeDisplay ? spec.batSize : undefined;

  return (
    <motion.section
      {...motionProps}
      className="overflow-hidden border-b border-border bg-white"
      aria-labelledby="derived-profile-heading"
    >
      <RecommendationProfileHeader
        headingId="derived-profile-heading"
        title={title}
        profileSummary={dp.profileSummary}
      />

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <h3 className="font-sora text-sm font-bold uppercase tracking-wider text-brand sm:text-base">
          {specsTitle}
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-6 border-b border-slate-100 pb-6 sm:grid-cols-3 sm:gap-4">
          <HighlightMetric
            value={batSizeDisplay}
            label="Bat size"
            sublabel={batSizeSub}
            valueClassName="text-emerald-600"
          />
          <HighlightMetric
            value={spec.batWeightRange}
            label="Bat weight (kg)"
            sublabel={spec.weightAdjustment ? "Position adjusted" : undefined}
            valueClassName="text-brand"
          />
          {spec.weightAdjustment ? (
            <HighlightMetric
              value={spec.weightAdjustment}
              label="Position"
              sublabel={spec.weightReason}
              valueClassName="text-emerald-600"
            />
          ) : (
            <HighlightMetric
              value={spec.willow}
              label="Willow"
              sublabel={dp.recommendedWeightCategory}
              valueClassName="text-emerald-600"
            />
          )}
        </div>

        <dl className="mt-2 divide-y divide-slate-100 font-outfit text-sm sm:text-base">
          {SPEC_ROWS.map(({ label, key }) => {
            const val = spec[key];
            if (val == null || val === "") return null;
            return (
              <div
                key={key}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
              >
                <dt className="font-medium text-slate-600">{label}</dt>
                <dd className="text-right font-semibold text-slate-900">{String(val)}</dd>
              </div>
            );
          })}
        </dl>
      </div>

      {dp.insights?.length ? (
        <div className="space-y-2 px-4 pb-5 sm:space-y-2.5 sm:px-6 sm:pb-6">
          {dp.insights.map((line, i) => (
            <p
              key={i}
              className={cn(
                "rounded-kiosk-sm border px-4 py-3 font-outfit text-sm leading-relaxed sm:text-[15px]",
                INSIGHT_STYLES[i % INSIGHT_STYLES.length]
              )}
            >
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </motion.section>
  );
}
