"use client";

import { useEffect } from "react";
import {
  handleKioskInputFocus,
  isKioskTextInput,
} from "@/lib/utils/kioskKeyboard";

/**
 * Global focus handler for all kiosk text inputs (works with react-hook-form register spread).
 */
export function KioskKeyboardEnhancer() {
  useEffect(() => {
    const onFocusIn = (event) => {
      if (!isKioskTextInput(event.target)) return;
      handleKioskInputFocus(event);
    };

    document.addEventListener("focusin", onFocusIn, true);
    return () => document.removeEventListener("focusin", onFocusIn, true);
  }, []);

  return null;
}
