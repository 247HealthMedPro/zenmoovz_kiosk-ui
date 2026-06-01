import { z } from "zod";
import {
  AGE_MAX,
  AGE_MIN,
  GENDER_CATEGORY,
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/lib/constants/kioskTheme";

export const step2PhysicalSchema = z.object({
  genderCategory: z.enum([GENDER_CATEGORY.MALE, GENDER_CATEGORY.FEMALE]),
  age: z.coerce.number().int().min(AGE_MIN).max(AGE_MAX),
  heightCm: z.coerce.number().min(HEIGHT_MIN_CM).max(HEIGHT_MAX_CM),
  weightKg: z.coerce.number().min(WEIGHT_MIN_KG).max(WEIGHT_MAX_KG),
});
