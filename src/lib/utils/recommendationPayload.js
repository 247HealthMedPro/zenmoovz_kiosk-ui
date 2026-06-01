import {
  BALL_TYPE,
  BATTING_POSITION,
  isFemaleSegment,
  PLAYING_LEVEL,
  WILLOW_TYPE,
} from "@/lib/constants/kioskTheme";

const BATTING_POSITION_API = {
  [BATTING_POSITION.OPENER]: "Opener",
  [BATTING_POSITION.TOP_ORDER]: "Top Order",
  [BATTING_POSITION.MIDDLE_ORDER]: "Middle Order",
  [BATTING_POSITION.LOWER_ORDER]: "Lower Order",
  [BATTING_POSITION.TAIL_ENDER]: "Tail Ender",
};

const PLAYING_LEVEL_API = {
  [PLAYING_LEVEL.BEGINNER]: "Beginner",
  [PLAYING_LEVEL.SCHOOL]: "Beginner",
  [PLAYING_LEVEL.CLUB]: "Intermediate",
  [PLAYING_LEVEL.DISTRICT]: "Professional",
};

const WILLOW_TYPE_API = {
  [WILLOW_TYPE.EW]: "English Willow",
  [WILLOW_TYPE.KW]: "Kashmir Willow",
  [WILLOW_TYPE.PLASTIC]: "Plastic",
  [WILLOW_TYPE.PRACTICE_COMPOSITE]: "Practice Composite",
};

const BALL_TYPE_API = {
  [BALL_TYPE.SOFT_TENNIS]: "Soft tennis ball",
  [BALL_TYPE.HARD_TENNIS]: "Hard tennis ball",
  [BALL_TYPE.CORK]: "Cork ball",
  [BALL_TYPE.LEATHER]: "Leather ball",
};

/**
 * POST /api/kiosk/recommendations/bats
 * @param {Record<string, unknown>} kiosk
 */
export function buildRecommendationPayload(kiosk) {
  const username = String(kiosk?.name ?? "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 64);

  const modes = Array.isArray(kiosk.recommendationMode)
    ? kiosk.recommendationMode.filter(Boolean)
    : [];

  const willowType = WILLOW_TYPE_API[kiosk.willowType] || "English Willow";
  const ballType =
    kiosk.willowType === WILLOW_TYPE.KW && kiosk.ballType
      ? BALL_TYPE_API[kiosk.ballType]
      : undefined;

  const payload = {
    age: Number(kiosk.age),
    heightCm: Number(kiosk.heightCm),
    weightKg: Number(kiosk.weightKg),
    battingPosition: BATTING_POSITION_API[kiosk.battingPosition] || "Opener",
    playingLevel: PLAYING_LEVEL_API[kiosk.playingLevel] || "Beginner",
    willowType,
    username: username || "guest",
    gender: isFemaleSegment(kiosk.genderCategory) ? "female" : "male",
    genderSegment: kiosk.genderCategory || undefined,
    battingHand: kiosk.battingStyle === "left_hand" ? "left" : "right",
    recommendationMode: modes,
  };

  if (ballType) {
    payload.ballType = ballType;
  }

  return payload;
}

/** @deprecated use buildRecommendationPayload */
export const buildBatsRecommendationPayload = buildRecommendationPayload;
