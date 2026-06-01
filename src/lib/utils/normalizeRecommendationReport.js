/**
 * Normalizes API response to { batRecommendation, kitRecommendation }.
 * Supports legacy bat-only payloads at the root.
 */
export function normalizeRecommendationReport(report) {
  if (!report) return null;

  if (report.batRecommendation != null || report.kitRecommendation != null) {
    return {
      batRecommendation: report.batRecommendation ?? null,
      kitRecommendation: report.kitRecommendation ?? null,
    };
  }

  if (report.derivedProfile != null || report.brandRecommendations != null) {
    return {
      batRecommendation: {
        derivedProfile: report.derivedProfile,
        brandRecommendations: report.brandRecommendations ?? [],
      },
      kitRecommendation: null,
    };
  }

  return report;
}

export function reportHasBat(report) {
  const n = normalizeRecommendationReport(report);
  const bat = n?.batRecommendation;
  return Boolean(
    bat?.derivedProfile ||
      (Array.isArray(bat?.brandRecommendations) && bat.brandRecommendations.length > 0)
  );
}

export function reportKitCategories(report) {
  const n = normalizeRecommendationReport(report);
  return n?.kitRecommendation?.categories ?? [];
}
