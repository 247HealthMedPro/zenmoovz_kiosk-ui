/** Human-readable labels for API category codes. */
export const KIT_CATEGORY_LABELS = {
  ABDOMINAL_GUARD: "Abdominal guard",
  ARM_GUARD: "Arm guard",
  BALL: "Ball",
  BAT: "Bat",
  BATTING_GLOVES: "Batting gloves",
  BATTING_PADS: "Batting pads",
  BAT_GRIP: "Bat grip",
  CAP: "Cap",
  HAT: "Hat",
  HELMET: "Helmet",
  KIT_BAG: "Kit bag",
  THIGH_GUARD: "Thigh guard",
  WICKETKEEPING_GLOVES: "WK gloves",
  WICKETKEEPING_PADS: "WK pads",
};

export const KIT_CATEGORY_GROUPS = [
  {
    id: "core",
    title: "Core gear",
    description: "Bat and essential match equipment",
    categories: ["BAT", "BALL", "BAT_GRIP"],
  },
  {
    id: "protection",
    title: "Protection",
    description: "Pads, guards and helmet",
    categories: [
      "HELMET",
      "BATTING_PADS",
      "BATTING_GLOVES",
      "THIGH_GUARD",
      "ARM_GUARD",
      "ABDOMINAL_GUARD",
    ],
  },
  {
    id: "apparel",
    title: "Apparel & carry",
    description: "Caps, hats and kit bag",
    categories: ["CAP", "HAT", "KIT_BAG"],
  },
  {
    id: "wicketkeeping",
    title: "Wicketkeeping",
    description: "Specialist WK gear",
    categories: ["WICKETKEEPING_GLOVES", "WICKETKEEPING_PADS"],
  },
];

export function formatCategoryLabel(code) {
  if (!code) return "";
  return (
    KIT_CATEGORY_LABELS[code] ||
    String(code)
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** e.g. Lokesh's Bat Recommendation, Lokesh's Ball Recommendation */
export function formatCategoryRecommendationTitle(userName, categoryLabel) {
  const raw = String(userName ?? "").trim();
  const category = String(categoryLabel ?? "Kit").trim() || "Kit";
  if (!raw) return `Your ${category} Recommendation`;
  const cap = raw.charAt(0).toUpperCase() + raw.slice(1);
  const possessive = cap.endsWith("s") ? `${cap}'` : `${cap}'s`;
  return `${possessive} ${category} Recommendation`;
}

export function formatKitScore(product) {
  const earned = product?.score;
  const max = product?.maxScore;
  if (earned == null) return "—";
  if (max != null && max > 0) return `${earned}/${max}`;
  return String(earned);
}

export function priorityBadgeClass(priority) {
  const p = String(priority || "").toLowerCase();
  if (p === "core") return "bg-brand text-text-on-brand";
  if (p === "role specific") return "bg-violet-100 text-violet-900";
  return "bg-surface-subtle text-brand";
}
