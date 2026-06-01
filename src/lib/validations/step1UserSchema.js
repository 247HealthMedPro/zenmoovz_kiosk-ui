import { z } from "zod";
import { MOBILE_DIGITS } from "@/lib/constants/kioskTheme";
import { isValidIndianMobile, normalizeMobile } from "@/lib/utils/mobileValidation";

const mobileField = z
  .string()
  .min(1, "Mobile is required")
  .transform(normalizeMobile)
  .refine(isValidIndianMobile, "Enter a valid 10-digit mobile number");

export const step1DetailsSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  mobile: mobileField,
});

export const step1ContinueSchema = step1DetailsSchema;
