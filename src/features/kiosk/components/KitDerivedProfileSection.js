"use client";

import { motion } from "framer-motion";
import { RecommendationProfileHeader } from "@/features/kiosk/components/RecommendationProfileHeader";
import { useAppSelector } from "@/lib/store/hooks";
import { formatCategoryRecommendationTitle } from "@/lib/utils/kitCategoryFormat";
import { cn } from "@/shared/utils/cn";

const INSIGHT_STYLES = [
  "border-sky-200/80 bg-sky-50 text-sky-950",
  "border-violet-200/80 bg-violet-50 text-violet-950",
  "border-teal-200/80 bg-teal-50 text-teal-950",
  "border-indigo-200/80 bg-indigo-50 text-indigo-950",
];

/** Rows shown under highlights (avoid duplicating the three hero metrics). */
const DETAIL_ROWS = [
  { label: "Gender / age group", key: "genderAgeGroup" },
  { label: "Age group", key: "ageGroup" },
  { label: "Gender", key: "gender" },
  { label: "Batting hand", key: "battingHand" },
  { label: "Ball type", key: "ballType" },
];

function formatKitRecommendationTitle(name) {
  const raw = String(name || "").trim();
  if (!raw) return "Your kit recommendation";
  const cap = raw.charAt(0).toUpperCase() + raw.slice(1);
  return cap.endsWith("s") ? `${cap}' Kit Recommendation` : `${cap}'s Kit Recommendation`;
}

function HighlightMetric({ value, label, sublabel, valueClassName }) {
  return (
    <div className="flex flex-col items-center px-2 text-center sm:px-4">
      <p
        className={cn(
          "font-sora text-2xl font-bold leading-none sm:text-3xl",
          valueClassName ?? "text-sky-700"
        )}
      >
        {value || "—"}
      </p>
      <p className="font-outfit mt-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </p>
      {sublabel ? (
        <p className="font-outfit mt-0.5 max-w-[14rem] text-[11px] leading-snug text-slate-500 sm:text-xs">
          {sublabel}
        </p>
      ) : null}
    </div>
  );
}

export function KitDerivedProfileSection({ profile, categoryLabel, motionProps }) {
  const kioskName = useAppSelector((s) => s.kiosk.name);
  if (!profile || typeof profile !== "object") return null;

  const userName = profile.userName ?? profile.username ?? kioskName;
  const title = formatCategoryRecommendationTitle(userName, categoryLabel);
  const size = profile.sizeCategory;
  const build = profile.buildCategory;
  const level = profile.playingLevel;
  const role = profile.role;
  const protection = profile.protectionLevel;
  const willow = profile.willowType;

  return (
    <motion.section
      {...motionProps}
      className="overflow-hidden border-b border-border bg-white"
      aria-labelledby="kit-derived-profile-heading"
    >
      <RecommendationProfileHeader
        headingId="kit-derived-profile-heading"
        title={title}
        profileSummary={profile.profileSummary}
        gradientClassName="bg-gradient-to-r from-sky-600 to-indigo-700"
      />

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <h3 className="font-sora text-sm font-bold uppercase tracking-wider text-brand sm:text-base">
          Fit, level & protection
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-6 border-b border-slate-100 pb-6 sm:grid-cols-3 sm:gap-4">
          <HighlightMetric
            value={size}
            label="Size category"
            sublabel={build || undefined}
            valueClassName="text-sky-600"
          />
          <HighlightMetric
            value={level}
            label="Playing level"
            sublabel={role || undefined}
            valueClassName="text-indigo-700"
          />
          <HighlightMetric
            value={protection}
            label="Protection level"
            sublabel={willow || undefined}
            valueClassName="text-teal-700"
          />
        </div>

        <dl className="mt-2 divide-y divide-slate-100 font-outfit text-sm sm:text-base">
          {DETAIL_ROWS.map(({ label, key }) => {
            const val = profile[key];
            if (val == null || val === "") return null;
            return (
              <div
                key={key}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
              >
                <dt className="font-medium text-slate-600">{label}</dt>
                <dd className="max-w-[70%] text-right font-semibold text-slate-900">{String(val)}</dd>
              </div>
            );
          })}
        </dl>
      </div>

      {profile.insights?.length ? (
        <div className="space-y-2 px-4 pb-5 sm:space-y-2.5 sm:px-6 sm:pb-6">
          {profile.insights.map((line, i) => (
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
