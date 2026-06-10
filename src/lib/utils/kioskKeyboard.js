/**
 * On-screen keyboard helpers for kiosk / fullscreen / PWA.
 * Uses Virtual Keyboard API when available; always scrolls focused inputs into view.
 */

const FOCUSABLE_INPUT_TYPES = new Set([
  "text",
  "tel",
  "url",
  "email",
  "password",
  "search",
  "number",
  "decimal",
]);

export function isKioskTextInput(element) {
  if (!element || typeof element !== "object") return false;
  if (element instanceof HTMLTextAreaElement) return !element.readOnly && !element.disabled;
  if (!(element instanceof HTMLInputElement)) return false;
  if (element.disabled || element.readOnly) return false;
  if (element.type === "hidden" || element.type === "range" || element.type === "checkbox") {
    return false;
  }
  if (!element.type || element.type === "text") return true;
  return FOCUSABLE_INPUT_TYPES.has(element.type);
}

export function showOnScreenKeyboard() {
  if (typeof navigator === "undefined") return;
  try {
    navigator.virtualKeyboard?.show?.();
  } catch {
    // unsupported
  }
}

export function scrollInputIntoView(element) {
  if (!element || typeof element.scrollIntoView !== "function") return;
  window.requestAnimationFrame(() => {
    element.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
  });
}

/** Call on input focus — opens keyboard and keeps field visible above it. */
export function handleKioskInputFocus(event) {
  const el = event?.currentTarget ?? event?.target;
  if (!isKioskTextInput(el)) return;
  showOnScreenKeyboard();
  scrollInputIntoView(el);
}

/**
 * Focus an element and request the on-screen keyboard (after optional delay for animations).
 * @returns {() => void} cleanup
 */
export function focusWithKeyboard(element, { delay = 0 } = {}) {
  if (!element) return () => {};

  const run = () => {
    try {
      element.focus({ preventScroll: true });
    } catch {
      element.focus();
    }
    showOnScreenKeyboard();
    scrollInputIntoView(element);
  };

  if (delay > 0) {
    const id = window.setTimeout(run, delay);
    return () => window.clearTimeout(id);
  }

  run();
  return () => {};
}

/** Merge a user onFocus handler with kiosk keyboard behavior. */
export function withKioskInputFocus(userOnFocus) {
  return (event) => {
    handleKioskInputFocus(event);
    userOnFocus?.(event);
  };
}
