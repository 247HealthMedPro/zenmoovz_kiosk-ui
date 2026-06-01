/** Brand & kiosk tuning — avoid magic numbers in UI */
export const BRAND_HEX = "#16304A";

/** Mock OTP for QA (matches RTK verifyOtp mock) */
export const MOCK_VERIFY_OTP = "123456";

export const MOBILE_DIGITS = 10;
export const OTP_LENGTH = 6;

export const AGE_MIN = 0;
export const AGE_MAX = 99;
export const HEIGHT_MIN_CM = 110;
export const HEIGHT_MAX_CM = 220;
export const WEIGHT_MIN_KG = 25;
export const WEIGHT_MAX_KG = 200;

export const GENDER_CATEGORY = {
  MALE: "male",
  FEMALE: "female",
};

export const PLAYING_LEVEL = {
  BEGINNER: "beginner",
  SCHOOL: "school_academy",
  CLUB: "club_cricket",
  DISTRICT: "district_state",
};

export const BATTING_STYLE = {
  RIGHT: "right_hand",
  LEFT: "left_hand",
};

export const WILLOW_TYPE = {
  EW: "english_willow",
  KW: "kashmir_willow",
  PLASTIC: "plastic",
  PRACTICE_COMPOSITE: "practice_composite",
};

/** Ball type when Kashmir Willow is selected (step 3) */
export const BALL_TYPE = {
  SOFT_TENNIS: "soft_tennis_ball",
  HARD_TENNIS: "hard_tennis_ball",
  CORK: "cork_ball",
  LEATHER: "leather_ball",
};

/** Batting order / position in the line-up */
export const BATTING_POSITION = {
  OPENER: "opener",
  TOP_ORDER: "top_order",
  MIDDLE_ORDER: "middle_order",
  LOWER_ORDER: "lower_order",
  TAIL_ENDER: "tail_ender",
};
