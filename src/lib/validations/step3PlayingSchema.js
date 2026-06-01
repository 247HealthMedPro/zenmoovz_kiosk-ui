import { z } from "zod";
import {
  BALL_TYPE,
  BATTING_POSITION,
  BATTING_STYLE,
  PLAYING_LEVEL,
  WILLOW_TYPE,
} from "@/lib/constants/kioskTheme";
import { copy } from "@/lib/constants/kioskCopy";

const baseFields = {
  playingLevel: z.enum([
    PLAYING_LEVEL.BEGINNER,
    PLAYING_LEVEL.SCHOOL,
    PLAYING_LEVEL.CLUB,
    PLAYING_LEVEL.DISTRICT,
  ]),
  battingPosition: z.enum([
    BATTING_POSITION.OPENER,
    BATTING_POSITION.TOP_ORDER,
    BATTING_POSITION.MIDDLE_ORDER,
    BATTING_POSITION.LOWER_ORDER,
    BATTING_POSITION.TAIL_ENDER,
  ]),
  battingStyle: z.enum([BATTING_STYLE.RIGHT, BATTING_STYLE.LEFT]),
};

const willowEnum = z.enum([
  WILLOW_TYPE.EW,
  WILLOW_TYPE.KW,
  // WILLOW_TYPE.PLASTIC,
  // WILLOW_TYPE.PRACTICE_COMPOSITE,
]);

const ballTypeEnum = z.enum([
  BALL_TYPE.SOFT_TENNIS,
  BALL_TYPE.HARD_TENNIS,
  BALL_TYPE.CORK,
  BALL_TYPE.LEATHER,
]);

/** @param {boolean} requireWillow */
export function createStep3PlayingSchema(requireWillow) {
  return z
    .object({
      ...baseFields,
      willowType: requireWillow ? willowEnum : willowEnum.optional(),
      ballType: ballTypeEnum.optional(),
    })
    .superRefine((data, ctx) => {
      if (requireWillow && data.willowType === WILLOW_TYPE.KW && !data.ballType) {
        ctx.addIssue({
          code: "custom",
          message: copy.ballTypeRequired,
          path: ["ballType"],
        });
      }
    });
}

export const step3PlayingSchema = createStep3PlayingSchema(true);
