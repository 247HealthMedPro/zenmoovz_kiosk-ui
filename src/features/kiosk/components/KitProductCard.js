"use client";

import { formatInr } from "@/lib/utils/batRecommendationFormat";
import { formatKitScore } from "@/lib/utils/kitCategoryFormat";
import { copy } from "@/lib/constants/kioskCopy";
import { cn } from "@/shared/utils/cn";

const CARD_SKINS = [
  "border-sky-200/70 bg-gradient-to-br from-sky-50 via-white to-sky-50/30",
  "border-violet-200/60 bg-gradient-to-br from-violet-50/90 via-white to-violet-50/20",
  "border-teal-200/60 bg-gradient-to-br from-teal-50/80 via-white to-teal-50/25",
];

export function KitProductCard({ product, rankIndex = 0 }) {
  const skin = CARD_SKINS[rankIndex % CARD_SKINS.length];

  return (
    <article className={cn("relative p-4 sm:p-5", skin)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-outfit text-xs font-semibold uppercase tracking-wider text-slate-500">
            {product.brand}
          </p>
          <h3 className="font-sora text-lg font-bold leading-snug text-brand sm:text-xl">
            {product.productName}
          </h3>
          {product.shortMarketingDescription ? (
            <p className="font-outfit text-sm leading-relaxed text-slate-600">
              {product.shortMarketingDescription}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-sora text-xl font-bold text-brand">{formatInr(product.mrpPrice)}</p>
          <p className="mt-1 font-outfit text-xs text-slate-500">MRP</p>
          <div className="mt-2 inline-flex flex-col items-end rounded-kiosk-sm border border-white/60 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="font-sora text-lg font-bold text-brand">
              {product.matchPercentage != null ? `${product.matchPercentage}%` : "—"}
            </span>
            <span className="font-outfit text-[10px] font-semibold uppercase text-slate-500">
              {copy.kitMatchScore} · {formatKitScore(product)}
            </span>
          </div>
        </div>
      </div>

      {product.recommendationReason ? (
        <div className="mt-4 rounded-kiosk-sm border border-white/80 bg-white/60 p-3 backdrop-blur-sm">
          <p className="font-outfit text-[11px] font-bold uppercase tracking-wide text-brand">
            {copy.kitRecommendationReason}
          </p>
          <p className="mt-1 font-outfit text-sm leading-relaxed text-slate-800">
            {product.recommendationReason}
          </p>
        </div>
      ) : null}

      {(product.matchedFields?.length > 0 || product.missingFields?.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {(product.matchedFields ?? []).map((f) => (
            <span
              key={`m-${f}`}
              className="rounded-full bg-emerald-100/90 px-3 py-1 font-outfit text-xs font-semibold text-emerald-900"
            >
              {copy.kitMatchedFields}: {f}
            </span>
          ))}
          {(product.missingFields ?? []).map((f) => (
            <span
              key={`x-${f}`}
              className="rounded-full bg-amber-100/90 px-3 py-1 font-outfit text-xs font-semibold text-amber-950"
            >
              {copy.kitMissingFields}: {f}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
