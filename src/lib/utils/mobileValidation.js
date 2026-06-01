import { MOBILE_DIGITS } from "@/lib/constants/kioskTheme";

export function normalizeMobile(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function sanitizeMobileInput(value) {
  return normalizeMobile(value).slice(0, MOBILE_DIGITS);
}

export function isValidIndianMobile(digits) {
  const d = normalizeMobile(digits);
  return d.length === MOBILE_DIGITS && /^[6-9]\d{9}$/.test(d);
}

export function mobileValidationMessage(digits) {
  const d = normalizeMobile(digits);
  if (!d.length) return null;
  if (d.length < MOBILE_DIGITS) return `Enter ${MOBILE_DIGITS} digits`;
  if (d.length > MOBILE_DIGITS) return `Must start with 6, 7, 8, or 9`;
  return null;
}

const MOBILE_CONTROL_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
]);

export function handleMobileKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (MOBILE_CONTROL_KEYS.has(e.key)) return;
  if (/^\d$/.test(e.key)) return;
  e.preventDefault();
}
