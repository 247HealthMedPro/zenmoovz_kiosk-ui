export function getBatAiRichInfo(batRecommendation) {
  return batRecommendation?.aiRichInfoResponse ?? batRecommendation?.aiRichInfo ?? null;
}

export function hasBatAiRichContent(ai) {
  if (!ai || typeof ai !== "object") return false;
  const textFields = [
    "profileHeadline",
    "bodyFrameAdvice",
    "beginnerAdvice",
    "batSpecAdvice",
    "willowGradeAdvice",
    "bestBatSummary",
    "brandComparison",
    "buyingAdvice",
    "playerMatchExplanation",
    "shopkeeperPitch",
    "warningNote",
  ];
  if (textFields.some((k) => String(ai[k] ?? "").trim())) return true;
  if (Array.isArray(ai.skillDevelopmentAdvice) && ai.skillDevelopmentAdvice.some(Boolean)) {
    return true;
  }
  if (Array.isArray(ai.knockingGuide) && ai.knockingGuide.some(Boolean)) return true;
  return false;
}

export function getBestBatRecommendation(brandRecommendations) {
  for (const group of brandRecommendations ?? []) {
    const best = (group.recommendations ?? []).find((r) => r.rankType === "BEST_MATCH");
    if (best) return { ...best, brand: group.brand ?? best.brand };
  }
  const first = brandRecommendations?.[0]?.recommendations?.[0];
  if (!first) return null;
  return {
    ...first,
    brand: brandRecommendations[0].brand ?? first.brand,
  };
}
