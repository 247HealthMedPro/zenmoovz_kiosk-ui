/** Brand & domain constants */
export const BRAND_HEX = "#16304a";

export { KIOSK_VIEWPORT, TOUCH_MIN_PX, TOUCH_COMFORT_PX } from "@/lib/constants/kioskDesign";

export const MOCK_VERIFY_OTP = "123456";

export const MOBILE_DIGITS = 10;
export const OTP_LENGTH = 6;

export const AGE_MIN = 1;
export const AGE_MAX = 99;
export const HEIGHT_MIN_CM = 110;
export const HEIGHT_MAX_CM = 220;
export const WEIGHT_MIN_KG = 25;
export const WEIGHT_MAX_KG = 200;

/** @deprecated use GENDER_SEGMENT — kept for API gender mapping */
export const GENDER_CATEGORY = {
  MALE: "male",
  FEMALE: "female",
};

/** Step 2 profile segments */
export const GENDER_SEGMENT = {
  JUNIOR_BOY: "junior_boy",
  YOUTH_BOY: "youth_boy",
  MAN: "man",
  JUNIOR_GIRL: "junior_girl",
  YOUTH_GIRL: "youth_girl",
  WOMAN: "woman",
};

export const GENDER_SEGMENT_OPTIONS = [
  { value: GENDER_SEGMENT.JUNIOR_BOY, title: "Junior Boy", hint: "0–12 years", group: "male" },
  { value: GENDER_SEGMENT.YOUTH_BOY, title: "Youth Boy", hint: "13–18 years", group: "male" },
  { value: GENDER_SEGMENT.MAN, title: "Man", hint: "18+ years", group: "male" },
  { value: GENDER_SEGMENT.JUNIOR_GIRL, title: "Junior Girl", hint: "0–12 years", group: "female" },
  { value: GENDER_SEGMENT.YOUTH_GIRL, title: "Youth Girl", hint: "13–18 years", group: "female" },
  { value: GENDER_SEGMENT.WOMAN, title: "Woman", hint: "18+ years", group: "female" },
];

export function isFemaleSegment(segment) {
  return [GENDER_SEGMENT.JUNIOR_GIRL, GENDER_SEGMENT.YOUTH_GIRL, GENDER_SEGMENT.WOMAN].includes(
    segment
  );
}

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

export const BALL_TYPE = {
  SOFT_TENNIS: "soft_tennis_ball",
  HARD_TENNIS: "hard_tennis_ball",
  CORK: "cork_ball",
  LEATHER: "leather_ball",
};

export const BATTING_POSITION = {
  OPENER: "opener",
  TOP_ORDER: "top_order",
  MIDDLE_ORDER: "middle_order",
  LOWER_ORDER: "lower_order",
  TAIL_ENDER: "tail_ender",
};
