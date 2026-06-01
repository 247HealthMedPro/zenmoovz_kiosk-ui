import { copy } from "@/lib/constants/kioskCopy";

export function BatFallbackNotice({ rec }) {
  if (!rec?.fallback || !rec?.fallbackReason) return null;

  return (
    <div role="status" aria-live="polite">
      <p className="font-sora text-xs font-bold uppercase tracking-wide text-sky-900">
        {copy.batFallbackNoticeTitle}
        {rec.resolvedLevel ? (
          <span className="font-outfit font-semibold normal-case text-sky-800">
            {" "}
            · {rec.resolvedLevel}
          </span>
        ) : null}
      </p>
      <p className="font-outfit mt-1.5 text-sm leading-relaxed text-sky-950">{rec.fallbackReason}</p>
    </div>
  );
}
