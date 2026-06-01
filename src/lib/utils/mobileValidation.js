import { MOBILE_DIGITS } from "@/lib/constants/kioskTheme";

/** Indian mobile: 10 digits, starts with 6–9 */
export function normalizeMobile(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function isValidIndianMobile(digits) {
  const d = normalizeMobile(digits);
  return d.length === MOBILE_DIGITS && /^[6-9]\d{9}$/.test(d);
}

export function mobileValidationMessage(digits) {
  const d = normalizeMobile(digits);
  if (!d.length) return null;
  if (d.length < MOBILE_DIGITS) return `Enter ${MOBILE_DIGITS} digits`;
  if (d.length > MOBILE_DIGITS) return `Mobile number must be ${MOBILE_DIGITS} digits`;
  if (!/^[6-9]/.test(d)) return "Mobile number must start with 6, 7, 8, or 9";
  return null;
}
