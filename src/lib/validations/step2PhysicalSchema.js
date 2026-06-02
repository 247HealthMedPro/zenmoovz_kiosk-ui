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
  age: z.coerce
    .number({ invalid_type_error: "Enter a valid age" })
    .int()
    .min(AGE_MIN, `Age must be between ${AGE_MIN} and ${AGE_MAX}`)
    .max(AGE_MAX, `Age must be between ${AGE_MIN} and ${AGE_MAX}`),
  heightCm: z.coerce
    .number({ invalid_type_error: "Enter a valid height" })
    .min(HEIGHT_MIN_CM, `Height must be between ${HEIGHT_MIN_CM} and ${HEIGHT_MAX_CM} cm`)
    .max(HEIGHT_MAX_CM, `Height must be between ${HEIGHT_MIN_CM} and ${HEIGHT_MAX_CM} cm`),
  weightKg: z.coerce
    .number({ invalid_type_error: "Enter a valid weight" })
    .min(WEIGHT_MIN_KG, `Weight must be between ${WEIGHT_MIN_KG} and ${WEIGHT_MAX_KG} kg`)
    .max(WEIGHT_MAX_KG, `Weight must be between ${WEIGHT_MIN_KG} and ${WEIGHT_MAX_KG} kg`),
});
