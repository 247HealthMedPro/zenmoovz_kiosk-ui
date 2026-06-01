import { z } from "zod";
import {
  AGE_MAX,
  AGE_MIN,
  GENDER_SEGMENT,
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/lib/constants/kioskTheme";

const genderValues = Object.values(GENDER_SEGMENT);

export const step2PhysicalSchema = z.object({
  genderCategory: z.enum(genderValues),
  age: z.coerce.number().int().min(AGE_MIN).max(AGE_MAX),
  heightCm: z.coerce.number().min(HEIGHT_MIN_CM).max(HEIGHT_MAX_CM),
  weightKg: z.coerce.number().min(WEIGHT_MIN_KG).max(WEIGHT_MAX_KG),
});
