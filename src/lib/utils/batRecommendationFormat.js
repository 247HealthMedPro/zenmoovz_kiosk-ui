export function formatInr(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

export const SCORE_LABELS = {
  ageGroupScore: "Age group",
  heightBatSizeScore: "Height / bat size",
  weightBatWeightScore: "Weight / bat weight",
  battingPositionScore: "Batting position",
  playingLevelScore: "Playing level",
  willowTypeScore: "Willow type",
};

/** Maximum points per category (sum = 640). */
export const SCORE_MAX = {
  ageGroupScore: 80,
  heightBatSizeScore: 140,
  weightBatWeightScore: 100,
  battingPositionScore: 100,
  playingLevelScore: 120,
  willowTypeScore: 100,
};

export function getScoreMaxTotal(breakdown) {
  if (!breakdown || typeof breakdown !== "object") return 0;
  return Object.keys(SCORE_LABELS).reduce((sum, key) => {
    if (breakdown[key] == null) return sum;
    return sum + (SCORE_MAX[key] ?? 0);
  }, 0);
}

export function formatTotalScore(rec) {
  const earned = rec?.totalScore;
  const max = getScoreMaxTotal(rec?.scoreBreakdown);
  if (earned == null || Number.isNaN(Number(earned))) return "—";
  if (max > 0) return `${Number(earned)}/${max}`;
  return String(earned);
}

export function formatRankType(rankType) {
  if (rankType === "BEST_MATCH") return "Best match";
  if (rankType === "ALTERNATIVE_MATCH" || rankType === "ALTERNATIVE") return "Alternative";
  return String(rankType || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toSpecRows(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([k, v]) => [
    k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    v,
  ]);
}

export function formatSpecValue(v) {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}
