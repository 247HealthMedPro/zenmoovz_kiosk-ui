"use client";

import { cn } from "@/shared/utils/cn";

export function RecommendationProfileHeader({
  title,
  profileSummary,
  headingId,
  gradientClassName = "bg-gradient-to-r from-emerald-600 to-emerald-700",
}) {
  return (
    <header className={cn("px-4 py-4 sm:px-6 sm:py-5", gradientClassName)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <h2
          id={headingId}
          className="font-sora shrink-0 text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl"
        >
          {title}
        </h2>
        {profileSummary ? (
          <p className="font-outfit min-w-0 text-sm leading-snug text-white/95 sm:max-w-[52%] sm:flex-1 sm:text-right sm:text-base">
            {profileSummary}
          </p>
        ) : null}
      </div>
    </header>
  );
}
